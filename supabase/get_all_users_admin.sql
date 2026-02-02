-- Copy and paste this script in Supabase SQL Editor
-- This will create RPC function for admin users management

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_all_users_admin();

-- Create RPC function for getting all users with stats
CREATE FUNCTION get_all_users_admin()
RETURNS TABLE (
    id UUID,
    email_current TEXT,
    email_initial TEXT,
    member_code TEXT,
    referral_code TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    total_invoices BIGINT,
    paid_invoices BIGINT,
    unpaid_invoices BIGINT,
    total_revenue DECIMAL,
    referral_count BIGINT,
    last_invoice_date TIMESTAMPTZ,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return all users with their statistics
    RETURN QUERY
    SELECT 
        p.id,
        p.email_current,
        p.email_initial,
        p.member_code,
        p.referral_code,
        p.created_at,
        p.updated_at,
        COALESCE(inv_stats.total_invoices, 0) as total_invoices,
        COALESCE(inv_stats.paid_invoices, 0) as paid_invoices,
        COALESCE(inv_stats.unpaid_invoices, 0) as unpaid_invoices,
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
            COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount_input ELSE 0 END), 0) as total_revenue,
            MAX(created_at) as last_invoice_date
        FROM invoices
        GROUP BY user_id
    ) inv_stats ON p.id = inv_stats.user_id
    LEFT JOIN (
        SELECT 
            referral_code,
            COUNT(*) as referral_count
        FROM profiles
        WHERE referral_code IS NOT NULL 
        AND referral_code != ''
        GROUP BY referral_code
    ) ref_stats ON p.member_code = ref_stats.referral_code
    ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_users_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_users_admin() TO anon;

-- Test the function (optional)
-- SELECT * FROM get_all_users_admin() LIMIT 5;
