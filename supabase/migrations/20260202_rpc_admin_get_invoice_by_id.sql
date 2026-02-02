-- RPC to get invoice by ID for admin
-- Migration: 20260202_rpc_admin_get_invoice_by_id.sql

CREATE OR REPLACE FUNCTION public.admin_get_invoice_by_id(p_id uuid)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice public.invoices;
BEGIN
  -- Get invoice by ID
  SELECT inv.*
  INTO v_invoice
  FROM public.invoices inv
  WHERE inv.id = p_id;
  
  IF v_invoice IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN v_invoice;
END;
$$;

-- Grant access to authenticated users (admin only)
GRANT EXECUTE ON FUNCTION public.admin_get_invoice_by_id(uuid) TO authenticated;
