-- MEMBER DASHBOARD STATS (secure, fast)
-- returns JSON with total_invoice, total_tpc, total_referral_bonus

create or replace function public.member_get_dashboard_stats()
returns json
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
begin
  return json_build_object(
    'total_invoice', (
      select count(*) from public.invoices
      where user_id = v_user_id
    ),
    'total_tpc', (
      select coalesce(sum(tpc_amount),0)
      from public.invoices
      where user_id = v_user_id
        and status = 'PAID'
    ),
    'total_referral_bonus', (
      select coalesce(sum(bonus_tpc),0)
      from public.referral_earnings
      where user_id = v_user_id
        and status = 'approved'
    )
  );
end;
$$;

revoke all on function public.member_get_dashboard_stats() from public;
grant execute on function public.member_get_dashboard_stats() to authenticated;
