-- REFERRAL EARNINGS TABLE
-- Tracks referral bonuses earned by users

create table if not exists public.referral_earnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_invoice_id uuid references public.invoices(id) on delete set null,
  bonus_tpc numeric not null default 0,
  status text not null default 'approved',
  created_at timestamptz not null default now()
);

alter table public.referral_earnings enable row level security;

-- member boleh lihat row miliknya
create policy "referral_earnings_select_own"
on public.referral_earnings
for select
to authenticated
using (user_id = auth.uid());
