-- Migration: 20260205_fix_invoices_user_id_auth_guard.sql
-- Purpose: Fix invoices.user_id NULL by adding auth guard and backfilling data

-- A) Repair data lama (backfill user_id yang NULL)
UPDATE public.invoices i
SET user_id = p.user_id
FROM public.profiles p
WHERE i.user_id IS NULL
  AND p.user_id IS NOT NULL
  AND p.email IS NOT NULL
  AND i.email IS NOT NULL
  AND lower(i.email) = lower(p.email);

-- B) Patch RPC create_invoice_locked dengan auth guard
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
  -- AUTH GUARD: Reject if not authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;
  
  -- Get authenticated user ID
  v_user_id := auth.uid();
  
  -- Input validation
  v_email := lower(trim(p_email));
  v_referral := upper(trim(p_referral_code));
  v_currency := upper(trim(p_base_currency));
  v_wallet := trim(p_wallet_tpc);

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

  -- Insert invoice with authenticated user_id (NOT NULL)
  INSERT INTO public.invoices (
    id, -- Will use DEFAULT gen_random_uuid()
    user_id, -- MANDATORY from auth.uid()
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
    DEFAULT, -- id will use gen_random_uuid()
    v_user_id, -- MANDATORY from auth.uid()
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

-- C) Optional hardening: Add NOT NULL constraint if no NULL user_id remaining
DO $$
DECLARE v_cnt bigint;
BEGIN
  SELECT count(*) INTO v_cnt FROM public.invoices WHERE user_id IS NULL;
  IF v_cnt = 0 THEN
    ALTER TABLE public.invoices ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Add logging index for better debugging
CREATE INDEX IF NOT EXISTS idx_invoices_user_id_email ON public.invoices(user_id, email) WHERE user_id IS NOT NULL;
