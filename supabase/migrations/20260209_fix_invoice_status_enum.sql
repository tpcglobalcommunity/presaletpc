-- Migration: 20260209_fix_invoice_status_enum.sql
-- Description: Fix error 42804 for invoice status enum conversion
-- Author: TPC Global Team

-- ================================================================
-- CREATE EXTENSION IF NEEDED
-- ================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================================
-- CREATE INVOICE STATUS ENUM IF NOT EXISTS
-- ================================================================

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

-- ================================================================
-- DROP DEFAULT ON STATUS COLUMN (FIX ERROR 42804)
-- ================================================================

DO $$
BEGIN
    ALTER TABLE public.invoices ALTER COLUMN status DROP DEFAULT;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- ================================================================
-- NORMALIZE EXISTING STATUS DATA
-- ================================================================

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

-- ================================================================
-- CONVERT STATUS COLUMN TO ENUM TYPE
-- ================================================================

DO $$
BEGIN
    ALTER TABLE public.invoices ALTER COLUMN status TYPE invoice_status USING status::text::invoice_status;
EXCEPTION
    WHEN others THEN
        NULL;
END $$;

-- ================================================================
-- SET DEFAULT TO ENUM TYPE
-- ================================================================

ALTER TABLE public.invoices ALTER COLUMN status SET DEFAULT 'UNPAID'::invoice_status;
