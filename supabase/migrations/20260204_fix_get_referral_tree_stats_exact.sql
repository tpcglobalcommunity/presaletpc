create or replace function public.get_referral_tree_stats(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_level1 int := 0;
  v_level2 int := 0;
  v_level3 int := 0;
  v_total int := 0;
  v_active int := 0;
begin
  -- IMPORTANT:
  -- Adjust ONLY the sponsor column name if needed.
  -- Assumption: profiles.referred_by stores sponsor profile uuid

  select count(*) into v_level1
  from public.profiles p
  where p.referred_by = p_user_id;

  select count(*) into v_level2
  from public.profiles p
  where p.referred_by in (
    select id from public.profiles where referred_by = p_user_id
  );

  select count(*) into v_level3
  from public.profiles p
  where p.referred_by in (
    select id from public.profiles
    where referred_by in (
      select id from public.profiles where referred_by = p_user_id
    )
  );

  v_total := v_level1 + v_level2 + v_level3;

  -- Active downline: has at least 1 approved invoice (adjust if your invoice user link differs)
  select count(distinct p.id) into v_active
  from public.profiles p
  join public.invoices i on i.user_id = p.id
  where p.referred_by = p_user_id
    and i.status = 'approved';

  return jsonb_build_object(
    'levels', jsonb_build_object(
      'level1', v_level1,
      'level2', v_level2,
      'level3', v_level3
    ),
    'summary', jsonb_build_object(
      'total_downline', v_total,
      'active_downline', v_active
    )
  );
end;
$$;

grant execute on function public.get_referral_tree_stats(p_user_id uuid) to authenticated;
