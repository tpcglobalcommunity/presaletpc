-- Migration: 20260202_rpc_member_invoice_flow.sql
-- RPC functions for member invoice flow with security

-- 1) Get my invoices list
DROP FUNCTION IF EXISTS public.member_list_invoices();
CREATE OR REPLACE FUNCTION public.member_list_invoices()
RETURNS SETOF public.invoices
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.invoices
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC;
$$;
GRANT EXECUTE ON FUNCTION public.member_list_invoices() TO authenticated;

-- 2) Get single invoice by id (must be mine)
DROP FUNCTION IF EXISTS public.member_get_invoice_by_id(uuid);
CREATE OR REPLACE FUNCTION public.member_get_invoice_by_id(p_id uuid)
RETURNS public.invoices
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.invoices
  WHERE id = p_id
    AND user_id = auth.uid()
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.member_get_invoice_by_id(uuid) TO authenticated;

-- 3) Submit payment proof (set transfer_method, wallet_tpc, proof_url) only if UNPAID and not expired
DROP FUNCTION IF EXISTS public.member_submit_payment_proof(uuid, text, text, text);
CREATE OR REPLACE FUNCTION public.member_submit_payment_proof(
  p_id uuid,
  p_transfer_method text,
  p_wallet_tpc text,
  p_proof_url text
)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.invoices;
  v_method text;
  v_wallet text;
  v_proof text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_method := NULLIF(trim(p_transfer_method), '');
  v_wallet := NULLIF(trim(p_wallet_tpc), '');
  v_proof  := NULLIF(trim(p_proof_url), '');

  IF v_method IS NULL THEN
    RAISE EXCEPTION 'Transfer method wajib diisi';
  END IF;

  IF v_wallet IS NULL THEN
    RAISE EXCEPTION 'Alamat wallet TPC wajib diisi';
  END IF;

  IF v_proof IS NULL THEN
    RAISE EXCEPTION 'Proof URL wajib ada';
  END IF;

  UPDATE public.invoices AS inv
  SET
    transfer_method = v_method,
    wallet_tpc = v_wallet,
    proof_url = v_proof,
    proof_uploaded_at = now(),
    submitted_at = now(),
    status = 'PENDING_REVIEW'
  WHERE inv.id = p_id
    AND inv.user_id = auth.uid()
    AND inv.status = 'UNPAID'
    AND (inv.expires_at IS NULL OR inv.expires_at > now())
  RETURNING inv.* INTO v_row;

  IF v_row.id IS NULL THEN
    RAISE EXCEPTION 'Invoice tidak ditemukan / bukan milik kamu / sudah tidak bisa disubmit';
  END IF;

  RETURN v_row;
END;
$$;
GRANT EXECUTE ON FUNCTION public.member_submit_payment_proof(uuid, text, text, text) TO authenticated;
