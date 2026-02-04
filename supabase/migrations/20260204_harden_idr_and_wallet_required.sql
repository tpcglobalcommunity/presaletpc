-- Migration: 20260204_harden_idr_and_wallet_required.sql
-- Purpose: Harden IDR as integer + require wallet_tpc in invoice creation
-- Safety: ADDITIVE ONLY - no existing columns modified

-- 1) Add amount_idr column for IDR-specific integer storage
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS amount_idr numeric(18,0);

-- 2) Ensure wallet_tpc column exists (should already exist from previous migration)
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS wallet_tpc text;

-- 3) Constraint: wallet required for new invoices
-- Using NOT VALID initially to avoid breaking existing data
ALTER TABLE public.invoices
ADD CONSTRAINT IF NOT EXISTS invoices_wallet_tpc_required
CHECK (wallet_tpc IS NOT NULL AND length(trim(wallet_tpc)) >= 32) NOT VALID;

-- 4) Constraint: IDR integer enforcement
-- Only applies when base_currency = 'IDR'
ALTER TABLE public.invoices
ADD CONSTRAINT IF NOT EXISTS invoices_idr_integer_enforced
CHECK (
  base_currency <> 'IDR'
  OR (
    amount_idr IS NOT NULL
    AND amount_idr > 0
    AND amount_idr = trunc(amount_idr)
  )
) NOT VALID;

-- 5) Index for performance
CREATE INDEX IF NOT EXISTS idx_invoices_amount_idr ON public.invoices(amount_idr) WHERE amount_idr IS NOT NULL;

-- Note: Constraints are NOT VALID initially to avoid breaking existing data.
-- Run VALIDATE CONSTRAINT separately after backfill if needed:
-- ALTER TABLE public.invoices VALIDATE CONSTRAINT invoices_wallet_tpc_required;
-- ALTER TABLE public.invoices VALIDATE CONSTRAINT invoices_idr_integer_enforced;
