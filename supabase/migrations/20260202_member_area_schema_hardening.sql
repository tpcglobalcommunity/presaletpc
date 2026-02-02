-- Migration: 20260202_member_area_schema_hardening.sql
-- Harden schema for member area flow

-- 1) Ensure invoices has required columns
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS transfer_method text NULL,
  ADD COLUMN IF NOT EXISTS wallet_tpc text NULL,
  ADD COLUMN IF NOT EXISTS proof_url text NULL,
  ADD COLUMN IF NOT EXISTS proof_uploaded_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS expired_at timestamptz NULL;

-- 2) Ensure status enum-like constraint
ALTER TABLE public.invoices
  DROP CONSTRAINT IF EXISTS invoices_status_check;

ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_status_check
  CHECK (status IN ('UNPAID','PENDING_REVIEW','PAID','CANCELLED','EXPIRED'));

-- 3) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user_id_created_at ON public.invoices(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_email_created_at ON public.invoices(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
