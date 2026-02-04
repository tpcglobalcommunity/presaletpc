drop function if exists public.get_referral_stats();

create or replace function public.get_referral_stats()
returns table (
  total_downline int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  return query
  select count(*)::int
  from public.profiles p
  where p.sponsor_user_id = v_uid;
end;
$$;

revoke all on function public.get_referral_stats() from public;
grant execute on function public.get_referral_stats() to authenticated;

do $$
begin
  perform pg_notify('pgrst','reload schema');
exception when others then null;
end$$;

drop function if exists public.get_my_referrals();

create or replace function public.get_my_referrals()
returns table (
  user_id uuid,
  display_name text,
  email text,
  joined_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    p.user_id,
    coalesce(p.nama, 'Member') as display_name,
    p.email,
    p.created_at
  from public.profiles p
  where p.sponsor_user_id = auth.uid()
  order by p.created_at desc;
end;
$$;

revoke all on function public.get_my_referrals() from public;
grant execute on function public.get_my_referrals() to authenticated;

do $$
begin
  perform pg_notify('pgrst','reload schema');
exception when others then null;
end$$;
