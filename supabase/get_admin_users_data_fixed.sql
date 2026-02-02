-- =====================================================
-- FIXED VERSION OF get_admin_users_data FUNCTION
-- Sesuaikan dengan struktur table yang benar
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_admin_users_data();

-- Create corrected function
CREATE OR REPLACE FUNCTION get_admin_users_data()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    member_code TEXT,
    referred_by TEXT,
    role_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    total_invoices BIGINT,
    paid_invoices BIGINT,
    total_revenue DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return users data with statistics
    RETURN QUERY
    SELECT 
        p.user_id AS id,
        p.email_current AS email,
        p.email_initial AS full_name, -- Menggunakan email_initial sebagai full_name
        p.member_code,
        p.referred_by, -- Menggunakan referred_by bukan referral_code
        'User' AS role_name, -- Default role karena tidak ada table user_roles
        p.created_at,
        COALESCE(inv_stats.total_invoices, 0) as total_invoices,
        COALESCE(inv_stats.paid_invoices, 0) as paid_invoices,
        COALESCE(inv_stats.total_revenue, 0) as total_revenue
    FROM public.profiles p
    LEFT JOIN (
        SELECT 
            user_id,
            COUNT(*) as total_invoices,
            COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paid_invoices,
            COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount_input ELSE 0 END), 0) as total_revenue
        FROM public.invoices
        GROUP BY user_id
    ) inv_stats ON p.user_id = inv_stats.user_id
    ORDER BY p.created_at DESC;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO anon;

-- Test the function
SELECT * FROM get_admin_users_data() LIMIT 5;
