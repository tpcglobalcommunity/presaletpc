-- Migration: 20260205_auto_sponsor_logic.sql
-- Purpose: Move ALL sponsor logic to post-login flow only
-- Safety: Idempotent, production-safe

-- 0) Safety
set search_path = public;

-- 1) ENSURE SYSTEM SPONSOR EXISTS (TPC-GLOBAL)
insert into public.profiles (
  user_id, 
  email_initial, 
  email_current, 
  member_code, 
  display_name, 
  role, 
  is_active, 
  created_at, 
  updated_at
) values (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'system@tpcglobal.io',
  'system@tpcglobal.io', 
  'TPC-GLOBAL',
  'TPC Global System',
  'system',
  true,
  now(),
  now()
) on conflict (user_id) do nothing;

-- 2) CREATE POST-LOGIN PROFILE CREATION
create or replace function public.create_profile_post_login()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_referral_code text;
  v_sponsor_id uuid;
  v_sponsor_code text;
  v_assignment_reason text;
  existing_profile profiles%ROWTYPE;
begin
  -- Check authentication
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  -- Get user email and referral code
  select email into v_email from auth.users where id = v_uid;
  v_referral_code := coalesce(raw_user_meta_data->>'referral_code', '');
  
  -- Check if profile exists
  select * into existing_profile 
  from public.profiles 
  where user_id = v_uid;

  if existing_profile is null then
    -- NEW USER: Handle sponsor assignment
    -- Try manual referral first
    if v_referral_code is not null and v_referral_code != '' then
      select p.user_id, p.member_code
      into v_sponsor_id, v_sponsor_code
      from public.profiles p
      where upper(p.member_code) = upper(v_referral_code)
        and coalesce(p.is_active, true) = true
        and p.user_id is not null
        and p.user_id != v_uid
      limit 1;
      
      if v_sponsor_id is not null then
        v_assignment_reason := 'MANUAL_REFERRAL';
      end if;
    end if;
    
    -- If no manual sponsor, try auto sponsor
    if v_sponsor_id is null then
      select public.pick_sponsor_b1() into v_sponsor_id;
      
      if v_sponsor_id is not null then
        select member_code into v_sponsor_code
        from public.profiles
        where user_id = v_sponsor_id;
        
        v_assignment_reason := 'AUTO_B1_LOWEST_DIRECT';
      else
        -- Fallback to system sponsor
        v_sponsor_id := '00000000-0000-0000-0000-000000000001'::uuid;
        v_sponsor_code := 'TPC-GLOBAL';
        v_assignment_reason := 'SYSTEM_FALLBACK';
      end if;
    end if;
    
    -- Insert new profile with sponsor
    insert into public.profiles (
      user_id,
      email_initial,
      email_current,
      member_code,
      display_name,
      role,
      is_active,
      sponsor_user_id,
      created_at,
      updated_at
    ) values (
      v_uid,
      v_email,
      v_email,
      'TPC-' || upper(substring(md5(v_uid::text) from 1 for 6)),
      coalesce(split_part(v_email, '@', 1), v_email),
      'member',
      true,
      v_sponsor_id,
      now(),
      now()
    );
    
    -- Create referral record
    if v_sponsor_id is not null then
      insert into public.referrals (sponsor_id, referred_user_id, reason)
      values (v_sponsor_id, v_uid, v_assignment_reason)
      on conflict (referred_user_id) do nothing;
    end if;
    
  else
    -- EXISTING USER: Update email and timestamp
    update public.profiles set
      email_current = v_email,
      updated_at = now()
    where user_id = v_uid;
  end if;
end;
$$;

-- 3) UPDATE INVOICE CREATION TO USE POST-LOGIN SPONSOR
create or replace function public.create_invoice_with_sponsor(
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
  v_sponsor_id_applied uuid;
  v_fixed_rate numeric := 17000; -- Fixed rate: 1 USDC = 17000 IDR
begin
  -- Check authentication
  if v_uid is null then
    -- For public buy, use guest ID
    v_uid := gen_random_uuid();
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
  
  -- SPONSOR LOGIC: Use sponsor from user profile (post-login)
  v_referral_code_normalized := upper(trim(coalesce(p_referral_code, '')));
  
  -- Get sponsor from user's profile (assigned during login)
  select sponsor_user_id into v_sponsor_id_applied
  from public.profiles
  where user_id = v_uid;
  
  -- Create invoice (sponsor_id_applied from user profile)
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

-- 4) Grant permissions
grant execute on function public.create_profile_post_login() to authenticated, service_role;
grant execute on function public.create_invoice_with_sponsor() to authenticated, service_role;

-- 5) Verify functions exist
do $$
begin
  if exists (select 1 from pg_proc where proname = 'create_profile_post_login' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ create_profile_post_login function created successfully';
  else
    raise exception '❌ create_profile_post_login function creation failed';
  end if;
  
  if exists (select 1 from pg_proc where proname = 'create_invoice_with_sponsor' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ create_invoice_with_sponsor function created successfully';
  else
    raise exception '❌ create_invoice_with_sponsor function creation failed';
  end if;
end $$;
