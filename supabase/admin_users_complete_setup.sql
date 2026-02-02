-- =====================================================
-- COMPLETE SQL SETUP FOR ADMIN USERS PAGE
-- Copy and paste this entire script in Supabase SQL Editor
-- =====================================================

-- 1. DROP EXISTING FUNCTIONS (to avoid conflicts)
DROP FUNCTION IF EXISTS get_all_users_admin();
DROP FUNCTION IF EXISTS get_dashboard_stats_admin();

-- 2. CREATE RPC FUNCTION FOR ADMIN USERS
CREATE FUNCTION get_all_users_admin()
RETURNS TABLE (
    id UUID,
    email_current TEXT,
    email_initial TEXT,
    member_code TEXT,
    referred_by TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    total_invoices BIGINT,
    paid_invoices BIGINT,
    unpaid_invoices BIGINT,
    pending_review_invoices BIGINT,
    total_revenue DECIMAL,
    referral_count BIGINT,
    last_invoice_date TIMESTAMPTZ,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return all users with their complete statistics
    RETURN QUERY
    SELECT 
        p.id,
        p.email_current,
        p.email_initial,
        p.member_code,
        p.referred_by,
        p.created_at,
        p.created_at as updated_at, -- Using created_at since updated_at doesn't exist
        COALESCE(inv_stats.total_invoices, 0) as total_invoices,
        COALESCE(inv_stats.paid_invoices, 0) as paid_invoices,
        COALESCE(inv_stats.unpaid_invoices, 0) as unpaid_invoices,
        COALESCE(inv_stats.pending_review_invoices, 0) as pending_review_invoices,
        COALESCE(inv_stats.total_revenue, 0) as total_revenue,
        COALESCE(ref_stats.referral_count, 0) as referral_count,
        inv_stats.last_invoice_date,
        CASE 
            WHEN inv_stats.total_invoices > 0 THEN 'Active'
            WHEN p.created_at > NOW() - INTERVAL '7 days' THEN 'New'
            ELSE 'Inactive'
        END as status
    FROM profiles p
    LEFT JOIN (
        SELECT 
            user_id,
            COUNT(*) as total_invoices,
            COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paid_invoices,
            COUNT(CASE WHEN status = 'UNPAID' THEN 1 END) as unpaid_invoices,
            COUNT(CASE WHEN status = 'PENDING_REVIEW' THEN 1 END) as pending_review_invoices,
            COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount_input ELSE 0 END), 0) as total_revenue,
            MAX(created_at) as last_invoice_date
        FROM invoices
        GROUP BY user_id
    ) inv_stats ON p.user_id = inv_stats.user_id
    LEFT JOIN (
        SELECT 
            member_code,
            COUNT(*) as referral_count
        FROM profiles
        WHERE member_code IS NOT NULL 
        AND member_code != ''
        GROUP BY member_code
    ) ref_stats ON p.member_code = ref_stats.member_code
    ORDER BY p.created_at DESC;
END;
$$;

-- 3. CREATE RPC FUNCTION FOR DASHBOARD STATS
CREATE FUNCTION get_dashboard_stats_admin()
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
    -- Get total users count
    SELECT COUNT(*) INTO total_users
    FROM profiles;
    
    -- Get total invoices count
    SELECT COUNT(*) INTO total_invoices
    FROM invoices;
    
    -- Get unpaid invoices count
    SELECT COUNT(*) INTO unpaid_invoices
    FROM invoices
    WHERE status = 'UNPAID';
    
    -- Get paid invoices count
    SELECT COUNT(*) INTO paid_invoices
    FROM invoices
    WHERE status = 'PAID';
    
    -- Get pending review invoices count
    SELECT COUNT(*) INTO pending_review_invoices
    FROM invoices
    WHERE status = 'PENDING_REVIEW';
    
    -- Get total referrals count
    SELECT COUNT(*) INTO total_referrals
    FROM profiles
    WHERE referral_code IS NOT NULL
    AND referral_code != '';
    
    -- Get new users this month
    SELECT COUNT(*) INTO new_users_this_month
    FROM profiles
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
    
    -- Get new invoices this month
    SELECT COUNT(*) INTO new_invoices_this_month
    FROM invoices
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
    
    -- Calculate total revenue (sum of paid invoices)
    SELECT COALESCE(SUM(amount_input), 0) INTO total_revenue
    FROM invoices
    WHERE status = 'PAID';
    
    -- Get active users (users with at least one invoice)
    SELECT COUNT(DISTINCT user_id) INTO active_users
    FROM invoices;
    
    -- Return the results
    RETURN QUERY SELECT 
        total_users,
        total_invoices,
        unpaid_invoices,
        paid_invoices,
        pending_review_invoices,
        total_referrals,
        new_users_this_month,
        new_invoices_this_month,
        total_revenue,
        active_users;
END;
$$;

-- 4. GRANT EXECUTE PERMISSIONS
GRANT EXECUTE ON FUNCTION get_all_users_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_users_admin() TO anon;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO anon;

-- 5. CLEAN EXISTING DATA (optional - uncomment if you want to clean first)
-- DELETE FROM invoices WHERE email LIKE '%@example.com';
-- DELETE FROM profiles WHERE email LIKE '%@example.com';

-- 6. INSERT SAMPLE USERS
INSERT INTO profiles (id, user_id, email_current, email_initial, member_code, referred_by, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'john.doe@example.com', 'TPC001', NULL, NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'jane.smith@example.com', 'TPC002', 'TPC001', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'mike.wilson@example.com', 'mike.wilson@example.com', 'TPC003', 'TPC002', NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'sarah.johnson@example.com', 'sarah.johnson@example.com', 'TPC004', 'TPC003', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'david.brown@example.com', 'david.brown@example.com', 'TPC005', 'TPC001', NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'emily.davis@example.com', 'emily.davis@example.com', 'TPC006', 'TPC004', NOW() - INTERVAL '8 days'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'chris.miller@example.com', 'chris.miller@example.com', 'TPC007', 'TPC002', NOW() - INTERVAL '6 days'),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 'lisa.garcia@example.com', 'lisa.garcia@example.com', 'TPC008', 'TPC005', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', 'robert.martinez@example.com', 'robert.martinez@example.com', 'TPC009', 'TPC003', NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', 'jennifer.anderson@example.com', 'jennifer.anderson@example.com', 'TPC010', 'TPC006', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', 'william.taylor@example.com', 'william.taylor@example.com', 'TPC011', 'TPC007', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 'mary.thomas@example.com', 'mary.thomas@example.com', 'TPC012', 'TPC008', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', 'james.jackson@example.com', 'james.jackson@example.com', 'TPC013', 'TPC009', NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440014', 'patricia.white@example.com', 'patricia.white@example.com', 'TPC014', 'TPC010', NOW() - INTERVAL '6 hours'),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440015', 'richard.harris@example.com', 'richard.harris@example.com', 'TPC015', 'TPC011', NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;

-- 7. INSERT SAMPLE INVOICES
INSERT INTO invoices (
    id, invoice_no, email, user_id, base_currency, amount_input, tpc_amount, 
    status, created_at, expires_at, updated_at
) VALUES
-- Paid invoices
(gen_random_uuid(), 'TPC-2024-0001', 'john.doe@example.com', '550e8400-e29b-41d4-a716-446655440001', 'IDR', 1700000, 1700000, 'PAID', NOW() - INTERVAL '25 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
(gen_random_uuid(), 'TPC-2024-0002', 'jane.smith@example.com', '550e8400-e29b-41d4-a716-446655440002', 'IDR', 3400000, 3400000, 'PAID', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(gen_random_uuid(), 'TPC-2024-0003', 'mike.wilson@example.com', '550e8400-e29b-41d4-a716-446655440003', 'IDR', 1700000, 1700000, 'PAID', NOW() - INTERVAL '18 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
(gen_random_uuid(), 'TPC-2024-0004', 'sarah.johnson@example.com', '550e8400-e29b-41d4-a716-446655440004', 'IDR', 5100000, 5100000, 'PAID', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(gen_random_uuid(), 'TPC-2024-0005', 'david.brown@example.com', '550e8400-e29b-41d4-a716-446655440005', 'IDR', 1700000, 1700000, 'PAID', NOW() - INTERVAL '12 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(gen_random_uuid(), 'TPC-2024-0006', 'emily.davis@example.com', '550e8400-e29b-41d4-a716-446655440006', 'IDR', 3400000, 3400000, 'PAID', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(gen_random_uuid(), 'TPC-2024-0007', 'chris.miller@example.com', '550e8400-e29b-41d4-a716-446655440007', 'IDR', 1700000, 1700000, 'PAID', NOW() - INTERVAL '8 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(gen_random_uuid(), 'TPC-2024-0008', 'lisa.garcia@example.com', '550e8400-e29b-41d4-a716-446655440008', 'IDR', 6800000, 6800000, 'PAID', NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Unpaid invoices
(gen_random_uuid(), 'TPC-2024-0009', 'robert.martinez@example.com', '550e8400-e29b-41d4-a716-446655440009', 'IDR', 1700000, 1700000, 'UNPAID', NOW() - INTERVAL '4 days', NOW() + INTERVAL '2 days', NOW()),
(gen_random_uuid(), 'TPC-2024-0010', 'jennifer.anderson@example.com', '550e8400-e29b-41d4-a716-446655440010', 'IDR', 3400000, 3400000, 'UNPAID', NOW() - INTERVAL '3 days', NOW() + INTERVAL '3 days', NOW()),
(gen_random_uuid(), 'TPC-2024-0011', 'william.taylor@example.com', '550e8400-e29b-41d4-a716-446655440011', 'IDR', 1700000, 1700000, 'UNPAID', NOW() - INTERVAL '2 days', NOW() + INTERVAL '4 days', NOW()),
(gen_random_uuid(), 'TPC-2024-0012', 'mary.thomas@example.com', '550e8400-e29b-41d4-a716-446655440012', 'IDR', 5100000, 5100000, 'UNPAID', NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 days', NOW()),

-- Pending review invoices
(gen_random_uuid(), 'TPC-2024-0013', 'james.jackson@example.com', '550e8400-e29b-41d4-a716-446655440013', 'IDR', 1700000, 1700000, 'PENDING_REVIEW', NOW() - INTERVAL '12 hours', NOW() + INTERVAL '6 days', NOW() - INTERVAL '6 hours'),
(gen_random_uuid(), 'TPC-2024-0014', 'patricia.white@example.com', '550e8400-e29b-41d4-a716-446655440014', 'IDR', 3400000, 3400000, 'PENDING_REVIEW', NOW() - INTERVAL '6 hours', NOW() + INTERVAL '5 days', NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), 'TPC-2024-0015', 'richard.harris@example.com', '550e8400-e29b-41d4-a716-446655440015', 'IDR', 1700000, 1700000, 'PENDING_REVIEW', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '6 days', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- 8. CREATE REFERRAL RELATIONSHIPS (already done in INSERT above)
-- The referred_by field is already set in the INSERT statements above

-- 9. VERIFICATION QUERIES
SELECT '=== SETUP COMPLETED ===' as status;
SELECT 'Users Created:' as info, COUNT(*) as count FROM profiles WHERE email LIKE '%@example.com';
SELECT 'Invoices Created:' as info, COUNT(*) as count FROM invoices WHERE email LIKE '%@example.com';
SELECT 'Referral Relationships:' as info, COUNT(*) as count FROM profiles WHERE referred_by IS NOT NULL AND referred_by != '';

-- 10. TEST FUNCTIONS
SELECT '=== TESTING FUNCTIONS ===' as status;
SELECT 'Dashboard Stats Test:' as info, * FROM get_dashboard_stats_admin() LIMIT 1;
SELECT 'Users Function Test (First 3):' as info, id, email_current, member_code, total_invoices, paid_invoices, status FROM get_all_users_admin() LIMIT 3;

-- 11. SAMPLE DATA FOR VERIFICATION
SELECT '=== SAMPLE DATA PREVIEW ===' as status;
SELECT 
    p.member_code,
    p.email_current,
    p.referral_code,
    inv.total_invoices,
    inv.paid_invoices,
    inv.unpaid_invoices,
    inv.total_revenue
FROM profiles p
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_invoices,
        COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paid_invoices,
        COUNT(CASE WHEN status = 'UNPAID' THEN 1 END) as unpaid_invoices,
        COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount_input ELSE 0 END), 0) as total_revenue
    FROM invoices
    GROUP BY user_id
) inv ON p.id = inv.user_id
WHERE p.email LIKE '%@example.com'
ORDER BY p.created_at DESC
LIMIT 5;

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Admin Users page is now ready!' as message;
