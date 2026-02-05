-- Migration: 20260205_no_fail_upsert_profile.sql
-- Purpose: Make profile upsert never fail, handle sponsor assignment gracefully
-- Safety: Idempotent, no hard failures on sponsor assignment

-- 0) Safety
set search_path = public;

-- 1) Ensure public.referrals table exists (idempotent)
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint referrals_unique_referred unique (referred_user_id)
);

create index if not exists idx_referrals_sponsor_id on public.referrals (sponsor_id);
create index if not exists idx_referrals_created_at on public.referrals (created_at);

-- 2) Create/replace public.pick_sponsor_b1()
-- Returns uuid or NULL if no eligible sponsors
-- MUST NOT raise any exception
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

-- 3) Create/replace public.upsert_profile_from_auth()
-- MUST NEVER RAISE 'AUTO_SPONSOR_FAILED'
-- MUST always succeed (except AUTH_REQUIRED)
create or replace function public.upsert_profile_from_auth()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_email text;
    v_display_name text;
    v_avatar_url text;
    v_member_code text;
    v_sponsor_id uuid;
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

    -- Extract display name from metadata
    v_display_name := coalesce(
        (select raw_user_meta_data->>'full_name' from auth.users where id = v_uid),
        (select raw_user_meta_data->>'name' from auth.users where id = v_uid),
        (select raw_user_meta_data->>'given_name' from auth.users where id = v_uid),
        split_part(v_email, '@', 1)
    );

    -- Extract avatar from metadata
    v_avatar_url := coalesce(
        (select raw_user_meta_data->>'avatar_url' from auth.users where id = v_uid),
        (select raw_user_meta_data->>'picture' from auth.users where id = v_uid)
    );

    -- Generate member code
    v_member_code := 'TPC-' || upper(substring(md5(v_uid::text) from 1 for 6));

    -- Check if profile exists
    select * into existing_profile 
    from public.profiles 
    where user_id = v_uid;

    if existing_profile is null then
        -- NEW USER: Insert profile
        insert into public.profiles (
            user_id,
            email_initial,
            email_current,
            member_code,
            display_name,
            avatar_url,
            role,
            created_at,
            updated_at
        ) values (
            v_uid,
            v_email,
            v_email,
            v_member_code,
            v_display_name,
            v_avatar_url,
            'member',
            now(),
            now()
        );

        -- Try to assign sponsor (non-blocking)
        select public.pick_sponsor_b1() into v_sponsor_id;
        
        if v_sponsor_id is not null then
            -- Update profile with sponsor
            update public.profiles 
            set sponsor_user_id = v_sponsor_id,
                updated_at = now()
            where user_id = v_uid;

            -- Create referral record
            insert into public.referrals (sponsor_id, referred_user_id, reason)
            values (v_sponsor_id, v_uid, 'AUTO_ASSIGNMENT')
            on conflict (referred_user_id) do nothing;
        end if;

    else
        -- EXISTING USER: Update email and sign-in info
        update public.profiles set
            email_current = v_email,
            display_name = coalesce(v_display_name, display_name),
            avatar_url = coalesce(v_avatar_url, avatar_url),
            last_sign_in_at = now(),
            updated_at = now()
        where user_id = v_uid;
    end if;

end;
$$;

-- 4) Grant permissions
grant execute on function public.pick_sponsor_b1() to authenticated, service_role;
grant execute on function public.upsert_profile_from_auth() to authenticated, service_role;

-- 5) Verify functions exist
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
