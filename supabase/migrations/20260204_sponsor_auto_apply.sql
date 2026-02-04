-- ============================================================
-- SPONSOR AUTO APPLY (FROM PENDING CODE)
-- ============================================================

-- 1) Random sponsor (reuse if already exists; create if not)
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

revoke all on function public.get_random_referral_code() from public;
grant execute on function public.get_random_referral_code() to anon;
grant execute on function public.get_random_referral_code() to authenticated;

-- 2) Resolve sponsor user_id by referral_code
create or replace function public.resolve_sponsor_user_id(p_referral_code text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.user_id
  from public.profiles p
  where upper(trim(p.referral_code)) = upper(trim(p_referral_code))
  limit 1;
$$;

revoke all on function public.resolve_sponsor_user_id(text) from public;
grant execute on function public.resolve_sponsor_user_id(text) to anon;
grant execute on function public.resolve_sponsor_user_id(text) to authenticated;

-- 3) Apply sponsor to current user profile ONLY if not set
-- NOTE: expects profiles has sponsor_user_id (uuid) column. If not exists, add it.
alter table public.profiles
  add column if not exists sponsor_user_id uuid;

create or replace function public.apply_pending_sponsor(p_referral_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_sponsor uuid;
  v_already uuid;
begin
  if v_me is null then
    raise exception 'Not authenticated';
  end if;

  select sponsor_user_id into v_already
  from public.profiles
  where user_id = v_me;

  -- do not override if already set
  if v_already is not null then
    return json_build_object('applied', false, 'reason', 'already_set');
  end if;

  v_sponsor := public.resolve_sponsor_user_id(p_referral_code);

  if v_sponsor is null then
    return json_build_object('applied', false, 'reason', 'invalid_code');
  end if;

  -- prevent self-sponsor
  if v_sponsor = v_me then
    return json_build_object('applied', false, 'reason', 'self_sponsor');
  end if;

  update public.profiles
  set sponsor_user_id = v_sponsor,
      updated_at = now()
  where user_id = v_me
    and sponsor_user_id is null;

  return json_build_object('applied', true, 'reason', 'ok', 'sponsor_user_id', v_sponsor);
end;
$$;

revoke all on function public.apply_pending_sponsor(text) from public;
grant execute on function public.apply_pending_sponsor(text) to authenticated;
