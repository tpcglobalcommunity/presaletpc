-- Fix RLS policies for invoices table
-- Member can SELECT and UPDATE own invoices

-- Enable RLS
alter table public.invoices enable row level security;

-- Drop existing policies if any
drop policy if exists "invoices_select_own" on public.invoices;
drop policy if exists "invoices_insert_own" on public.invoices;
drop policy if exists "invoices_update_own" on public.invoices;

-- SELECT: authenticated user can only see invoices they own
create policy "invoices_select_own"
on public.invoices
for select
to authenticated
using (user_id = auth.uid());

-- INSERT: allow insert only if user_id = auth.uid()
create policy "invoices_insert_own"
on public.invoices
for insert
to authenticated
with check (user_id = auth.uid());

-- UPDATE: authenticated user can update own invoices (for proof upload, status changes)
create policy "invoices_update_own"
on public.invoices
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
