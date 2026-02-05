-- Migration: 20260205_integrate_auto_sponsor_b1.sql
-- Purpose: Integrate AUTO SPONSOR B1 into upsert_profile_from_auth

-- 0) Safety
set search_path = public;

-- 1) Modify upsert_profile_from_auth to include auto sponsor assignment
drop function if exists public.upsert_profile_from_auth(uuid);

-- 1.1) Create referrals table (direct referrals / level 1)
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references public.profiles(user_id) on delete cascade,
  referred_user_id uuid not null references public.profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint referrals_unique_referred unique (referred_user_id)
);

-- 1.2) Helpful indexes
create index if not exists idx_referrals_sponsor_id on public.referrals (sponsor_id);
create index if not exists idx_referrals_created_at on public.referrals (created_at);

-- 1.3) Create audit logs table for sponsor assignment tracking
create table if not exists public.sponsor_assignment_audit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  sponsor_id uuid not null,
  reason text not null,
  created_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

create index if not exists idx_sponsor_audit_user_id on public.sponsor_assignment_audit(user_id);
create index if not exists idx_sponsor_audit_created_at on public.sponsor_assignment_audit(created_at);

create or replace function public.upsert_profile_from_auth(p_user_id uuid)
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
        -- NEW USER: Handle sponsor assignment
        
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
        
        -- If no manual sponsor found, use AUTO SPONSOR B1
        if v_sponsor_id is null then
            select pick_sponsor_b1() into v_sponsor_id;
            
            if v_sponsor_id is not null then
                select member_code into v_sponsor_code
                from public.profiles
                where user_id = v_sponsor_id;
                
                v_assignment_reason := 'AUTO_B1_LOWEST_DIRECT';
            else
                -- 🔒 HARD FAIL: No eligible sponsors found
                raise exception 'AUTO_SPONSOR_FAILED: No eligible sponsors available for assignment';
            end if;
        end if;
        
        -- 🔒 HARD GUARD: Ensure sponsor_id is valid UUID
        if v_sponsor_id is null or v_sponsor_id = '' or v_sponsor_id = '00000000-0000-0000-0000-000000000000' then
            raise exception 'AUTO_SPONSOR_FAILED: Invalid sponsor_id generated';
        end if;
        
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
                    'algorithm', case when v_assignment_reason = 'AUTO_B1_LOWEST_DIRECT' then 'B1_LOWEST_DIRECT' else 'MANUAL_REFERRAL' end,
                    'referral_code_used', v_referral_code is not null,
                    'new_user_email', auth_user_record.email
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

-- 2) Grant execute permissions
grant execute on function public.upsert_profile_from_auth(uuid) to authenticated, service_role;
