-- =========================================================
-- RPC: assign_sponsor(p_ref_code)
-- HRW (Rendezvous Hashing) - FAST SET-BASED, NO LOOP
-- Minimal disruption when eligible sponsors grow
-- =========================================================

drop function if exists public.assign_sponsor(text);

create or replace function public.assign_sponsor(p_ref_code text default null)
returns table (
  assigned boolean,
  sponsor_user_id uuid,
  sponsor_code text,
  reason text
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid;
  v_existing uuid;
  v_existing_code text;

  v_ref text;
  v_ref_sponsor_id uuid;
  v_ref_sponsor_code text;

  v_best_id uuid;
  v_best_code text;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Ensure profile exists
  insert into public.profiles (user_id, created_at, updated_at)
  values (v_uid, now(), now())
  on conflict (user_id) do update set updated_at = now();

  -- If already assigned, do not overwrite
  select sponsor_user_id, sponsor_code
    into v_existing, v_existing_code
  from public.profiles
  where user_id = v_uid;

  if v_existing is not null then
    return query
    select false, v_existing, v_existing_code, 'already_assigned';
    return;
  end if;

  -- 1) Try assign from ref (if provided + valid)
  v_ref := nullif(trim(p_ref_code), '');
  if v_ref is not null then
    select p.user_id, p.member_code
      into v_ref_sponsor_id, v_ref_sponsor_code
    from public.profiles p
    where upper(p.member_code) = upper(v_ref)
      and p.user_id is not null
      and p.user_id <> v_uid
    limit 1;

    if v_ref_sponsor_id is not null then
      update public.profiles
      set sponsor_user_id = v_ref_sponsor_id,
          sponsor_code = v_ref_sponsor_code,
          updated_at = now()
      where user_id = v_uid;

      return query
      select true, v_ref_sponsor_id, v_ref_sponsor_code, 'assigned_from_ref';
      return;
    end if;
  end if;

  -- 2) HRW fallback (FAST): pick sponsor with highest score
  -- Score from md5(user_id || ':' || sponsor_user_id) => take 60-bit bigint
  select p.user_id, p.member_code
    into v_best_id, v_best_code
  from public.profiles p
  where p.member_code is not null
    and p.user_id <> v_uid
  order by (
    ('x' || substr(md5(v_uid::text || ':' || p.user_id::text), 1, 15))::bit(60)::bigint
  ) desc,
  upper(p.member_code) asc,
  p.user_id asc
  limit 1;

  if v_best_id is null then
    return query
    select false, null::uuid, null::text, 'no_eligible_sponsor';
    return;
  end if;

  update public.profiles
  set sponsor_user_id = v_best_id,
      sponsor_code = v_best_code,
      updated_at = now()
  where user_id = v_uid;

  return query
  select true, v_best_id, v_best_code, 'assigned_hrw';
end;
$$;

revoke all on function public.assign_sponsor(text) from public;
grant execute on function public.assign_sponsor(text) to authenticated;

do $$
begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then null;
end$$;
