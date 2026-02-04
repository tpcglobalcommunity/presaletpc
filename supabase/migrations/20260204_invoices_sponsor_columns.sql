alter table public.invoices
add column if not exists sponsor_user_id uuid,
add column if not exists sponsor_code text;

-- Create index for better performance
create index if not exists idx_invoices_sponsor_user_id on public.invoices(sponsor_user_id);
create index if not exists idx_invoices_sponsor_code on public.invoices(sponsor_code);

-- For soft launch, NOT NULL enforcement can be added later:
-- alter table public.invoices alter column sponsor_user_id set not null;
-- alter table public.invoices alter column sponsor_code set not null;
