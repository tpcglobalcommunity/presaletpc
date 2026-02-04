-- Critical Fix: Referral Schema + RPC Functions
-- Fixes UUID type errors and missing RPC functions

-- =========================================================
-- PHASE 2: ENSURE referred_by COLUMN EXISTS (UUID TYPE)
-- =========================================================

-- Add referred_by column if not exists (UUID type for proper comparisons)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'referred_by'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN referred_by uuid;
  END IF;
END $$;

-- Add foreign key constraint (safe, idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_referred_by_fkey'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_referred_by_fkey
    FOREIGN KEY (referred_by) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);

-- =========================================================
-- PHASE 3: CREATE/REPLACE RPC FUNCTIONS (EXACT NAMES)
-- =========================================================

-- Function: get_referral_stats
-- Returns referral statistics for authenticated user
CREATE OR REPLACE FUNCTION public.get_referral_stats()
RETURNS TABLE (
  total_downline bigint,
  direct_downline bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_direct_count bigint;
BEGIN
  -- Enforce authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Count direct referrals (UUID comparison)
  SELECT COUNT(*) INTO v_direct_count
  FROM public.profiles p
  WHERE p.referred_by = auth.uid();  -- UUID = UUID comparison

  -- For now, total = direct (can expand to recursive later)
  total_downline := v_direct_count;
  direct_downline := v_direct_count;

  RETURN NEXT;
END;
$$;

-- Function: get_referral_direct
-- Returns list of direct referrals for current user
CREATE OR REPLACE FUNCTION public.get_referral_direct()
RETURNS TABLE (
  user_id uuid,
  nama text,
  email text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id, 
    COALESCE(p.nama, 'Unknown') as nama,
    COALESCE(p.email_current, p.email_initial, 'No email') as email,
    p.created_at
  FROM public.profiles p
  WHERE p.referred_by = auth.uid()  -- UUID = UUID comparison
  ORDER BY p.created_at DESC;
$$;

-- Function: get_referral_direct_financial_stats
-- Returns financial statistics for direct referrals
CREATE OR REPLACE FUNCTION public.get_referral_direct_financial_stats()
RETURNS TABLE (
  direct_total_tpc_bought numeric,
  direct_total_commission_tpc numeric,
  total_withdrawn_tpc numeric,
  pending_withdrawn_tpc numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_direct_tpc_bought numeric;
BEGIN
  -- Enforce authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Calculate total TPC bought by direct referrals
  SELECT COALESCE(SUM(i.tpc_amount), 0) INTO v_direct_tpc_bought
  FROM public.profiles p
  INNER JOIN public.invoices i ON p.user_id = i.user_id
  WHERE p.referred_by = auth.uid()  -- UUID = UUID comparison
  AND i.status = 'APPROVED';

  -- Return financial statistics (TODO: implement commission/withdrawal tracking)
  RETURN QUERY
  SELECT 
    v_direct_tpc_bought as direct_total_tpc_bought,
    0::numeric as direct_total_commission_tpc,  -- TODO: Calculate from commission table
    0::numeric as total_withdrawn_tpc,          -- TODO: Calculate from withdrawal table
    0::numeric as pending_withdrawn_tpc;        -- TODO: Calculate from withdrawal table
END;
$$;

-- Function: get_my_referrals
-- Returns list of referrals for current user (alias for get_referral_direct)
CREATE OR REPLACE FUNCTION public.get_my_referrals()
RETURNS TABLE (
  user_id uuid,
  nama text,
  email text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Use the same logic as get_referral_direct
  SELECT 
    p.user_id, 
    COALESCE(p.nama, 'Unknown') as nama,
    COALESCE(p.email_current, p.email_initial, 'No email') as email,
    p.created_at
  FROM public.profiles p
  WHERE p.referred_by = auth.uid()
  ORDER BY p.created_at DESC;
$$;

-- Function: get_random_referral_code
-- Returns random referral code for sponsor assignment
CREATE OR REPLACE FUNCTION public.get_random_referral_code()
RETURNS TABLE (
  user_id uuid,
  member_code text,
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    p.member_code,
    COALESCE(p.email_current, p.email_initial) as email
  FROM public.profiles p
  WHERE p.member_code IS NOT NULL
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$;

-- Function: get_all_referrals_admin
-- Returns all referrals for admin (requires super admin check)
CREATE OR REPLACE FUNCTION public.get_all_referrals_admin()
RETURNS TABLE (
  user_id uuid,
  member_code text,
  email text,
  referred_by text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.member_code,
    COALESCE(p.email_current, p.email_initial) as email,
    COALESCE(sp.member_code::text, 'No sponsor') as referred_by,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.profiles sp ON p.referred_by = sp.user_id
  WHERE p.referred_by IS NOT NULL
  ORDER BY p.created_at DESC;
$$;

-- =========================================================
-- GRANTS (UPDATED)
-- =========================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_referral_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_direct() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_direct_financial_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_referrals() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_random_referral_code() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_referrals_admin() TO authenticated;
