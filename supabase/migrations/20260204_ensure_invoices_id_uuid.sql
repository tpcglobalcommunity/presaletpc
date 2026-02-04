-- ENSURE INVOICES ID COLUMN EXISTS AND IS UUID PRIMARY KEY
-- This is a safety check in case the previous migration didn't run

alter table public.invoices
add column if not exists id uuid primary key default gen_random_uuid();
