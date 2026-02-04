-- ============================================================
-- RANDOM SPONSOR SUGGESTION (NO AUTO-DEFAULT)
-- Provides random referral_code from valid member profiles
-- Excludes admin/super_admin
-- ============================================================

create or replace function public.get_random_referral_code()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.referral_code
  from public.profiles p
  where p.referral_code is not null
    and length(trim(p.referral_code)) >= 3
    and coalesce(p.role, 'member') not in ('admin', 'super_admin')
  order by random()
  limit 1;
$$;

-- Restrict execute to anon + authenticated (public page needs it)
revoke all on function public.get_random_referral_code() from public;
grant execute on function public.get_random_referral_code() to anon;
grant execute on function public.get_random_referral_code() to authenticated;
