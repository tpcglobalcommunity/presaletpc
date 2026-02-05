-- HOTFIX: RPC Alias Functions
-- Purpose: Create missing RPC functions with correct names/signatures
-- Safety: Idempotent, can be run multiple times

-- 1) Create pick_sponsor_b1() alias
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
  order by direct_count asc, created_at asc, user_id asc
  limit 1;
$$;

-- 2) Create minimal upsert_profile_from_auth() to prevent 404
create or replace function public.upsert_profile_from_auth()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := (select email from auth.users where id = v_uid);
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  insert into public.profiles (user_id, email, role, created_at, updated_at)
  values (v_uid, v_email, 'member', now(), now())
  on conflict (user_id) do update
    set email = excluded.email,
        updated_at = now();
end;
$$;

-- 3) Grant permissions
grant execute on function public.pick_sponsor_b1() to authenticated, service_role;
grant execute on function public.upsert_profile_from_auth() to authenticated, service_role;

-- 4) Verify functions exist
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
