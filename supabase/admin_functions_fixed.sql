-- =====================================================
-- ADMIN FUNCTIONS FIXED VERSION
-- Copy and paste this script in Supabase SQL Editor
-- Memperbaiki fungsi admin dengan field yang benar
-- =====================================================

-- 1. BERSIHKAN FUNGSI LAMA
DROP FUNCTION IF EXISTS get_admin_users_data();
DROP FUNCTION IF EXISTS get_dashboard_stats_admin();

-- 2. PERBAIKI FUNGSI DATA USER (Hilangkan Ambiguitas)
CREATE OR REPLACE FUNCTION get_admin_users_data()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.user_id,        -- Menggunakan p. agar tidak ambiguous
        p.email_current, 
        p.email_initial AS full_name,  -- Menggunakan email_initial sebagai full_name
        'User' AS role_name, -- Default role karena tidak ada table user_roles
        p.created_at
    FROM public.profiles p;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. BUAT FUNGSI STATISTIK DASHBOARD
CREATE OR REPLACE FUNCTION get_dashboard_stats_admin()
RETURNS TABLE (
    total_users BIGINT,
    pending_review BIGINT,
    paid_invoices BIGINT,
    total_referrals BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM profiles),
        (SELECT COUNT(*) FROM invoices WHERE status = 'PENDING_REVIEW'),
        (SELECT COUNT(*) FROM invoices WHERE status = 'PAID'),
        (SELECT COUNT(*) FROM profiles WHERE referred_by IS NOT NULL AND referred_by != '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. GRANT PERMISSIONS
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO anon;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO anon;

-- 5. VERIFICATION
SELECT '=== ADMIN FUNCTIONS CREATED ===' as status;

-- Test get_admin_users_data function
SELECT 'Testing get_admin_users_data:' as test;
SELECT * FROM get_admin_users_data() LIMIT 3;

-- Test get_dashboard_stats_admin function  
SELECT 'Testing get_dashboard_stats_admin:' as test;
SELECT * FROM get_dashboard_stats_admin();

-- Check function permissions
SELECT 'Function permissions:' as info;
SELECT 
  proname,
  pronamespace,
  proargtypes,
  prorettype,
  proacl
FROM pg_proc 
WHERE proname IN ('get_admin_users_data', 'get_dashboard_stats_admin')
  AND pronamespace = 'public';

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Admin functions are now ready!' as message;
