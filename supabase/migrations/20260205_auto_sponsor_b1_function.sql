-- Migration: 20260205_auto_sponsor_b1_function.sql
-- Purpose: Implement AUTO SPONSOR B1 - "Downline paling sedikit (paling adil)"

-- 0) Safety
set search_path = public;

-- 1) Create the pick_sponsor_b1 function
-- Returns UUID of sponsor with fewest direct referrals (deterministic)
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
      and p.user_id is not null
    group by p.user_id, p.created_at
  )
  select user_id
  from sponsor_counts
  order by
    direct_count asc,      -- Fewest direct referrals first
    created_at asc,        -- Oldest sponsor first if tie
    user_id asc           -- Smallest user_id if still tie
  limit 1;
$$;

-- 2) Grant execute permissions
grant execute on function public.pick_sponsor_b1() to authenticated, service_role;

-- 3) Create helper function for sponsor assignment with audit
create or replace function public.assign_sponsor_with_audit(
  p_user_id uuid,
  p_reason text default 'AUTO_B1_LOWEST_DIRECT'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sponsor_id uuid;
  v_existing_referral record;
begin
  -- Check if user already has a sponsor
  select * into v_existing_referral
  from referrals r
  where r.referred_user_id = p_user_id
  limit 1;
  
  if v_existing_referral is not null then
    -- User already has sponsor, just log and return
    insert into sponsor_assignment_audit (user_id, sponsor_id, reason, metadata)
    values (
      p_user_id, 
      v_existing_referral.sponsor_id, 
      'ALREADY_HAS_SPONSOR',
      jsonb_build_object('existing_reason', v_existing_referral.reason)
    );
    return;
  end if;
  
  -- Pick sponsor using B1 algorithm
  select pick_sponsor_b1() into v_sponsor_id;
  
  if v_sponsor_id is null then
    -- No eligible sponsor found (should not happen in production)
    insert into sponsor_assignment_audit (user_id, sponsor_id, reason, metadata)
    values (
      p_user_id, 
      null, 
      'NO_ELIGIBLE_SPONSOR',
      jsonb_build_object('error', 'No eligible sponsors found')
    );
    return;
  end if;
  
  -- Update user's sponsor in profiles
  update public.profiles
  set sponsor_user_id = v_sponsor_id,
      updated_at = now()
  where user_id = p_user_id;
  
  -- Create referral record
  insert into public.referrals (sponsor_id, referred_user_id, reason)
  values (v_sponsor_id, p_user_id, p_reason)
  on conflict (referred_user_id) do nothing;
  
  -- Log the assignment
  insert into sponsor_assignment_audit (user_id, sponsor_id, reason, metadata)
  values (
    p_user_id, 
    v_sponsor_id, 
    p_reason,
    jsonb_build_object(
      'algorithm', 'B1_LOWEST_DIRECT',
      'sponsor_direct_count_before', (
        select count(*) 
        from referrals 
        where sponsor_id = v_sponsor_id
      )
    )
  );
end;
$$;

-- 4) Grant execute permissions for helper function
grant execute on function public.assign_sponsor_with_audit(uuid, text) to authenticated, service_role;
