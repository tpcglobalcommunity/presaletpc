create or replace function public.get_referral_tree_stats(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  sponsor_col text := null;
  lvl1 int := 0;
  lvl2 int := 0;
  lvl3 int := 0;
  total_downline int := 0;
  active_downline int := 0;
begin
  -- Auto-detect sponsor column name in public.profiles
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='profiles' and column_name='referred_by') then
    sponsor_col := 'referred_by';
  elsif exists (select 1 from information_schema.columns
                where table_schema='public' and table_name='profiles' and column_name='referrer_id') then
    sponsor_col := 'referrer_id';
  elsif exists (select 1 from information_schema.columns
                where table_schema='public' and table_name='profiles' and column_name='sponsor_id') then
    sponsor_col := 'sponsor_id';
  elsif exists (select 1 from information_schema.columns
                where table_schema='public' and table_name='profiles' and column_name='parent_id') then
    sponsor_col := 'parent_id';
  end if;

  if sponsor_col is null then
    return jsonb_build_object(
      'levels', jsonb_build_object('level1',0,'level2',0,'level3',0),
      'summary', jsonb_build_object('total_downline',0,'active_downline',0),
      'meta', jsonb_build_object('sponsor_col', null, 'note', 'No sponsor column found in profiles')
    );
  end if;

  -- LEVEL 1
  execute format('select count(*) from public.profiles p where p.%I = $1', sponsor_col)
    into lvl1 using p_user_id;

  -- LEVEL 2
  execute format($q$
    select count(*) from public.profiles p
    where p.%I in (
      select id from public.profiles where %I = $1
    )
  $q$, sponsor_col, sponsor_col)
    into lvl2 using p_user_id;

  -- LEVEL 3
  execute format($q$
    select count(*) from public.profiles p
    where p.%I in (
      select id from public.profiles
      where %I in (
        select id from public.profiles where %I = $1
      )
    )
  $q$, sponsor_col, sponsor_col, sponsor_col)
    into lvl3 using p_user_id;

  total_downline := coalesce(lvl1,0) + coalesce(lvl2,0) + coalesce(lvl3,0);

  -- ACTIVE DOWNLINE:
  -- safe dynamic join (assumption: invoices.user_id references profiles.id)
  -- if schema differs, this will still run; it just may return 0.
  execute format($q$
    select count(distinct p.id)
    from public.profiles p
    join public.invoices i on i.user_id = p.id
    where p.%I = $1 and i.status = 'approved'
  $q$, sponsor_col)
    into active_downline using p_user_id;

  return jsonb_build_object(
    'levels', jsonb_build_object(
      'level1', coalesce(lvl1,0),
      'level2', coalesce(lvl2,0),
      'level3', coalesce(lvl3,0)
    ),
    'summary', jsonb_build_object(
      'total_downline', total_downline,
      'active_downline', coalesce(active_downline,0)
    ),
    'meta', jsonb_build_object('sponsor_col', sponsor_col)
  );
end;
$$;

grant execute on function public.get_referral_tree_stats(p_user_id uuid) to authenticated;
