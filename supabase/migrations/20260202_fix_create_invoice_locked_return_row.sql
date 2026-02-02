-- Migration: 20260202_fix_create_invoice_locked_return_row.sql
-- Fix: return row must be returned via record variable, not scalar subquery

DROP FUNCTION IF EXISTS public.create_invoice_locked(text,text,text,numeric);

CREATE OR REPLACE FUNCTION public.create_invoice_locked(
  p_email text,
  p_referral_code text,
  p_base_currency text,
  p_amount_input numeric
)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice_no text;
  v_expires_at timestamptz := now() + interval '23 hours';

  v_tpc_price_usd numeric := 0.001;
  v_idr_rate integer := 17000;
  v_sponsor_pct integer := 5;

  v_amount_usd numeric;
  v_tpc_amount numeric;

  v_sol_price_usd numeric;
  v_sol_updated_at timestamptz;
  v_amount_sol numeric;

  v_sponsor_bonus_pct integer := 0;
  v_sponsor_bonus_tpc numeric := 0;

  v_email text;
  v_referral text;
  v_currency text;

  v_new_invoice public.invoices;  -- <-- key fix: row variable
BEGIN
  -- Normalize inputs
  v_email := lower(trim(p_email));
  v_referral := upper(trim(p_referral_code));
  v_currency := upper(trim(p_base_currency));

  -- Validate
  IF v_email IS NULL OR position('@' in v_email) = 0 THEN
    RAISE EXCEPTION 'Email tidak valid';
  END IF;

  IF v_referral IS NULL OR length(v_referral) < 3 THEN
    RAISE EXCEPTION 'Kode referral tidak valid';
  END IF;

  IF p_amount_input IS NULL OR p_amount_input <= 0 THEN
    RAISE EXCEPTION 'Nominal tidak valid';
  END IF;

  -- Generate invoice number
  SELECT public.generate_invoice_no() INTO v_invoice_no;
  IF v_invoice_no IS NULL THEN
    RAISE EXCEPTION 'Gagal generate invoice_no';
  END IF;

  -- Currency rules + calculation
  IF v_currency = 'IDR' THEN
    IF p_amount_input <> floor(p_amount_input) THEN
      RAISE EXCEPTION 'IDR tidak boleh desimal';
    END IF;

    v_amount_usd := p_amount_input / v_idr_rate;
    v_tpc_amount := floor(v_amount_usd / v_tpc_price_usd);

    v_sol_price_usd := NULL;
    v_sol_updated_at := NULL;
    v_amount_sol := NULL;

  ELSIF v_currency = 'USDC' THEN
    IF p_amount_input <> floor(p_amount_input) THEN
      RAISE EXCEPTION 'USDC tidak boleh desimal';
    END IF;

    v_amount_usd := p_amount_input;
    v_tpc_amount := floor(v_amount_usd / v_tpc_price_usd);

    v_sol_price_usd := NULL;
    v_sol_updated_at := NULL;
    v_amount_sol := NULL;

  ELSIF v_currency = 'SOL' THEN
    IF round(p_amount_input, 3) <> p_amount_input THEN
      RAISE EXCEPTION 'SOL maksimal 3 angka desimal';
    END IF;

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

  ELSE
    RAISE EXCEPTION 'Base currency tidak didukung';
  END IF;

  IF v_tpc_amount IS NULL OR v_tpc_amount < 1 THEN
    RAISE EXCEPTION 'Jumlah TPC minimal 1';
  END IF;

  -- Sponsor bonus 5%
  v_sponsor_bonus_pct := v_sponsor_pct;
  v_sponsor_bonus_tpc := floor(v_tpc_amount * 0.05);

  -- Insert invoice & return row directly (NO subquery)
  INSERT INTO public.invoices AS inv (
    invoice_no,
    email,
    referral_code,
    base_currency,
    amount_input,
    amount_usd,
    tpc_amount,
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
    p_amount_input,
    v_amount_usd,
    v_tpc_amount,
    'UNPAID',
    v_expires_at,
    v_idr_rate,
    v_tpc_price_usd,
    v_sol_price_usd,
    v_amount_sol,
    v_sponsor_bonus_pct,
    v_sponsor_bonus_tpc
  )
  RETURNING inv.* INTO v_new_invoice;

  RETURN v_new_invoice;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_invoice_locked(text, text, text, numeric)
TO anon, authenticated;
