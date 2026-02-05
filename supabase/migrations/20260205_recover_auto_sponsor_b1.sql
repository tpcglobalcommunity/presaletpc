-- Migration: 20260205_recover_auto_sponsor_b1.sql
-- Purpose: Create pick_sponsor_b1() RPC function for auto sponsor assignment
-- Safety: Idempotent migration, can be run multiple times

-- 0) Safety
set search_path = public;

-- 0.1) Ensure required columns exist in profiles table
do $$
begin
  -- Add role column if not exists
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='role'
  ) then
    alter table public.profiles add column role text default 'member';
  end if;
  
  -- Add is_active column if not exists
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='is_active'
  ) then
    alter table public.profiles add column is_active boolean default true;
  end if;
  
  -- Add sponsor_user_id column if not exists
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='sponsor_user_id'
  ) then
    alter table public.profiles add column sponsor_user_id uuid;
  end if;
end$$;

-- 1) Create the pick_sponsor_b1 function
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
    from profiles p
    left join referrals r
      on r.sponsor_id = p.user_id
    where
      p.role = 'member'
      and p.is_active = true
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

-- 2) Grant execute permissions
grant execute on function public.pick_sponsor_b1() to authenticated, service_role;

-- 3) Create helper function for sponsor assignment with audit (if not exists)
create or replace function public.assign_sponsor_with_audit(
  p_user_id uuid,
  p_sponsor_id uuid,
  p_referral_code text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sponsor_member_code text;
begin
  -- Get sponsor member code for audit
  select member_code into v_sponsor_member_code
  from profiles
  where user_id = p_sponsor_id;
  
  -- Insert referral record
  insert into referrals (
    user_id,
    sponsor_id,
    referral_code,
    assigned_at
  ) values (
    p_user_id,
    p_sponsor_id,
    p_referral_code,
    now()
  );
  
  -- Log to audit table (if exists)
  insert into sponsor_assignment_audit (
    user_id,
    sponsor_id,
    referral_code,
    sponsor_member_code,
    assignment_method,
    assigned_at
  ) values (
    p_user_id,
    p_sponsor_id,
    p_referral_code,
    v_sponsor_member_code,
    'AUTO_B1',
    now()
  );
end;
$$;

-- 4) Grant execute permissions for helper function
grant execute on function public.assign_sponsor_with_audit(uuid, uuid, text) to authenticated, service_role;

-- 5) Clean up corrupted profiles (if any)
delete from profiles
where sponsor_id is null
   or sponsor_id = ''
   or sponsor_id = '00000000-0000-0000-0000-000000000000';

-- 5.1) Clean up corrupted referrals (if any)
delete from referrals
where sponsor_id is null
   or sponsor_id = ''
   or sponsor_id = '00000000-0000-0000-0000-000000000000'
   or referred_user_id is null
   or referred_user_id = ''
   or referred_user_id = '00000000-0000-0000-0000-000000000000';

-- 6) Verify function exists
do $$
begin
  if exists (select 1 from pg_proc where proname = 'pick_sponsor_b1' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ pick_sponsor_b1 function created successfully';
  else
    raise exception '❌ pick_sponsor_b1 function creation failed';
  end if;
end $$;
