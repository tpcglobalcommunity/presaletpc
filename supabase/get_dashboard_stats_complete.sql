-- =====================================================
-- COMPLETE DASHBOARD STATS FUNCTION FOR ANALYTICS
-- Copy and paste this script in Supabase SQL Editor
-- This function returns all statistics needed for analytics dashboard
-- =====================================================

-- Drop existing function
DROP FUNCTION IF EXISTS get_dashboard_stats_admin();

-- Create complete function
CREATE OR REPLACE FUNCTION get_dashboard_stats_admin()
RETURNS TABLE (
    total_users BIGINT,
    total_invoices BIGINT,
    unpaid_invoices BIGINT,
    paid_invoices BIGINT,
    pending_review_invoices BIGINT,
    total_referrals BIGINT,
    new_users_this_month BIGINT,
    new_invoices_this_month BIGINT,
    total_revenue DECIMAL,
    active_users BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.profiles),
        (SELECT COUNT(*) FROM public.invoices),
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'UNPAID'),
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PAID'),
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PENDING_REVIEW'),
        (SELECT COUNT(*) FROM public.profiles WHERE referred_by IS NOT NULL AND referred_by != ''),
        (SELECT COUNT(*) FROM public.profiles 
         WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)),
        (SELECT COUNT(*) FROM public.invoices 
         WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)),
        (SELECT COALESCE(SUM(amount_input), 0) FROM public.invoices WHERE status = 'PAID'),
        (SELECT COUNT(DISTINCT user_id) FROM public.invoices WHERE user_id IS NOT NULL);
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO anon;

-- Test the function
SELECT '=== COMPLETE DASHBOARD STATS FUNCTION CREATED ===' as status;
SELECT * FROM get_dashboard_stats_admin();

-- Check table structures
SELECT '=== TABLE STRUCTURES ===' as info;
SELECT 'profiles table fields:' as table_name,
       array_agg(column_name ORDER BY ordinal_position) as fields
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
GROUP BY table_name

UNION ALL

SELECT 'invoices table fields:' as table_name,
       array_agg(column_name ORDER BY ordinal_position) as fields
FROM information_schema.columns 
WHERE table_name = 'invoices' 
  AND table_schema = 'public'
GROUP BY table_name;

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Complete dashboard stats function is ready!' as message;
