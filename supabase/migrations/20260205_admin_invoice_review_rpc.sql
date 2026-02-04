-- Admin Invoice Review RPC Functions
-- Migration: 20260205_admin_invoice_review_rpc.sql

-- RPC 1: List invoices with optional status filter
CREATE OR REPLACE FUNCTION admin_list_invoices(p_status text default null)
RETURNS TABLE (
    id uuid,
    invoice_no text,
    status text,
    base_currency text,
    amount_input numeric,
    tpc_amount numeric,
    created_at timestamptz,
    submitted_at timestamptz,
    proof_uploaded_at timestamptz,
    reviewed_at timestamptz,
    approved_at timestamptz,
    rejected_at timestamptz,
    tpc_sent boolean,
    tpc_tx_hash text,
    email text,
    proof_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Security check
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    RETURN QUERY
    SELECT 
        i.id,
        i.invoice_no,
        i.status,
        i.base_currency,
        i.amount_input,
        i.tpc_amount,
        i.created_at,
        i.submitted_at,
        i.proof_uploaded_at,
        i.reviewed_at,
        i.approved_at,
        i.rejected_at,
        i.tpc_sent,
        i.tpc_tx_hash,
        i.email,
        i.proof_url
    FROM invoices i
    WHERE 
        (p_status IS NULL OR i.status = p_status)
    ORDER BY i.created_at DESC;
END;
$$;

-- RPC 2: Get invoice detail with wallet info
CREATE OR REPLACE FUNCTION admin_get_invoice_detail(p_invoice_id uuid)
RETURNS TABLE (
    id uuid,
    invoice_no text,
    status text,
    base_currency text,
    amount_input numeric,
    tpc_amount numeric,
    created_at timestamptz,
    submitted_at timestamptz,
    proof_uploaded_at timestamptz,
    reviewed_at timestamptz,
    approved_at timestamptz,
    rejected_at timestamptz,
    tpc_sent boolean,
    tpc_tx_hash text,
    email text,
    proof_url text,
    wallet_tpc text,
    profile_wallet_tpc text,
    review_note text,
    rejected_reason text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Security check
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    RETURN QUERY
    SELECT 
        i.id,
        i.invoice_no,
        i.status,
        i.base_currency,
        i.amount_input,
        i.tpc_amount,
        i.created_at,
        i.submitted_at,
        i.proof_uploaded_at,
        i.reviewed_at,
        i.approved_at,
        i.rejected_at,
        i.tpc_sent,
        i.tpc_tx_hash,
        i.email,
        i.proof_url,
        i.wallet_tpc,
        p.wallet_tpc as profile_wallet_tpc,
        i.review_note,
        i.rejected_reason
    FROM invoices i
    LEFT JOIN profiles p ON i.user_id = p.id
    WHERE i.id = p_invoice_id;
END;
$$;

-- RPC 3: Reject invoice
CREATE OR REPLACE FUNCTION admin_reject_invoice(p_invoice_id uuid, p_reason text, p_note text default null)
RETURNS TABLE (
    id uuid,
    status text,
    rejected_at timestamptz,
    rejected_by uuid,
    rejected_reason text,
    review_note text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Security check
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    -- Validate reason
    IF p_reason IS NULL OR p_reason = '' THEN
        RAISE EXCEPTION 'Reject reason is required';
    END IF;
    
    -- Update invoice
    UPDATE invoices
    SET 
        status = 'REJECTED',
        rejected_at = NOW(),
        rejected_by = auth.uid(),
        rejected_reason = p_reason,
        review_note = COALESCE(p_note, review_note),
        reviewed_at = NOW(),
        reviewed_by = auth.uid()
    WHERE id = p_invoice_id
    RETURNING 
        id,
        status,
        rejected_at,
        rejected_by,
        rejected_reason,
        review_note;
END;
$$;

-- RPC 4: Approve invoice
CREATE OR REPLACE FUNCTION admin_approve_invoice(p_invoice_id uuid, p_note text default null)
RETURNS TABLE (
    id uuid,
    status text,
    reviewed_at timestamptz,
    reviewed_by uuid,
    approved_at timestamptz,
    review_note text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Security check
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    -- Update invoice
    UPDATE invoices
    SET 
        status = 'APPROVED',
        reviewed_at = NOW(),
        reviewed_by = auth.uid(),
        approved_at = NOW(),
        review_note = COALESCE(p_note, review_note)
    WHERE id = p_invoice_id
    RETURNING 
        id,
        status,
        reviewed_at,
        reviewed_by,
        approved_at,
        review_note;
END;
$$;

-- RPC 5: Mark invoice as sent
CREATE OR REPLACE FUNCTION admin_mark_invoice_sent(p_invoice_id uuid, p_tpc_tx_hash text)
RETURNS TABLE (
    id uuid,
    tpc_sent boolean,
    tpc_tx_hash text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Security check
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    -- Validate tx hash
    IF p_tpc_tx_hash IS NULL OR p_tpc_tx_hash = '' THEN
        RAISE EXCEPTION 'Transaction hash is required';
    END IF;
    
    -- Check if invoice is approved
    IF NOT EXISTS (
        SELECT 1 FROM invoices 
        WHERE id = p_invoice_id AND status = 'APPROVED'
    ) THEN
        RAISE EXCEPTION 'Invoice must be approved first';
    END IF;
    
    -- Update invoice
    UPDATE invoices
    SET 
        tpc_sent = true,
        tpc_tx_hash = p_tpc_tx_hash
    WHERE id = p_invoice_id
    RETURNING 
        id,
        tpc_sent,
        tpc_tx_hash;
END;
$$;
