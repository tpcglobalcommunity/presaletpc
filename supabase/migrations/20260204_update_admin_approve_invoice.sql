-- Migration: Update admin_approve_invoice to include TPC delivery tracking
-- Purpose: Add approved_at, tpc_tx_hash, tpc_sent fields for approval tracking
-- Note: Email notification will be handled on frontend side

DROP FUNCTION IF EXISTS public.admin_approve_invoice(uuid);

CREATE OR REPLACE FUNCTION public.admin_approve_invoice(p_id uuid)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid;
  v_row public.invoices;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if user is admin using is_admin function
  IF NOT public.is_admin(v_uid) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  -- Update invoice with approval tracking
  UPDATE public.invoices AS inv
  SET
    status = 'PAID',
    reviewed_by = v_uid,
    reviewed_at = now(),
    review_note = NULL,
    approved_at = now(),
    tpc_sent = true
  WHERE inv.id = p_id
    AND inv.status = 'PENDING_REVIEW'
  RETURNING inv.* INTO v_row;

  IF v_row.id IS NULL THEN
    RAISE EXCEPTION 'Invoice not found or not in PENDING_REVIEW';
  END IF;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_approve_invoice(uuid) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.admin_approve_invoice IS 'Admin approval with TPC delivery tracking';
