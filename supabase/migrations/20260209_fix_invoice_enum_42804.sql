-- Migration: 20260209_fix_invoice_enum_42804.sql
-- Description: Fix PostgreSQL error 42804 for invoice status enum conversion
-- Author: TPC Global Team

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE public.invoice_status AS ENUM (
            'UNPAID',
            'PENDING_REVIEW', 
            'APPROVED',
            'PAID',
            'REJECTED'
        );
    END IF;
END $$;

DO $$
BEGIN
    ALTER TABLE public.invoices ALTER COLUMN status DROP DEFAULT;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

UPDATE public.invoices 
SET status = CASE 
    WHEN LOWER(status) = 'unpaid' THEN 'UNPAID'
    WHEN LOWER(status) = 'pending' THEN 'PENDING_REVIEW'
    WHEN LOWER(status) = 'pending_review' THEN 'PENDING_REVIEW'
    WHEN LOWER(status) = 'approved' THEN 'APPROVED'
    WHEN LOWER(status) = 'paid' THEN 'PAID'
    WHEN LOWER(status) = 'rejected' THEN 'REJECTED'
    WHEN status IS NULL OR status = '' OR LOWER(status) NOT IN ('unpaid', 'pending', 'pending_review', 'approved', 'paid', 'rejected') THEN 'UNPAID'
    ELSE status
END;

DO $$
BEGIN
    ALTER TABLE public.invoices ALTER COLUMN status TYPE invoice_status USING status::text::invoice_status;
EXCEPTION
    WHEN others THEN
        NULL;
END $$;

ALTER TABLE public.invoices ALTER COLUMN status SET DEFAULT 'UNPAID'::invoice_status;
