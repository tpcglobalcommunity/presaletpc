-- Migration: Create public invoice RPC (read-only, secure)
-- Purpose: Allow public access to invoice details without authentication
-- Security: READ-ONLY only, no sensitive data exposed

CREATE OR REPLACE FUNCTION get_public_invoice_by_token(p_invoice_no TEXT)
RETURNS TABLE (
  invoice_no TEXT,
  status TEXT,
  amount_input NUMERIC,
  amount_usd NUMERIC,
  tpc_amount NUMERIC,
  base_currency TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  tpc_tx_hash TEXT,
  tpc_sent BOOLEAN,
  wallet_tpc TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    i.invoice_no,
    i.status,
    i.amount_input,
    i.amount_usd,
    i.tpc_amount,
    i.base_currency,
    i.created_at,
    i.approved_at,
    i.tpc_tx_hash,
    i.tpc_sent,
    i.wallet_tpc
  FROM public.invoices i
  WHERE i.invoice_no = p_invoice_no;
$$;

-- Grant public access (anonymous users can access)
GRANT EXECUTE ON FUNCTION public.get_public_invoice_by_token(TEXT) TO anon;

-- Add comment for documentation
COMMENT ON FUNCTION public.get_public_invoice_by_token IS 'Public read-only access to invoice details without authentication';
