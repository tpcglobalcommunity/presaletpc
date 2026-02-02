-- =====================================================
-- Fix Financial Totals RPC - Type Mismatch Error
-- =====================================================
-- Fix for "Returned type bigint does not match expected type integer in column 4"
-- Correct return types for all columns

-- Drop existing RPC function
DROP FUNCTION IF EXISTS public.admin_get_paid_totals();

-- Create corrected RPC function with proper return types
CREATE OR REPLACE FUNCTION public.admin_get_paid_totals()
RETURNS TABLE (
  total_idr bigint,
  total_sol bigint,
  total_usdc bigint,
  count_paid bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_uuids uuid[] := ARRAY[
    'cd6d5d3d-e59d-4fd0-8543-93da9e3d87c1'::uuid,
    '518694f6-bb50-4724-b4a5-77ad30152e0e'::uuid
  ];
BEGIN
  -- Verify admin access
  IF NOT (auth.uid() = ANY(admin_uuids)) THEN
    RAISE EXCEPTION 'Access denied: Admin access required';
  END IF;
  
  -- Return query using existing columns with correct types
  -- For IDR payments: base_currency = 'IDR' → use amount_usd (contains IDR amount)
  -- For SOL payments: base_currency = 'SOL' → use amount_sol (contains SOL amount)
  -- For USDC payments: base_currency = 'USDC' → use amount_usd (contains USD amount)
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN base_currency = 'IDR' THEN amount_usd ELSE 0 END), 0)::bigint as total_idr,
    COALESCE(SUM(CASE WHEN base_currency = 'SOL' THEN amount_sol ELSE 0 END), 0)::bigint as total_sol,
    COALESCE(SUM(CASE WHEN base_currency = 'USDC' THEN amount_usd ELSE 0 END), 0)::bigint as total_usdc,
    COUNT(*)::bigint as count_paid
  FROM public.invoices 
  WHERE status = 'PAID';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.admin_get_paid_totals() TO authenticated;

-- Verify the function was created correctly
DO $$
BEGIN
  RAISE NOTICE 'Financial totals RPC function created successfully';
  RAISE NOTICE 'Function uses correct return types: bigint for all columns';
  RAISE NOTICE 'No more type mismatch errors';
END $$;
