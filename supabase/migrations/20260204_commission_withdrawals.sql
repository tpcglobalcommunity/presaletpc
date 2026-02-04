-- =========================================================
-- COMMISSION LEDGER + WITHDRAWALS (LEVEL 1 / DIRECT)
-- =========================================================

create table if not exists public.commission_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,                -- penerima komisi (upline)
  source_user_id uuid not null,         -- downline yang beli
  invoice_id uuid not null,
  level int not null default 1,
  tpc_amount numeric not null default 0,      -- tpc yang dibeli downline
  commission_tpc numeric not null default 0,  -- komisi dalam TPC (atau unit komisi)
  status text not null default 'earned',      -- earned | voided
  created_at timestamptz not null default now()
);

create index if not exists commission_ledger_user_idx on public.commission_ledger(user_id);
create index if not exists commission_ledger_source_idx on public.commission_ledger(source_user_id);
create index if not exists commission_ledger_invoice_idx on public.commission_ledger(invoice_id);

create table if not exists public.commission_withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  amount_tpc numeric not null,
  status text not null default 'pending',  -- pending | approved | rejected
  tx_hash text,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists commission_withdrawals_user_idx on public.commission_withdrawals(user_id);
create index if not exists commission_withdrawals_status_idx on public.commission_withdrawals(status);

alter table public.commission_ledger enable row level security;
alter table public.commission_withdrawals enable row level security;

-- RLS: user can read own
drop policy if exists "commission_ledger_select_own" on public.commission_ledger;
create policy "commission_ledger_select_own"
on public.commission_ledger for select
using (user_id = auth.uid());

drop policy if exists "commission_withdrawals_select_own" on public.commission_withdrawals;
create policy "commission_withdrawals_select_own"
on public.commission_withdrawals for select
using (user_id = auth.uid());

-- withdrawals insert own (request withdraw)
drop policy if exists "commission_withdrawals_insert_own" on public.commission_withdrawals;
create policy "commission_withdrawals_insert_own"
on public.commission_withdrawals for insert
with check (user_id = auth.uid());
