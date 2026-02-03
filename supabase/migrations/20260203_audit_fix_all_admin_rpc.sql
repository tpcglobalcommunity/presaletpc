-- AUDIT & FIX ADMIN RPC AUTHORIZATION (SUPABASE)
-- Make public.is_admin() the SINGLE SOURCE OF TRUTH for all admin access

-- PHASE 1: PATCH ALL ADMIN RPC FUNCTIONS TO USE public.is_admin()

-- 1. Fix admin_get_paid_totals (already fixed in previous migration, but ensuring consistency)
CREATE OR REPLACE FUNCTION public.admin_get_paid_totals()
RETURNS TABLE (
  total_invoices bigint,
  pending_review bigint,
  approved bigint,
  total_tpc_sold numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    COUNT(*) AS total_invoices,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending_review,
    COUNT(*) FILTER (WHERE status = 'approved') AS approved,
    COALESCE(SUM(tpc_amount), 0) AS total_tpc_sold
  FROM invoices;
END;
$$;

-- 2. Fix get_dashboard_stats_admin
CREATE OR REPLACE FUNCTION public.get_dashboard_stats_admin()
RETURNS TABLE (
  total_users BIGINT,
  total_invoices BIGINT,
  pending_review BIGINT,
  approved BIGINT,
  rejected BIGINT,
  total_tpc_sold NUMERIC,
  total_idr NUMERIC,
  total_sol NUMERIC,
  total_usdc NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles) AS total_users,
    (SELECT COUNT(*) FROM invoices) AS total_invoices,
    (SELECT COUNT(*) FROM invoices WHERE status = 'pending') AS pending_review,
    (SELECT COUNT(*) FROM invoices WHERE status = 'approved') AS approved,
    (SELECT COUNT(*) FROM invoices WHERE status = 'rejected') AS rejected,
    COALESCE((SELECT SUM(tpc_amount) FROM invoices WHERE status = 'approved'), 0) AS total_tpc_sold,
    COALESCE((SELECT SUM(amount_idr) FROM invoices WHERE status = 'approved' AND amount_idr IS NOT NULL), 0) AS total_idr,
    COALESCE((SELECT SUM(amount_sol) FROM invoices WHERE status = 'approved' AND amount_sol IS NOT NULL), 0) AS total_sol,
    COALESCE((SELECT SUM(amount_usdc) FROM invoices WHERE status = 'approved' AND amount_usdc IS NOT NULL), 0) AS total_usdc;
END;
$$;

-- 3. Fix get_all_users_admin
CREATE OR REPLACE FUNCTION public.get_all_users_admin(p_limit int DEFAULT 200, p_offset int DEFAULT 0)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  member_code TEXT,
  role TEXT,
  total_invoices BIGINT,
  paid_invoices BIGINT,
  total_tpc NUMERIC,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    COALESCE(p.email_current, p.email_initial, p.email) AS email,
    p.member_code,
    p.role,
    COALESCE(inv_counts.total_invoices, 0) AS total_invoices,
    COALESCE(inv_counts.paid_invoices, 0) AS paid_invoices,
    COALESCE(inv_counts.total_tpc, 0) AS total_tpc,
    p.created_at,
    p.updated_at
  FROM profiles p
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) AS total_invoices,
      COUNT(*) FILTER (WHERE status = 'approved') AS paid_invoices,
      COALESCE(SUM(tpc_amount), 0) AS total_tpc
    FROM invoices 
    GROUP BY user_id
  ) inv_counts ON p.user_id = inv_counts.user_id
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- 4. Fix admin_approve_invoice
CREATE OR REPLACE FUNCTION public.admin_approve_invoice(p_id uuid)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_invoice public.invoices;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin access required';
  END IF;

  UPDATE public.invoices 
  SET 
    status = 'approved',
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO updated_invoice;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invoice not found';
  END IF;

  RETURN updated_invoice;
END;
$$;

-- 5. Fix admin_reject_invoice
CREATE OR REPLACE FUNCTION public.admin_reject_invoice(p_id uuid, p_note text)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_invoice public.invoices;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin access required';
  END IF;

  UPDATE public.invoices 
  SET 
    status = 'rejected',
    rejection_note = p_note,
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO updated_invoice;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invoice not found';
  END IF;

  RETURN updated_invoice;
END;
$$;

-- 6. Fix get_admin_users_data (alias for get_all_users_admin)
CREATE OR REPLACE FUNCTION public.get_admin_users_data(p_limit int DEFAULT 200, p_offset int DEFAULT 0)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  member_code TEXT,
  role TEXT,
  total_invoices BIGINT,
  paid_invoices BIGINT,
  total_tpc NUMERIC,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT * FROM public.get_all_users_admin(p_limit, p_offset);
END;
$$;

-- PHASE 2: GRANT EXECUTION PERMISSIONS WITH CORRECT SIGNATURES
GRANT EXECUTE ON FUNCTION public.admin_get_paid_totals() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats_admin() TO authenticated;

-- Fix: functions with parameters need correct signature
GRANT EXECUTE ON FUNCTION public.get_all_users_admin(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_invoice(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reject_invoice(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_users_data(integer, integer) TO authenticated;

-- PHASE 3: CLEANUP LEGACY FUNCTIONS (DEPRECATED)
-- Comment out or remove old admin check functions that are no longer needed
-- DROP FUNCTION IF EXISTS public.is_super_admin(uuid);
-- DROP FUNCTION IF EXISTS public.is_admin_user(uuid);

-- PHASE 4: VERIFICATION
SELECT '=== ADMIN RPC FUNCTIONS UPDATED ===' as status;
SELECT 'admin_get_paid_totals' as function_name, 'UPDATED with public.is_admin() + security hardening' as status;
SELECT 'get_dashboard_stats_admin' as function_name, 'UPDATED with public.is_admin() + security hardening' as status;
SELECT 'get_all_users_admin' as function_name, 'UPDATED with public.is_admin() + security hardening' as status;
SELECT 'admin_approve_invoice' as function_name, 'UPDATED with public.is_admin() + security hardening' as status;
SELECT 'admin_reject_invoice' as function_name, 'UPDATED with public.is_admin() + security hardening' as status;
SELECT 'get_admin_users_data' as function_name, 'UPDATED with public.is_admin() + security hardening' as status;

-- Test admin check function (will be false without proper JWT context)
SELECT 'public.is_admin() function test (no auth context):' as info, public.is_admin() as is_admin_result;

-- Simulation test for verification (uncomment to test with admin UUID)
/*
-- Simulate admin authentication
select set_config('request.jwt.claim.sub', 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- Test admin functions with simulated auth
SELECT '=== SIMULATED ADMIN TEST ===' as test_info;
SELECT 'is_admin() with simulated auth:' as info, public.is_admin() as is_admin_result;
SELECT 'admin_get_paid_totals test:' as info, * FROM public.admin_get_paid_totals() LIMIT 1;
*/
