-- Migration: 20260205_fix_invoices_id_default_and_rpc.sql
-- Purpose: Fix invoice ID NULL constraint and RPC function
-- Ensure invoices.id always has value and RPC returns proper data

-- 1. Ensure invoices.id has proper default (already exists in schema, but double-check)
ALTER TABLE public.invoices 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Add missing user_id column if not exists (for proper RLS)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.invoices 
        ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 3. Fix create_invoice_locked RPC to include user_id and proper ID handling
DROP FUNCTION IF EXISTS public.create_invoice_locked(text,text,text,numeric,text);

CREATE OR REPLACE FUNCTION public.create_invoice_locked(
  p_email text,
  p_referral_code text,
  p_base_currency text,
  p_amount_input numeric,
  p_wallet_tpc text
)
RETURNS SETOF public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice_no text;
  v_expires_at timestamptz := now() + interval '23 hours';
  v_user_id uuid;

  v_tpc_price_usd numeric := 0.001;
  v_idr_rate integer := 17000;
  v_sponsor_pct integer := 5;

  v_amount_usd numeric;
  v_tpc_amount numeric;
  v_amount_idr numeric;

  v_sol_price_usd numeric;
  v_sol_updated_at timestamptz;
  v_amount_sol numeric;

  v_sponsor_bonus_pct integer := 0;
  v_sponsor_bonus_tpc numeric;

  v_email text;
  v_referral text;
  v_currency text;
  v_wallet text;
  v_result public.invoices%ROWTYPE;
BEGIN
  v_email := lower(trim(p_email));
  v_referral := upper(trim(p_referral_code));
  v_currency := upper(trim(p_base_currency));
  v_wallet := trim(p_wallet_tpc);

  -- Input validation
  IF v_email IS NULL OR position('@' in v_email) = 0 THEN
    RAISE EXCEPTION 'Email tidak valid';
  END IF;

  IF v_referral IS NULL OR length(v_referral) < 3 THEN
    RAISE EXCEPTION 'Kode referral tidak valid';
  END IF;

  IF v_currency NOT IN ('IDR', 'SOL') THEN
    RAISE EXCEPTION 'Base currency tidak didukung';
  END IF;

  IF p_amount_input IS NULL OR p_amount_input <= 0 THEN
    RAISE EXCEPTION 'Amount input harus positif';
  END IF;

  -- Generate invoice number
  v_invoice_no := 'INV-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text), 1, 4));

  -- Calculate amounts based on currency
  IF v_currency = 'IDR' THEN
    v_amount_idr := p_amount_input;
    v_amount_usd := p_amount_input / v_idr_rate;
    v_tpc_amount := floor(v_amount_usd / v_tpc_price_usd);
    v_amount_sol := NULL;
  ELSIF v_currency = 'SOL' THEN
    v_amount_sol := p_amount_input;
    
    SELECT pc.value, pc.updated_at
      INTO v_sol_price_usd, v_sol_updated_at
    FROM public.price_cache pc
    WHERE pc.key = 'SOL_USD';

    IF v_sol_price_usd IS NULL OR v_sol_price_usd <= 0 THEN
      RAISE EXCEPTION 'SOL price unavailable';
    END IF;

    IF v_sol_updated_at IS NULL OR (now() - v_sol_updated_at) > interval '10 minutes' THEN
      RAISE EXCEPTION 'SOL price stale. Please refresh and try again.';
    END IF;

    v_amount_usd := v_amount_sol * v_sol_price_usd;
    v_tpc_amount := floor(v_amount_usd / v_tpc_price_usd);
    v_amount_idr := NULL;
  ELSE
    RAISE EXCEPTION 'Base currency tidak didukung';
  END IF;

  IF v_tpc_amount IS NULL OR v_tpc_amount < 1 THEN
    RAISE EXCEPTION 'Jumlah TPC minimal 1';
  END IF;

  -- Calculate sponsor bonus
  v_sponsor_bonus_pct := v_sponsor_pct;
  v_sponsor_bonus_tpc := floor(v_tpc_amount * 0.05);

  -- Insert invoice with proper ID (will use DEFAULT gen_random_uuid())
  -- Note: user_id will be set later by client or auth context
  INSERT INTO public.invoices (
    invoice_no, 
    email, 
    referral_code, 
    base_currency,
    amount_input, 
    amount_usd, 
    tpc_amount, 
    amount_idr,
    wallet_tpc, 
    status, 
    expires_at,
    idr_rate, 
    tpc_price_usd, 
    sol_price_usd, 
    amount_sol,
    sponsor_bonus_pct, 
    sponsor_bonus_tpc
  )
  VALUES (
    v_invoice_no, 
    v_email, 
    v_referral, 
    v_currency,
    CASE WHEN v_currency = 'IDR' THEN v_amount_idr ELSE p_amount_input END,
    v_amount_usd, 
    v_tpc_amount, 
    v_amount_idr,
    v_wallet, 
    'UNPAID', 
    v_expires_at,
    v_idr_rate, 
    v_tpc_price_usd, 
    v_sol_price_usd, 
    v_amount_sol,
    v_sponsor_bonus_pct, 
    v_sponsor_bonus_tpc
  )
  RETURNING * INTO v_result;

  -- Return the created invoice
  RETURN NEXT v_result;
  RETURN;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_invoice_locked(text,text,text,numeric,text) TO anon, authenticated;

-- 4. Add index for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_no ON public.invoices(invoice_no);
CREATE INDEX IF NOT EXISTS idx_invoices_email_status ON public.invoices(email, status);
