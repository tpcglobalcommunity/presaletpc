-- =====================================================
-- ADMIN FUNCTIONS REVISED VERSION
-- Copy and paste this script in Supabase SQL Editor
-- Memperbaiki fungsi admin dengan field mapping yang benar
-- =====================================================

-- Hapus fungsi lama yang bermasalah
DROP FUNCTION IF EXISTS get_admin_users_data();
DROP FUNCTION IF EXISTS get_dashboard_stats_admin();

-- Buat ulang dengan identitas tabel yang jelas
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
        p.user_id AS id, -- Menggunakan awalan p. untuk mempertegas
        p.email_current AS email, 
        p.email_initial AS full_name, -- Menggunakan email_initial karena full_name tidak ada
        'User' AS role_name, -- Default role karena table user_roles tidak ada
        p.created_at
    FROM public.profiles p;
    -- LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id; -- Dikomentari karena table tidak ada
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Buat fungsi dashboard stats yang sederhana
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO anon;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO anon;

-- Verification
SELECT '=== ADMIN FUNCTIONS REVISED ===' as status;

-- Test get_admin_users_data function
SELECT 'Testing get_admin_users_data:' as test;
SELECT * FROM get_admin_users_data() LIMIT 3;

-- Test get_dashboard_stats_admin function  
SELECT 'Testing get_dashboard_stats_admin:' as test;
SELECT * FROM get_dashboard_stats_admin();

-- Check table structure untuk verifikasi
SELECT 'Table structure verification:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Revised admin functions are now ready!' as message;
