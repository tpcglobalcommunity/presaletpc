-- Fix RLS policies for invoices table
-- Member can SELECT and UPDATE own invoices

-- Enable RLS
alter table public.invoices enable row level security;

-- Drop existing policies if any
drop policy if exists "invoices_select_own" on public.invoices;
drop policy if exists "invoices_update_own" on public.invoices;

-- Member can read own invoices
create policy "invoices_select_own"
on public.invoices
for select
to authenticated
using (user_id = auth.uid());

-- Member can update own invoices (for proof upload, status changes)
create policy "invoices_update_own"
on public.invoices
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
