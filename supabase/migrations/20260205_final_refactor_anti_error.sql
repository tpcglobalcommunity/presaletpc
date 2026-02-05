-- Migration: 20260205_final_refactor_anti_error.sql
-- Purpose: Final refactor anti-error auth+buy flow (sponsor moved to invoice)
-- Safety: All idempotent, production-safe

-- 0) Safety
set search_path = public;

-- A) PROFILES TABLE HARDEN
-- Ensure public.profiles exists and has required columns
do $$
begin
  -- Add missing columns if not exist
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='email') then
    alter table public.profiles add column email text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='role') then
    alter table public.profiles add column role text default 'member';
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='is_active') then
    alter table public.profiles add column is_active boolean default true;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='member_code') then
    alter table public.profiles add column member_code text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='sponsor_user_id') then
    alter table public.profiles add column sponsor_user_id uuid references auth.users(id) on delete set null;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='created_at') then
    alter table public.profiles add column created_at timestamptz default now();
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='updated_at') then
    alter table public.profiles add column updated_at timestamptz default now();
  end if;
  
  -- Ensure unique constraint on member_code
  if not exists (select 1 from information_schema.table_constraints 
    where table_name='profiles' and constraint_name='profiles_member_code_unique') then
    alter table public.profiles add constraint profiles_member_code_unique unique (member_code);
  end if;
end$$;

-- B) REFERRALS TABLE (DIRECT ONLY)
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint referrals_unique_referred unique (referred_user_id)
);

create index if not exists idx_referrals_sponsor_id on public.referrals (sponsor_id);
create index if not exists idx_referrals_created_at on public.referrals (created_at);

-- C) ENSURE_PROFILE_MINIMAL() — NO FAIL
create or replace function public.ensure_profile_minimal()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  existing_profile profiles%ROWTYPE;
begin
  -- Check authentication
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  -- Get user email
  select email into v_email from auth.users where id = v_uid;
  if v_email is null then
    raise exception 'USER_NOT_FOUND';
  end if;

  -- Check if profile exists
  select * into existing_profile 
  from public.profiles 
  where user_id = v_uid;

  if existing_profile is null then
    -- NEW USER: Insert minimal profile
    insert into public.profiles (
      user_id,
      email,
      role,
      is_active,
      created_at,
      updated_at
    ) values (
      v_uid,
      v_email,
      'member',
      true,
      now(),
      now()
    );
  else
    -- EXISTING USER: Update email and timestamp
    update public.profiles set
      email = coalesce(v_email, email),
      updated_at = now()
    where user_id = v_uid;
  end if;
end;
$$;

-- D) RESOLVE_REFERRAL_CODE() — OPTIONAL
create or replace function public.resolve_referral_code(p_referral_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_normalized_code text;
  v_sponsor_id uuid;
begin
  -- Normalize code
  v_normalized_code := upper(trim(coalesce(p_referral_code, '')));
  
  -- If empty -> return null
  if v_normalized_code = '' then
    return null;
  end if;
  
  -- Find sponsor by member code
  select user_id into v_sponsor_id
  from public.profiles
  where member_code = v_normalized_code
    and coalesce(is_active, true) = true
    and user_id is not null
  limit 1;
  
  return v_sponsor_id;
end;
$$;

-- E) PICK_SPONSOR_B1() — FAIR, OPTIONAL
create or replace function public.pick_sponsor_b1()
returns uuid
language sql
security definer
set search_path = public
as $$
  with sponsor_counts as (
    select
      p.user_id,
      p.created_at,
      count(r.referred_user_id) as direct_count
    from public.profiles p
    left join public.referrals r
      on r.sponsor_id = p.user_id
    where 
      p.role = 'member'
      and coalesce(p.is_active, true) = true
      and p.user_id is not null
    group by p.user_id, p.created_at
  )
  select user_id
  from sponsor_counts
  order by
    direct_count asc,
    created_at asc,
    user_id asc
  limit 1;
$$;

-- F) CREATE_INVOICE_LOCKED PATCH — SPONSOR MOVED HERE
create or replace function public.create_invoice_locked(
  p_email text,
  p_referral_code text,
  p_base_currency text,
  p_amount_input numeric,
  p_wallet_tpc text
)
returns table (
  invoice_no text,
  user_id uuid,
  email text,
  referral_code_input text,
  sponsor_id_applied uuid,
  base_currency text,
  amount_input numeric,
  amount_usd numeric,
  tpc_amount numeric,
  status text,
  transfer_method text,
  wallet_tpc text,
  created_at timestamptz,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_invoice_no text;
  v_amount_usd numeric;
  v_tpc_amount numeric;
  v_expires_at timestamptz;
  v_referral_code_normalized text;
  v_sponsor_from_code uuid;
  v_sponsor_auto uuid;
  v_sponsor_id_applied uuid;
  v_fixed_rate numeric := 17000; -- Fixed rate: 1 USDC = 17000 IDR
begin
  -- Check authentication
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  -- Validate input
  if p_email is null or p_email = '' then
    raise exception 'EMAIL_REQUIRED';
  end if;
  
  if p_base_currency is null or p_base_currency = '' then
    raise exception 'CURRENCY_REQUIRED';
  end if;
  
  if p_amount_input is null or p_amount_input <= 0 then
    raise exception 'AMOUNT_REQUIRED';
  end if;
  
  if p_wallet_tpc is null or p_wallet_tpc = '' then
    raise exception 'WALLET_REQUIRED';
  end if;

  -- Generate invoice number
  v_invoice_no := 'INV-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(md5(v_uid::text || now()::text), 1, 8));
  
  -- Calculate USD amount
  case p_base_currency
    when 'USDC' then v_amount_usd := p_amount_input;
    when 'IDR' then v_amount_usd := p_amount_input / v_fixed_rate;
    when 'SOL' then 
      -- Get current SOL price (placeholder - should be from price oracle)
      v_amount_usd := p_amount_input * 150; -- $150/SOL placeholder
    else 
      raise exception 'INVALID_CURRENCY';
  end case;
  
  -- Calculate TPC amount (using stage 1 price: $0.10 per TPC)
  v_tpc_amount := v_amount_usd / 0.10;
  
  -- Set expiry (24 hours from now)
  v_expires_at := now() + interval '24 hours';
  
  -- SPONSOR LOGIC: Best effort, never fails
  v_referral_code_normalized := upper(trim(coalesce(p_referral_code, '')));
  
  -- 1) Try sponsor from referral code
  v_sponsor_from_code := public.resolve_referral_code(v_referral_code_normalized);
  
  if v_sponsor_from_code is not null then
    v_sponsor_id_applied := v_sponsor_from_code;
  else
    -- 2) Try auto sponsor
    v_sponsor_auto := public.pick_sponsor_b1();
    
    if v_sponsor_auto is not null then
      v_sponsor_id_applied := v_sponsor_auto;
    else
      -- 3) No sponsor available - DO NOT FAIL
      v_sponsor_id_applied := null;
    end if;
  end if;
  
  -- Create invoice (sponsor_id_applied can be null)
  insert into public.invoices (
    invoice_no,
    user_id,
    email,
    referral_code_input,
    sponsor_id_applied,
    base_currency,
    amount_input,
    amount_usd,
    tpc_amount,
    status,
    transfer_method,
    wallet_tpc,
    created_at,
    expires_at,
    updated_at
  ) values (
    v_invoice_no,
    v_uid,
    lower(trim(p_email)),
    v_referral_code_normalized,
    v_sponsor_id_applied,
    p_base_currency,
    p_amount_input,
    v_amount_usd,
    v_tpc_amount,
    'UNPAID',
    case p_base_currency
      when 'USDC' then 'USDC'
      when 'IDR' then 'BCA'
      when 'SOL' then 'SOL'
      else null
    end,
    p_wallet_tpc,
    now(),
    v_expires_at,
    now()
  );
  
  -- Create referral record if sponsor was assigned
  if v_sponsor_id_applied is not null then
    insert into public.referrals (sponsor_id, referred_user_id, reason)
    values (v_sponsor_id_applied, v_uid, 'INVOICE_CREATION')
    on conflict (referred_user_id) do nothing;
  end if;
  
  -- Return created invoice
  return query
  select 
    i.invoice_no,
    i.user_id,
    i.email,
    i.referral_code_input,
    i.sponsor_id_applied,
    i.base_currency,
    i.amount_input,
    i.amount_usd,
    i.tpc_amount,
    i.status,
    i.transfer_method,
    i.wallet_tpc,
    i.created_at,
    i.expires_at
  from public.invoices i
  where i.invoice_no = v_invoice_no;
end;
$$;

-- G) INVOICES TABLE HARDEN (IF NEEDED)
do $$
begin
  -- Add missing columns if not exist
  if not exists (select 1 from information_schema.columns where table_name='invoices' and column_name='referral_code_input') then
    alter table public.invoices add column referral_code_input text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='invoices' and column_name='sponsor_id_applied') then
    alter table public.invoices add column sponsor_id_applied uuid;
  end if;
end$$;

-- H) RLS SAFETY (MINIMAL)
-- Grant execute permissions
grant execute on function public.ensure_profile_minimal() to authenticated, service_role;
grant execute on function public.resolve_referral_code(text) to authenticated, service_role;
grant execute on function public.pick_sponsor_b1() to authenticated, service_role;
grant execute on function public.create_invoice_locked(text, text, text, numeric, text) to authenticated, service_role;

-- Verify functions exist
do $$
begin
  if exists (select 1 from pg_proc where proname = 'ensure_profile_minimal' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ ensure_profile_minimal function created successfully';
  else
    raise exception '❌ ensure_profile_minimal function creation failed';
  end if;
  
  if exists (select 1 from pg_proc where proname = 'resolve_referral_code' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ resolve_referral_code function created successfully';
  else
    raise exception '❌ resolve_referral_code function creation failed';
  end if;
  
  if exists (select 1 from pg_proc where proname = 'pick_sponsor_b1' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ pick_sponsor_b1 function created successfully';
  else
    raise exception '❌ pick_sponsor_b1 function creation failed';
  end if;
  
  if exists (select 1 from pg_proc where proname = 'create_invoice_locked' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ create_invoice_locked function created successfully';
  else
    raise exception '❌ create_invoice_locked function creation failed';
  end if;
end $$;
