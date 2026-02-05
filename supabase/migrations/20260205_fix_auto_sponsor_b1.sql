-- Migration: 20260205_fix_auto_sponsor_b1.sql
-- Purpose: Fix auto sponsor B1 implementation - create tables and functions
-- Safety: Idempotent migration, can be run multiple times

-- 0) Safety
set search_path = public;

-- 1️⃣ TABLE: public.referrals
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint referrals_unique_referred unique (referred_user_id)
);

create index if not exists idx_referrals_sponsor_id on public.referrals (sponsor_id);
create index if not exists idx_referrals_created_at on public.referrals (created_at);

-- 2️⃣ FUNCTION: public.pick_sponsor_b1()

-- Kriteria: sponsor dengan downline paling sedikit (level 1)
-- Tie-break: direct_count paling kecil, created_at paling lama, user_id terkecil
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

-- 3️⃣ FUNCTION: public.upsert_profile_from_auth()

-- Tujuan: dipanggil SETELAH login, menghilangkan error 404
-- Aman & idempotent
create or replace function public.upsert_profile_from_auth()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select email into v_email from auth.users where id = v_uid;

  insert into public.profiles (user_id, email, role, created_at, updated_at)
  values (v_uid, v_email, 'member', now(), now())
  on conflict (user_id) do update
    set email = excluded.email,
        updated_at = now();
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
