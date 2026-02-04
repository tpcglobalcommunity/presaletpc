-- ============================================================
-- FIX RANDOM SPONSOR RPC (PRODUCTION)
-- Ensures anon can call it and it always returns a valid code
-- ============================================================

-- 1) Make sure profiles has referral_code column (if not already)
alter table public.profiles
  add column if not exists referral_code text;

-- 2) Ensure at least one sponsor code exists (fallback seed)
-- IMPORTANT: only seed if no sponsor exists at all
do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.profiles
  where referral_code is not null and length(trim(referral_code)) >= 3;

  if v_count = 0 then
    -- seed super admin as sponsor code TPC-GLOBAL if profile exists
    update public.profiles
    set referral_code = 'TPC-GLOBAL'
    where user_id = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'
      and (referral_code is null or length(trim(referral_code)) < 3);
  end if;
end $$;

-- 3) Create/replace RPC
create or replace function public.get_random_referral_code()
returns text
language sql
stable
security definer
set search_path = public
as $$
  with candidates as (
    select p.referral_code
    from public.profiles p
    where p.referral_code is not null
      and length(trim(p.referral_code)) >= 3
      and coalesce(p.role, 'member') not in ('admin', 'super_admin')
  ),
  fallback as (
    select p.referral_code
    from public.profiles p
    where upper(trim(p.referral_code)) = 'TPC-GLOBAL'
    limit 1
  )
  select referral_code from candidates order by random() limit 1
  union all
  select referral_code from fallback
  limit 1;
$$;

-- 4) Grants (critical)
revoke all on function public.get_random_referral_code() from public;
grant execute on function public.get_random_referral_code() to anon;
grant execute on function public.get_random_referral_code() to authenticated;
