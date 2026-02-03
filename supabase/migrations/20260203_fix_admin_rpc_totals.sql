-- PHASE 2: FIX RPC tpc_admin_get_paid_totals
-- Use canonical admin check function for security

create or replace function public.tpc_admin_get_paid_totals()
returns table (
  total_invoices bigint,
  pending_review bigint,
  approved bigint,
  total_tpc_sold numeric
)
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied: Admin access required';
  end if;

  return query
  select
    count(*) as total_invoices,
    count(*) filter (where status = 'pending') as pending_review,
    count(*) filter (where status = 'approved') as approved,
    coalesce(sum(tpc_amount), 0) as total_tpc_sold
  from invoices;
end;
$$;

-- PHASE 3: GRANT EXECUTION (WAJIB)
grant execute on function public.tpc_admin_get_paid_totals() to authenticated;
