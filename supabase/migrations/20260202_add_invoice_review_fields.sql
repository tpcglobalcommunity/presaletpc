-- Migration: 20260202_add_invoice_review_fields.sql
-- Add review audit fields to invoices table

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS reviewed_by uuid NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS review_note text NULL;

CREATE INDEX IF NOT EXISTS idx_invoices_reviewed_by ON public.invoices(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_invoices_reviewed_at ON public.invoices(reviewed_at);
