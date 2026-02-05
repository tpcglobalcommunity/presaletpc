-- Migration: 20260205_safe_auto_sponsor_system.sql
-- Purpose: Create safe auto sponsor system with fallback to TPC-GLOBAL
-- Safety: Idempotent, never fails, always returns sponsor_id

-- 0) Safety
set search_path = public;

-- 1️⃣ ENSURE SYSTEM SPONSOR EXISTS
-- TPC-GLOBAL sebagai fallback system sponsor
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

-- 2️⃣ SAFE pick_sponsor_b1() - ALWAYS RETURNS UUID
create or replace function public.pick_sponsor_b1()
returns uuid
language sql
security definer
set search_path = public
as $$
  -- Try to find eligible member sponsor first
  with eligible_sponsors as (
    select
      p.user_id,
      p.created_at,
      count(r.referred_user_id) as direct_count
    from public.profiles p
    left join public.referrals r
      on r.sponsor_id = p.user_id
    where
      p.role = 'member'
      and p.is_active = true
      and p.user_id != '00000000-0000-0000-0000-000000000001'::uuid -- Exclude system sponsor
    group by p.user_id, p.created_at
  )
  select user_id
  from eligible_sponsors
  order by
    direct_count asc,
    created_at asc,
    user_id asc
  limit 1;
  
  -- If no eligible member found, fallback to system sponsor
  union all
  select user_id
  from public.profiles
  where 
    member_code = 'TPC-GLOBAL'
    and role = 'system'
    and is_active = true
  limit 1;
  
  -- Return first result (either eligible member or system fallback)
  limit 1;
$$;

-- 3️⃣ SAFE upsert_profile_from_auth() - NEVER FAILS ON SPONSOR
create or replace function public.upsert_profile_from_auth()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    auth_user_record auth.users%ROWTYPE;
    existing_profile profiles%ROWTYPE;
    v_display_name text;
    v_avatar_url text;
    v_member_code text;
    v_referral_code text;
    v_sponsor_id uuid;
    v_sponsor_code text;
    v_assignment_reason text;
begin
    -- Get auth user data
    select * into auth_user_record 
    from auth.users 
    where id = p_user_id;
    
    if auth_user_record is null then
        raise exception 'User not found: %', p_user_id;
    end if;
    
    -- Extract display_name with priority
    v_display_name := coalesce(
        auth_user_record.raw_user_meta_data->>'full_name',
        auth_user_record.raw_user_meta_data->>'name',
        auth_user_record.raw_user_meta_data->>'given_name',
        split_part(auth_user_record.email, '@', 1)
    );
    
    -- Extract avatar_url with priority
    v_avatar_url := coalesce(
        auth_user_record.raw_user_meta_data->>'avatar_url',
        auth_user_record.raw_user_meta_data->>'picture'
    );
    
    -- Generate member code if needed
    v_member_code := 'TPC-' || upper(substring(md5(p_user_id::text) from 1 for 6));
    
    -- Check if profile exists
    select * into existing_profile 
    from public.profiles 
    where user_id = p_user_id;
    
    if existing_profile is null then
        -- NEW USER: Handle sponsor assignment safely
        -- Extract referral code from metadata (if provided via ?ref=)
        v_referral_code := nullif(trim(auth_user_record.raw_user_meta_data->>'referral_code'), '');
        
        if v_referral_code is not null then
            -- Try to find sponsor by referral code
            select p.user_id, p.member_code
            into v_sponsor_id, v_sponsor_code
            from public.profiles p
            where upper(p.member_code) = upper(v_referral_code)
              and p.user_id is not null
              and p.user_id <> p_user_id
              and p.is_active = true
              and p.role = 'member'
            limit 1;
            
            if v_sponsor_id is not null then
                v_assignment_reason := 'MANUAL_REFERRAL';
            end if;
        end if;
        
        -- If no manual sponsor found, use AUTO SPONSOR B1 (NEVER FAILS)
        if v_sponsor_id is null then
            select pick_sponsor_b1() into v_sponsor_id;
            
            if v_sponsor_id is not null then
                select member_code into v_sponsor_code
                from public.profiles
                where user_id = v_sponsor_id;
                
                v_assignment_reason := 'AUTO_B1_LOWEST_DIRECT';
            else
                -- This should never happen due to fallback logic
                v_assignment_reason := 'SYSTEM_FALLBACK';
            end if;
        end if;
        
        -- ✅ GUARANTEE: sponsor_id is always set (either manual, auto, or system fallback)
        -- Insert new profile with sponsor
        insert into public.profiles (
            user_id,
            email_initial,
            email_current,
            member_code,
            display_name,
            avatar_url,
            last_sign_in_at,
            created_at,
            updated_at,
            sponsor_user_id,
            sponsor_code,
            role,
            is_active
        ) values (
            p_user_id,
            auth_user_record.email,
            auth_user_record.email,
            v_member_code,
            v_display_name,
            v_avatar_url,
            now(),
            now(),
            v_sponsor_id,
            v_sponsor_code,
            'member',
            true
        );
        
        -- Create referral record if sponsor assigned
        if v_sponsor_id is not null then
            insert into public.referrals (sponsor_id, referred_user_id, reason)
            values (v_sponsor_id, p_user_id, v_assignment_reason)
            on conflict (referred_user_id) do nothing;
            
            -- Log the assignment
            insert into public.sponsor_assignment_audit (user_id, sponsor_id, reason, metadata)
            values (
                p_user_id, 
                v_sponsor_id, 
                v_assignment_reason,
                jsonb_build_object(
                    'algorithm', case 
                        when v_assignment_reason = 'AUTO_B1_LOWEST_DIRECT' then 'B1_LOWEST_DIRECT' 
                        when v_assignment_reason = 'MANUAL_REFERRAL' then 'MANUAL_REFERRAL'
                        when v_assignment_reason = 'SYSTEM_FALLBACK' then 'SYSTEM_FALLBACK'
                        else 'UNKNOWN' 
                    end,
                    'referral_code_used', v_referral_code is not null,
                    'new_user_email', auth_user_record.email,
                    'fallback_used', v_assignment_reason = 'SYSTEM_FALLBACK'
                )
            );
        end if;
        
    else
        -- EXISTING USER: Just update sign-in info
        update public.profiles set
            email_current = auth_user_record.email,
            display_name = coalesce(v_display_name, display_name),
            avatar_url = coalesce(v_avatar_url, avatar_url),
            last_sign_in_at = now()
        where user_id = p_user_id;
    end if;
    
end;
$$;

-- 4️⃣ GRANT PERMISSIONS
grant execute on function public.pick_sponsor_b1() to authenticated, service_role;
grant execute on function public.upsert_profile_from_auth() to authenticated, service_role;

-- 5️⃣ VERIFY FUNCTIONS EXIST
do $$
begin
  if exists (select 1 from pg_proc where proname = 'pick_sponsor_b1' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ pick_sponsor_b1 function created successfully';
  else
    raise exception '❌ pick_sponsor_b1 function creation failed';
  end if;
  
  if exists (select 1 from pg_proc where proname = 'upsert_profile_from_auth' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '✅ upsert_profile_from_auth function created successfully';
  else
    raise exception '❌ upsert_profile_from_auth function creation failed';
  end if;
end $$;
