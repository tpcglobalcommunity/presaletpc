-- ==========================================
-- 1. BERSIHKAN FUNGSI LAMA (Mencegah Error 42P13)
-- ==========================================
DROP FUNCTION IF EXISTS get_dashboard_stats_admin();
DROP FUNCTION IF EXISTS get_admin_users_data();

-- ==========================================
-- 2. FUNGSI STATISTIK DASHBOARD ADMIN
-- Memperbaiki Error 400 Bad Request
-- ==========================================
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
        (SELECT COUNT(*) FROM public.profiles),
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PENDING_REVIEW'),
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PAID'),
        (SELECT COUNT(*) FROM public.profiles WHERE referred_by IS NOT NULL AND referred_by != '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. FUNGSI DAFTAR USER ADMIN
-- Memperbaiki Error 'column reference is ambiguous'
-- ==========================================
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
        p.user_id,         -- Menggunakan 'p.' untuk memperjelas (Fix Ambiguous)
        p.email_current, 
        p.email_initial AS full_name, -- Menggunakan email_initial karena full_name tidak ada
        'User' AS role_name, -- Default role karena user_roles table tidak ada
        p.created_at
    FROM public.profiles p
    -- LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id; -- Dikomentari karena table tidak ada
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. GRANT PERMISSIONS
-- ==========================================
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO anon;
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO anon;

-- ==========================================
-- 5. VERIFICATION
-- ==========================================
SELECT '=== ADMIN FUNCTIONS FINAL VERSION ===' as status;

-- Test get_dashboard_stats_admin function
SELECT 'Testing get_dashboard_stats_admin:' as test;
SELECT * FROM get_dashboard_stats_admin();

-- Test get_admin_users_data function
SELECT 'Testing get_admin_users_data:' as test;
SELECT * FROM get_admin_users_data() LIMIT 3;

-- Check table structures for verification
SELECT 'Table profiles structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Table invoices structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'invoices' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if user_roles table exists
SELECT 'user_roles table exists:' as info,
       CASE 
         WHEN EXISTS (
           SELECT 1 FROM information_schema.tables 
           WHERE table_name = 'user_roles' 
           AND table_schema = 'public'
         ) THEN 'YES' 
         ELSE 'NO' 
       END as result;

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Final admin functions are now ready!' as message;
