-- =====================================================
-- Admin Financial Totals RPC Function
-- =====================================================
-- RPC function to safely aggregate paid invoice totals without payment_method dependency

-- Create RPC function for admin financial totals
CREATE OR REPLACE FUNCTION public.admin_get_paid_totals()
RETURNS TABLE (
  total_idr numeric,
  total_sol numeric,
  total_usdc numeric,
  count_paid int
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
  
  -- Return query with aggregated totals
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN amount_idr > 0 THEN amount_idr ELSE 0 END), 0) as total_idr,
    COALESCE(SUM(CASE WHEN amount_sol > 0 THEN amount_sol ELSE 0 END), 0) as total_sol,
    COALESCE(SUM(CASE WHEN amount_usdc > 0 THEN amount_usdc ELSE 0 END), 0) as total_usdc,
    COUNT(*) as count_paid
  FROM public.invoices 
  WHERE status = 'PAID';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.admin_get_paid_totals() TO authenticated;
