-- ============================================================
-- FIX get_random_referral_code() - NEVER EMPTY
-- ============================================================

-- Ensure profiles has referral_code
alter table public.profiles
  add column if not exists referral_code text;

-- Seed super admin referral_code if missing (safe)
update public.profiles
set referral_code = 'TPC-GLOBAL'
where user_id = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'
  and (referral_code is null or length(trim(referral_code)) < 3);

create or replace function public.get_random_referral_code()
returns text
language sql
stable
security definer
set search_path = public
as $$
  with member_candidates as (
    select upper(trim(p.referral_code)) as code
    from public.profiles p
    where p.referral_code is not null
      and length(trim(p.referral_code)) >= 3
      and coalesce(p.role, 'member') not in ('admin', 'super_admin')
  ),
  super_admin_fallback as (
    select upper(trim(p.referral_code)) as code
    from public.profiles p
    where p.user_id = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'
      and p.referral_code is not null
      and length(trim(p.referral_code)) >= 3
    limit 1
  ),
  invoices_fallback as (
    select upper(trim(i.referral_code)) as code
    from public.invoices i
    where i.referral_code is not null
      and length(trim(i.referral_code)) >= 3
    group by upper(trim(i.referral_code))
    order by count(*) desc
    limit 10
  )
  select code from member_candidates order by random() limit 1
  union all
  select code from super_admin_fallback
  union all
  select code from invoices_fallback order by random() limit 1
  limit 1;
$$;

revoke all on function public.get_random_referral_code() from public;
grant execute on function public.get_random_referral_code() to anon;
grant execute on function public.get_random_referral_code() to authenticated;
