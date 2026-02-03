-- Get referral tree stats for a member
create or replace function public.get_referral_tree_stats(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  /*
    ASSUMPTION:
    - profiles.id = user_id
    - profiles.referred_by stores sponsor profile id (uuid)
    - invoices.user_id links buyer to profile
    Adjust ONLY if your schema differs.
  */

  result := jsonb_build_object(
    'levels', jsonb_build_object(
      'level1', (
        select count(*) from profiles p where p.referred_by = p_user_id
      ),
      'level2', (
        select count(*) from profiles p
        where p.referred_by in (
          select id from profiles where referred_by = p_user_id
        )
      ),
      'level3', (
        select count(*) from profiles p
        where p.referred_by in (
          select id from profiles
          where referred_by in (
            select id from profiles where referred_by = p_user_id
          )
        )
      )
    ),
    'summary', jsonb_build_object(
      'total_downline', (
        select count(*) from profiles p where p.referred_by = p_user_id
      ),
      'active_downline', (
        select count(distinct p.id)
        from profiles p
        join invoices i on i.user_id = p.id
        where p.referred_by = p_user_id
          and i.status = 'approved'
      ),
      'total_invoices', (
        select count(*) from invoices i
        where i.user_id in (
          select id from profiles where referred_by = p_user_id
        )
      )
    )
  );

  return result;
end;
$$;

grant execute on function public.get_referral_tree_stats(uuid)
to authenticated;
