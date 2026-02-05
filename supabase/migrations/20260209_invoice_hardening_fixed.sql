-- Migration: 20260209_invoice_hardening_fixed.sql
-- Description: Fixed invoice hardening with proper PostgreSQL syntax
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

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'proof_url'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN proof_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'proof_uploaded_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN proof_uploaded_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'submitted_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN submitted_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'approved_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN approved_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN approved_by UUID REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'rejected_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN rejected_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'rejected_by'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN rejected_by UUID REFERENCES auth.users(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'reject_note'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN reject_note TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'sent_at'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN sent_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'tx_hash'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN tx_hash TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'wallet_address'
    ) THEN
        ALTER TABLE public.invoices ADD COLUMN wallet_address TEXT;
    END IF;
END $$;

ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_proof_required;
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_approval_required;
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_payment_required;
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_wallet_length;

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_proof_required
CHECK (
    status <> 'PENDING_REVIEW'::invoice_status OR 
    (proof_url IS NOT NULL AND submitted_at IS NOT NULL)
);

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_approval_required
CHECK (
    status <> 'APPROVED'::invoice_status OR 
    (approved_at IS NOT NULL AND approved_by IS NOT NULL)
);

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_payment_required
CHECK (
    status <> 'PAID'::invoice_status OR 
    (sent_at IS NOT NULL AND tx_hash IS NOT NULL)
);

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_wallet_length
CHECK (
    wallet_address IS NULL OR 
    length(wallet_address) >= 32
);

CREATE OR REPLACE FUNCTION public.guard_invoice_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    old_status invoice_status;
    new_status invoice_status;
BEGIN
    BEGIN
        old_status := OLD.status;
        new_status := NEW.status;
    EXCEPTION
        WHEN OTHERS THEN
        old_status := NULL;
        new_status := NEW.status;
    END;

    IF old_status IS NULL THEN
        IF new_status != 'UNPAID'::invoice_status THEN
            RAISE EXCEPTION 'New invoices must start with UNPAID status';
        END IF;
        RETURN NEW;
    END IF;

    CASE old_status
        WHEN 'UNPAID'::invoice_status THEN
            IF new_status != 'PENDING_REVIEW'::invoice_status THEN
                RAISE EXCEPTION 'UNPAID invoices can only transition to PENDING_REVIEW';
            END IF;
            
        WHEN 'PENDING_REVIEW'::invoice_status THEN
            IF new_status NOT IN ('APPROVED'::invoice_status, 'REJECTED'::invoice_status) THEN
                RAISE EXCEPTION 'PENDING_REVIEW invoices can only transition to APPROVED or REJECTED';
            END IF;
            
        WHEN 'APPROVED'::invoice_status THEN
            IF new_status != 'PAID'::invoice_status THEN
                RAISE EXCEPTION 'APPROVED invoices can only transition to PAID';
            END IF;
            
        WHEN 'PAID'::invoice_status THEN
            RAISE EXCEPTION 'PAID invoices are immutable and cannot be modified';
            
        WHEN 'REJECTED'::invoice_status THEN
            RAISE EXCEPTION 'REJECTED invoices are final and cannot be modified';
            
        ELSE
            RAISE EXCEPTION 'Invalid status transition from % to %', old_status, new_status;
    END CASE;

    IF old_status != new_status THEN
        IF new_status = 'PENDING_REVIEW'::invoice_status AND OLD.submitted_at IS NULL THEN
            NEW.submitted_at := NOW();
        END IF;

        IF new_status = 'APPROVED'::invoice_status AND OLD.approved_at IS NULL THEN
            NEW.approved_at := NOW();
            NEW.approved_by := auth.uid();
        END IF;

        IF new_status = 'REJECTED'::invoice_status AND OLD.rejected_at IS NULL THEN
            NEW.rejected_at := NOW();
            NEW.rejected_by := auth.uid();
        END IF;

        IF new_status = 'PAID'::invoice_status AND OLD.sent_at IS NULL THEN
            NEW.sent_at := NOW();
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_invoice_status_guard ON public.invoices;
CREATE TRIGGER tg_invoice_status_guard
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.guard_invoice_status_transition();

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        CREATE OR REPLACE FUNCTION public.is_admin()
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        STABLE
        AS $$
        BEGIN
            RETURN FALSE;
        END;
        $$;
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.member_submit_payment_proof(p_invoice_id UUID, p_proof_url TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_current_status invoice_status;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    SELECT status INTO v_current_status
    FROM public.invoices
    WHERE id = p_invoice_id AND user_id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invoice not found or access denied';
    END IF;

    IF v_current_status != 'UNPAID'::invoice_status THEN
        RAISE EXCEPTION 'Only UNPAID invoices can submit payment proof';
    END IF;

    UPDATE public.invoices
    SET 
        proof_url = p_proof_url,
        proof_uploaded_at = NOW(),
        submitted_at = NOW(),
        status = 'PENDING_REVIEW'::invoice_status
    WHERE id = p_invoice_id AND user_id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Payment proof submitted successfully'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_approve_invoice(p_invoice_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_status invoice_status;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Admin access required';
    END IF;

    SELECT status INTO v_current_status
    FROM public.invoices
    WHERE id = p_invoice_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invoice not found';
    END IF;

    IF v_current_status != 'PENDING_REVIEW'::invoice_status THEN
        RAISE EXCEPTION 'Only PENDING_REVIEW invoices can be approved';
    END IF;

    UPDATE public.invoices
    SET 
        status = 'APPROVED'::invoice_status,
        approved_at = NOW(),
        approved_by = auth.uid()
    WHERE id = p_invoice_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Invoice approved successfully'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reject_invoice(p_invoice_id UUID, p_note TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_status invoice_status;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Admin access required';
    END IF;

    SELECT status INTO v_current_status
    FROM public.invoices
    WHERE id = p_invoice_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invoice not found';
    END IF;

    IF v_current_status != 'PENDING_REVIEW'::invoice_status THEN
        RAISE EXCEPTION 'Only PENDING_REVIEW invoices can be rejected';
    END IF;

    UPDATE public.invoices
    SET 
        status = 'REJECTED'::invoice_status,
        rejected_at = NOW(),
        rejected_by = auth.uid(),
        reject_note = p_note
    WHERE id = p_invoice_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Invoice rejected successfully'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_mark_invoice_paid(p_invoice_id UUID, p_tx_hash TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_status invoice_status;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Admin access required';
    END IF;

    SELECT status INTO v_current_status
    FROM public.invoices
    WHERE id = p_invoice_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invoice not found';
    END IF;

    IF v_current_status != 'APPROVED'::invoice_status THEN
        RAISE EXCEPTION 'Only APPROVED invoices can be marked as paid';
    END IF;

    UPDATE public.invoices
    SET 
        status = 'PAID'::invoice_status,
        sent_at = NOW(),
        tx_hash = p_tx_hash
    WHERE id = p_invoice_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Invoice marked as paid successfully'
    );
END;
$$;

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;

CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage invoices" ON public.invoices
    FOR ALL USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_approved_at ON public.invoices(approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_sent_at ON public.invoices(sent_at DESC);

ANALYZE public.invoices;
