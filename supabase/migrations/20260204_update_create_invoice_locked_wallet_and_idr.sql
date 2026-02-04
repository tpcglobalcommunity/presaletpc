-- Migration: 20260204_update_create_invoice_locked_wallet_and_idr.sql
-- Purpose: Update create_invoice_locked to require wallet and handle amount_idr
-- Safety: Maintains existing function return contract

-- 1) DROP function yang return type lama (signature 5 args)
DROP FUNCTION IF EXISTS public.create_invoice_locked(text,text,text,numeric,text);

-- 2) CREATE ulang dengan return type yang FIXED
CREATE FUNCTION public.create_invoice_locked(
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
  v_sponsor_bonus_tpc numeric := 0;

  v_email text;
  v_referral text;
  v_currency text;
  v_wallet text;
BEGIN
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

  IF p_amount_input IS NULL OR p_amount_input <= 0 THEN
    RAISE EXCEPTION 'Nominal tidak valid';
  END IF;

  IF v_wallet IS NULL OR length(v_wallet) < 32 THEN
    RAISE EXCEPTION 'Wallet TPC wajib diisi';
  END IF;

  SELECT public.generate_invoice_no() INTO v_invoice_no;
  IF v_invoice_no IS NULL THEN
    RAISE EXCEPTION 'Gagal generate invoice_no';
  END IF;

  IF v_currency = 'IDR' THEN
    v_amount_idr := trunc(p_amount_input)::numeric(18,0);
    IF v_amount_idr <= 0 THEN
      RAISE EXCEPTION 'Nominal IDR tidak valid';
    END IF;

    v_amount_usd := v_amount_idr / v_idr_rate;
    v_tpc_amount := floor(v_amount_usd / v_tpc_price_usd);

    v_sol_price_usd := NULL;
    v_sol_updated_at := NULL;
    v_amount_sol := NULL;

  ELSIF v_currency = 'USDC' THEN
    IF round(p_amount_input, 2) <> p_amount_input THEN
      RAISE EXCEPTION 'USDC maksimal 2 angka desimal';
    END IF;

    v_amount_usd := p_amount_input;
    v_tpc_amount := floor(v_amount_usd / v_tpc_price_usd);

    v_amount_idr := NULL;
    v_sol_price_usd := NULL;
    v_sol_updated_at := NULL;
    v_amount_sol := NULL;

  ELSIF v_currency = 'SOL' THEN
    IF round(p_amount_input, 4) <> p_amount_input THEN
      RAISE EXCEPTION 'SOL maksimal 4 angka desimal';
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
    v_amount_idr := NULL;

  ELSE
    RAISE EXCEPTION 'Base currency tidak didukung';
  END IF;

  IF v_tpc_amount IS NULL OR v_tpc_amount < 1 THEN
    RAISE EXCEPTION 'Jumlah TPC minimal 1';
  END IF;

  v_sponsor_bonus_pct := v_sponsor_pct;
  v_sponsor_bonus_tpc := floor(v_tpc_amount * 0.05);

  INSERT INTO public.invoices (
    invoice_no, email, referral_code, base_currency,
    amount_input, amount_usd, tpc_amount, amount_idr,
    wallet_tpc, status, expires_at,
    idr_rate, tpc_price_usd, sol_price_usd, amount_sol,
    sponsor_bonus_pct, sponsor_bonus_tpc
  )
  VALUES (
    v_invoice_no, v_email, v_referral, v_currency,
    CASE WHEN v_currency = 'IDR' THEN v_amount_idr ELSE p_amount_input END,
    v_amount_usd, v_tpc_amount, v_amount_idr,
    v_wallet, 'UNPAID', v_expires_at,
    v_idr_rate, v_tpc_price_usd, v_sol_price_usd, v_amount_sol,
    v_sponsor_bonus_pct, v_sponsor_bonus_tpc
  );

  RETURN NEXT (
    SELECT i
    FROM public.invoices i
    WHERE i.invoice_no = v_invoice_no
    LIMIT 1
  );
  RETURN;
END;
$$;

-- 3) GRANT execute
GRANT EXECUTE ON FUNCTION public.create_invoice_locked(text,text,text,numeric,text)
TO anon, authenticated;
