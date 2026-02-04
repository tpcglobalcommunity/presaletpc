drop function if exists public.get_referral_direct_financial_stats();

create or replace function public.get_referral_direct_financial_stats()
returns table (
  direct_total_tpc_bought numeric,
  direct_total_commission_tpc numeric,
  total_withdrawn_tpc numeric,
  pending_withdrawn_tpc numeric
)
language sql
security definer
set search_path = public
as $$
  with direct_downline as (
    select p.user_id
    from public.profiles p
    where p.sponsor_user_id = auth.uid()
  ),
  direct_buys as (
    select coalesce(sum(i.tpc_amount),0) as total_bought
    from public.invoices i
    where i.status = 'approved'
      and i.user_id in (select user_id from direct_downline)
  ),
  direct_comm as (
    select coalesce(sum(cl.commission_tpc),0) as total_comm
    from public.commission_ledger cl
    where cl.user_id = auth.uid()
      and cl.level = 1
      and cl.status = 'earned'
  ),
  wd_approved as (
    select coalesce(sum(w.amount_tpc),0) as total_wd
    from public.commission_withdrawals w
    where w.user_id = auth.uid()
      and w.status = 'approved'
  ),
  wd_pending as (
    select coalesce(sum(w.amount_tpc),0) as total_pending
    from public.commission_withdrawals w
    where w.user_id = auth.uid()
      and w.status = 'pending'
  )
  select
    (select total_bought from direct_buys) as direct_total_tpc_bought,
    (select total_comm from direct_comm) as direct_total_commission_tpc,
    (select total_wd from wd_approved) as total_withdrawn_tpc,
    (select total_pending from wd_pending) as pending_withdrawn_tpc;
$$;

revoke all on function public.get_referral_direct_financial_stats() from public;
grant execute on function public.get_referral_direct_financial_stats() to authenticated;

do $$
begin
  perform pg_notify('pgrst','reload schema');
exception when others then null;
end$$;
