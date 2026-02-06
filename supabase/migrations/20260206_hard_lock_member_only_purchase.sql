-- Migration: Hard-lock member-only purchase + admin enforcement
-- File: 20260206_hard_lock_member_only_purchase.sql

-- A) Create/Update admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Hard-lock single super admin UUID
  RETURN auth.uid() = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'::uuid;
END;
$$;

-- B) Hard-lock invoice creation to authenticated users only
-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "users_can_insert_own_invoices" ON public.invoices;
DROP POLICY IF EXISTS "users_can_update_own_invoices" ON public.invoices;

-- Create strict RLS policies
CREATE POLICY "users_can_insert_own_invoices" ON public.invoices
  FOR INSERT
  WITH CHECK (
    -- Allow insert only if authenticated and user_id matches auth.uid()
    auth.uid() IS NOT NULL AND 
    user_id = auth.uid()
  );

CREATE POLICY "users_can_update_own_invoices" ON public.invoices
  FOR UPDATE
  WITH CHECK (
    -- Allow update only own invoices and only specific fields
    auth.uid() IS NOT NULL AND 
    user_id = auth.uid() AND
    (
      (proof_url IS NOT NULL AND proof_uploaded_at IS NOT NULL AND submitted_at IS NOT NULL AND status = 'PENDING_REVIEW') OR
      (status IN ('PAID', 'APPROVED', 'REJECTED'))
    )
  );

-- C) Create member-only RPC for invoice creation
CREATE OR REPLACE FUNCTION public.member_create_invoice(
  p_amount_input numeric,
  p_base_currency text,
  p_wallet_address text,
  p_ref_code text
)
RETURNS TABLE (
  id uuid,
  invoice_no text,
  expires_at timestamptz,
  tpc_amount numeric,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_email text;
  v_invoice_no text;
  v_tpc_amount numeric;
  v_stage_price_usd numeric;
  v_expires_at timestamptz;
  v_sponsor_id uuid;
  v_referral_valid boolean;
BEGIN
  -- Security: Require authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Login required';
  END IF;
  
  -- Get user info
  SELECT id, email INTO v_user_id, v_email
  FROM public.profiles
  WHERE id = auth.uid();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Validate wallet address (basic check)
  IF p_wallet_address IS NULL OR length(trim(p_wallet_address)) < 32 OR length(trim(p_wallet_address)) > 44 THEN
    RAISE EXCEPTION 'Invalid wallet address';
  END IF;
  
  -- Validate referral code
  IF p_ref_code IS NOT NULL AND trim(p_ref_code) != '' THEN
    SELECT id INTO v_sponsor_id
    FROM public.profiles
    WHERE member_code = upper(trim(p_ref_code));
    
    v_referral_valid := v_sponsor_id IS NOT NULL;
  ELSE
    v_referral_valid := FALSE;
  END IF;
  
  -- Generate invoice number
  v_invoice_no := 'INV' || to_char(now(), 'YYYYMMDDHH24MISS');
  
  -- Calculate TPC amount based on current stage
  -- Assuming Stage 1: $0.001 per TPC
  v_stage_price_usd := 0.001;
  v_tpc_amount := p_amount_input / v_stage_price_usd;
  
  -- Set expiry (24 hours from now)
  v_expires_at := now() + interval '24 hours';
  
  -- Insert invoice
  INSERT INTO public.invoices (
    user_id,
    email,
    invoice_no,
    amount_input,
    base_currency,
    amount_usd,
    tpc_amount,
    wallet_tpc,
    referral_code,
    referral_valid,
    status,
    expires_at,
    created_at
  ) VALUES (
    v_user_id,
    v_email,
    v_invoice_no,
    p_amount_input,
    p_base_currency,
    p_amount_input, -- Assuming 1:1 for now
    v_tpc_amount,
    p_wallet_address,
    p_ref_code,
    v_referral_valid,
    'PENDING_PAYMENT',
    v_expires_at,
    now()
  ) RETURNING id, invoice_no, expires_at, tpc_amount, status;
  
  -- Update referral count if valid
  IF v_referral_valid THEN
    UPDATE public.profiles
    SET referred_count = COALESCE(referred_count, 0) + 1
    WHERE id = v_sponsor_id;
  END IF;
  
END;
$$;

-- D) Update admin approve function to require admin check
CREATE OR REPLACE FUNCTION public.admin_approve_invoice(
  p_invoice_id uuid,
  p_tx_note text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  invoice_no text,
  status text,
  approved_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Security: Require admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  -- Update invoice status
  UPDATE public.invoices
  SET 
    status = 'PAID',
    approved_at = now(),
    admin_note = p_tx_note
  WHERE id = p_invoice_id
  RETURNING id, invoice_no, status, approved_at;
  
END;
$$;

-- E) Enable RLS on invoices table
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- F) Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at);

COMMIT;
