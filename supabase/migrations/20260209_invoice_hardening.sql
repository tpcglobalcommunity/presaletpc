-- Migration: 20260209_invoice_hardening.sql
-- Description: Hard-lock invoice flow with database-level enforcement
-- Author: TPC Global Team
-- Target: Immutable invoice status transitions with audit trail

-- ================================================================
-- PHASE 1: ENUM & COLUMN NORMALIZATION
-- ================================================================

-- Create invoice_status enum
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

-- Normalize existing text statuses to enum
UPDATE public.invoices 
SET status = CASE 
    WHEN LOWER(status) = 'unpaid' THEN 'UNPAID'::invoice_status
    WHEN LOWER(status) = 'pending_review' OR LOWER(status) = 'pending' THEN 'PENDING_REVIEW'::invoice_status
    WHEN LOWER(status) = 'approved' THEN 'APPROVED'::invoice_status
    WHEN LOWER(status) = 'paid' THEN 'PAID'::invoice_status
    WHEN LOWER(status) = 'rejected' THEN 'REJECTED'::invoice_status
    ELSE 'UNPAID'::invoice_status
END;

-- Convert status column to enum
DO $$ BEGIN
    BEGIN
        ALTER TABLE public.invoices ALTER COLUMN status TYPE invoice_status USING status::invoice_status;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Column already converted, skip
            NULL;
    END;
END $$;

-- Set default status
ALTER TABLE public.invoices ALTER COLUMN status SET DEFAULT 'UNPAID'::invoice_status;

-- ================================================================
-- PHASE 2: REQUIRED COLUMNS
-- ================================================================

DO $$
BEGIN
    -- Add proof_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'proof_url'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN proof_url TEXT;
    END IF;

    -- Add proof_uploaded_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'proof_uploaded_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN proof_uploaded_at TIMESTAMPTZ;
    END IF;

    -- Add submitted_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'submitted_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN submitted_at TIMESTAMPTZ;
    END IF;

    -- Add approved_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'approved_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN approved_at TIMESTAMPTZ;
    END IF;

    -- Add approved_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN approved_by UUID REFERENCES auth.users(id);
    END IF;

    -- Add rejected_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'rejected_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN rejected_at TIMESTAMPTZ;
    END IF;

    -- Add rejected_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'rejected_by'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN rejected_by UUID REFERENCES auth.users(id);
    END IF;

    -- Add reject_note
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'reject_note'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN reject_note TEXT;
    END IF;

    -- Add sent_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'sent_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN sent_at TIMESTAMPTZ;
    END IF;

    -- Add tx_hash
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'tx_hash'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN tx_hash TEXT;
    END IF;

    -- Add wallet_address
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'wallet_address'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN wallet_address TEXT;
    END IF;
END $$;

-- ================================================================
-- PHASE 3: CHECK CONSTRAINTS
-- ================================================================

-- Drop existing constraints if they exist
DO $$
BEGIN
    DROP CONSTRAINT IF EXISTS invoices_proof_required;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

DO $$
BEGIN
    DROP CONSTRAINT IF EXISTS invoices_approval_required;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

DO $$
BEGIN
    DROP CONSTRAINT IF EXISTS invoices_payment_required;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

DO $$
BEGIN
    DROP CONSTRAINT IF EXISTS invoices_wallet_length;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Add check constraints
ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_proof_required 
CHECK (
    status != 'PENDING_REVIEW'::invoice_status OR 
    (proof_url IS NOT NULL AND submitted_at IS NOT NULL)
);

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_approval_required 
CHECK (
    status != 'APPROVED'::invoice_status OR 
    (approved_at IS NOT NULL AND approved_by IS NOT NULL)
);

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_payment_required 
CHECK (
    status != 'PAID'::invoice_status OR 
    (sent_at IS NOT NULL AND tx_hash IS NOT NULL)
);

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_wallet_length 
CHECK (
    wallet_address IS NULL OR 
    char_length(wallet_address) >= 32
);

-- ================================================================
-- PHASE 4: STATUS TRANSITION GUARD (TRIGGER)
-- ================================================================

-- Create trigger function for status transition guard
CREATE OR REPLACE FUNCTION public.tg_invoice_status_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Get old and new status
    DECLARE
        old_status invoice_status;
        new_status invoice_status;
    BEGIN
        old_status := OLD.status;
        new_status := NEW.status;
    EXCEPTION
        WHEN OTHERS THEN
            old_status := NULL;
            new_status := NEW.status;
    END;

    -- Allow only specific transitions
    IF old_status IS NULL THEN
        -- New invoice creation - only allow UNPAID
        IF new_status != 'UNPAID'::invoice_status THEN
            RAISE EXCEPTION 'New invoices must start with UNPAID status';
        END IF;
    ELSIF old_status = 'UNPAID'::invoice_status THEN
        -- UNPAID can only go to PENDING_REVIEW
        IF new_status != 'PENDING_REVIEW'::invoice_status THEN
            RAISE EXCEPTION 'UNPAID invoices can only transition to PENDING_REVIEW';
        END IF;
    ELSIF old_status = 'PENDING_REVIEW'::invoice_status THEN
        -- PENDING_REVIEW can go to APPROVED or REJECTED
        IF new_status NOT IN ('APPROVED'::invoice_status, 'REJECTED'::invoice_status) THEN
            RAISE EXCEPTION 'PENDING_REVIEW invoices can only transition to APPROVED or REJECTED';
        END IF;
    ELSIF old_status = 'APPROVED'::invoice_status THEN
        -- APPROVED can only go to PAID
        IF new_status != 'PAID'::invoice_status THEN
            RAISE EXCEPTION 'APPROVED invoices can only transition to PAID';
        END IF;
    ELSIF old_status = 'PAID'::invoice_status THEN
        -- PAID is immutable
        RAISE EXCEPTION 'PAID invoices are immutable and cannot be modified';
    ELSIF old_status = 'REJECTED'::invoice_status THEN
        -- REJECTED is final
        RAISE EXCEPTION 'REJECTED invoices are final and cannot be modified';
    END IF;

    -- Set timestamps based on status changes
    IF old_status IS NULL OR old_status != new_status THEN
        -- Handle proof submission
        IF new_status = 'PENDING_REVIEW'::invoice_status AND OLD.submitted_at IS NULL THEN
            NEW.submitted_at := NOW();
        END IF;

        -- Handle approval
        IF new_status = 'APPROVED'::invoice_status AND OLD.approved_at IS NULL THEN
            NEW.approved_at := NOW();
            NEW.approved_by := auth.uid();
        END IF;

        -- Handle rejection
        IF new_status = 'REJECTED'::invoice_status AND OLD.rejected_at IS NULL THEN
            NEW.rejected_at := NOW();
            NEW.rejected_by := auth.uid();
        END IF;

        -- Handle payment
        IF new_status = 'PAID'::invoice_status AND OLD.sent_at IS NULL THEN
            NEW.sent_at := NOW();
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS public.tg_invoice_status_guard ON public.invoices;
CREATE TRIGGER public.tg_invoice_status_guard
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.tg_invoice_status_guard();

-- ================================================================
-- PHASE 5: RLS FINAL LOCK
-- ================================================================

-- Enable RLS on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;

-- Member Policy
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own invoices" ON public.invoices
    FOR UPDATE USING (
        user_id = auth.uid() 
        AND OLD.status = 'UNPAID'::invoice_status
    )
    WITH CHECK (
        user_id = auth.uid() 
        AND status = 'UNPAID'::invoice_status
    );

-- Admin Policy
CREATE POLICY "Admins can manage invoices" ON public.invoices
    FOR ALL USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ================================================================
-- PHASE 6: FINAL GUARANTEE
-- ================================================================

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_approved_at ON public.invoices(approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_sent_at ON public.invoices(sent_at DESC);

-- Analyze tables for performance
ANALYZE public.invoices;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

/*
-- Query 1: Check enum type
SELECT typname, typtype FROM pg_type WHERE typname = 'invoice_status';

-- Query 2: Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'invoices'
ORDER BY ordinal_position;

-- Query 3: Check constraints
SELECT conname, contype, pg_get_constraintdef(oid) AS definition
FROM pg_constraint 
WHERE conrelid = 'public.invoices'::regclass;

-- Query 4: Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'invoices';

-- Query 5: Test status transitions
-- This should fail: PAID -> UNPAID
UPDATE public.invoices SET status = 'UNPAID'::invoice_status WHERE status = 'PAID'::invoice_status LIMIT 1;

-- Query 6: Test member permissions
-- This should fail: member trying to approve
SELECT public.is_admin();
UPDATE public.invoices SET status = 'APPROVED'::invoice_status WHERE id = 'test-id';

-- Query 7: Verify trigger exists
SELECT tgname, tgfoid::regproc AS tgfname FROM pg_trigger WHERE tgname = 'tg_invoice_status_guard';
*/
