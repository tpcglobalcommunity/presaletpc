-- 1. Hapus fungsi lama yang bermasalah
DROP FUNCTION IF EXISTS get_admin_users_data();
DROP FUNCTION IF EXISTS get_dashboard_stats_admin();

-- 2. Buat fungsi daftar user yang benar (Fix Ambiguous Column)
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
        p.user_id,         -- Menggunakan awalan p. agar tidak bingung
        p.email_current, 
        p.email_initial AS full_name, -- Menggunakan email_initial karena full_name tidak ada
        'User' AS role_name, -- Default role karena user_roles table tidak ada
        p.created_at
    FROM public.profiles p
    -- LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id; -- Dikomentari karena table tidak ada
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Buat fungsi statistik untuk Dashboard
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
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PENDING_REVIEW'), -- Fixed status
        (SELECT COUNT(*) FROM public.invoices WHERE status = 'PAID'),
        (SELECT COUNT(*) FROM public.profiles WHERE referred_by IS NOT NULL AND referred_by != ''); -- Fixed field name
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO anon;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO anon;

-- 5. Verification
SELECT '=== ADMIN FUNCTIONS CORRECTED VERSION ===' as status;

-- Test functions
SELECT 'Testing get_admin_users_data:' as test;
SELECT * FROM get_admin_users_data() LIMIT 3;

SELECT 'Testing get_dashboard_stats_admin:' as test;
SELECT * FROM get_dashboard_stats_admin();

-- Check actual table structure
SELECT 'Actual profiles table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Actual invoices table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'invoices' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if user_roles exists
SELECT 'user_roles table exists:' as info,
       CASE 
         WHEN EXISTS (
           SELECT 1 FROM information_schema.tables 
           WHERE table_name = 'user_roles' 
           AND table_schema = 'public'
         ) THEN 'YES' 
         ELSE 'NO' 
       END as result;

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Corrected admin functions are now ready!' as message;
