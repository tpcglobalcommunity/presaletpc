-- Migration: 20260202_rpc_admin_invoice_actions.sql
-- RPC functions for admin invoice approve/reject with security

-- Approve
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

  IF v_uid::text NOT IN (
    'cd6d5d3d-e59d-4fd0-8543-93da9e3d87c1',
    '518694f6-bb50-4724-b4a5-77ad30152e0e'
  ) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  UPDATE public.invoices AS inv
  SET
    status = 'PAID',
    reviewed_by = v_uid,
    reviewed_at = now(),
    review_note = NULL
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

-- Reject
DROP FUNCTION IF EXISTS public.admin_reject_invoice(uuid, text);

CREATE OR REPLACE FUNCTION public.admin_reject_invoice(p_id uuid, p_note text)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid;
  v_row public.invoices;
  v_note text;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_uid::text NOT IN (
    'cd6d5d3d-e59d-4fd0-8543-93da9e3d87c1',
    '518694f6-bb50-4724-b4a5-77ad30152e0e'
  ) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  v_note := NULLIF(trim(p_note), '');

  UPDATE public.invoices AS inv
  SET
    status = 'CANCELLED',
    reviewed_by = v_uid,
    reviewed_at = now(),
    review_note = v_note
  WHERE inv.id = p_id
    AND inv.status = 'PENDING_REVIEW'
  RETURNING inv.* INTO v_row;

  IF v_row.id IS NULL THEN
    RAISE EXCEPTION 'Invoice not found or not in PENDING_REVIEW';
  END IF;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_reject_invoice(uuid, text) TO authenticated;
