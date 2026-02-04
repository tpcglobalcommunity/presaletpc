-- =========================================================
-- RPC: admin_generate_direct_commission(invoice_id)
-- Generate commission for sponsor (level 1 only) on approved invoice
-- =========================================================

drop function if exists public.admin_generate_direct_commission(uuid);

create or replace function public.admin_generate_direct_commission(p_invoice_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_downline uuid;
  v_upline uuid;
  v_tpc numeric;
  v_rate numeric := 0.05; -- 5% default, adjust if needed
  v_comm numeric;
begin
  if not public.is_admin() then
    raise exception 'Access denied: Admin access required';
  end if;

  -- invoice must be approved
  select i.user_id, i.tpc_amount
    into v_downline, v_tpc
  from public.invoices i
  where i.id = p_invoice_id
    and i.status = 'approved'
  limit 1;

  if v_downline is null then
    return;
  end if;

  -- find sponsor/upline from profiles
  select p.sponsor_user_id
    into v_upline
  from public.profiles p
  where p.user_id = v_downline
  limit 1;

  if v_upline is null then
    return;
  end if;

  -- idempotent: do not duplicate for same invoice + upline
  if exists (
    select 1 from public.commission_ledger cl
    where cl.invoice_id = p_invoice_id
      and cl.user_id = v_upline
      and cl.level = 1
  ) then
    return;
  end if;

  v_comm := coalesce(v_tpc, 0) * v_rate;

  insert into public.commission_ledger (
    user_id, source_user_id, invoice_id, level, tpc_amount, commission_tpc, status
  ) values (
    v_upline, v_downline, p_invoice_id, 1, coalesce(v_tpc,0), coalesce(v_comm,0), 'earned'
  );
end;
$$;

revoke all on function public.admin_generate_direct_commission(uuid) from public;
grant execute on function public.admin_generate_direct_commission(uuid) to authenticated;

do $$
begin
  perform pg_notify('pgrst','reload schema');
exception when others then null;
end$$;
