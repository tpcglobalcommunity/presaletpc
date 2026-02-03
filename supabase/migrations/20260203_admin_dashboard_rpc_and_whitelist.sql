-- 1) Admin whitelist table (DB-side security)
create table if not exists public.admin_users (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Allow ONLY admins to read the whitelist (optional)
drop policy if exists "admin_users_read_admin_only" on public.admin_users;
create policy "admin_users_read_admin_only"
on public.admin_users
for select
to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));

-- Seed current ADMIN_USER_IDS (from project memory)
insert into public.admin_users (user_id)
values
  ('518694f6-bb50-4724-b4a5-77ad30152e0e'),
  ('dfbbf71c-0a7c-43fb-bab0-d21f12b78b47')
on conflict (user_id) do nothing;

-- Helper function: is_admin()
create or replace function public.is_admin(p_uid uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select exists (select 1 from public.admin_users au where au.user_id = p_uid);
$$;

grant execute on function public.is_admin(uuid) to authenticated;

-- 2) RPC: get_dashboard_stats_admin
-- Returns counts + totals needed by admin dashboard
create or replace function public.get_dashboard_stats_admin()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result json;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'forbidden';
  end if;

  -- Adjust column names if needed:
  -- invoices: status, tpc_amount, amount_usd, amount_input, base_currency, created_at
  select json_build_object(
    'totalPending', (select count(*) from public.invoices where status = 'pending'),
    'totalApproved', (select count(*) from public.invoices where status = 'approved'),
    'totalRejected', (select count(*) from public.invoices where status = 'rejected'),
    'totalInvoices', (select count(*) from public.invoices),
    'totalTPC', coalesce((select sum(tpc_amount) from public.invoices where status = 'approved'), 0)
  )
  into v_result;

  return v_result;
end;
$$;

grant execute on function public.get_dashboard_stats_admin() to authenticated;

-- 3) RPC: admin_get_paid_totals
-- Returns financial totals for admin dashboard (approved only)
create or replace function public.admin_get_paid_totals()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result json;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'forbidden';
  end if;

  -- If you have columns amount_idr, amount_sol, amount_usdc, use them.
  -- Otherwise we compute by base_currency + amount_input.
  select json_build_object(
    'totalUSD', coalesce((select sum(amount_usd) from public.invoices where status = 'approved'), 0),
    'totalTPC', coalesce((select sum(tpc_amount) from public.invoices where status = 'approved'), 0),
    'totalIDR', coalesce((
      select sum(amount_input) from public.invoices
      where status = 'approved' and base_currency = 'IDR'
    ), 0),
    'totalUSDC', coalesce((
      select sum(amount_input) from public.invoices
      where status = 'approved' and base_currency = 'USDC'
    ), 0),
    'totalSOL', coalesce((
      select sum(amount_input) from public.invoices
      where status = 'approved' and base_currency = 'SOL'
    ), 0)
  )
  into v_result;

  return v_result;
end;
$$;

grant execute on function public.admin_get_paid_totals() to authenticated;

-- 4) Make sure PostgREST sees functions (optional but helps)
-- In Supabase hosted, schema cache refresh happens automatically after migrations.
-- If needed: run a dummy comment or re-deploy.
