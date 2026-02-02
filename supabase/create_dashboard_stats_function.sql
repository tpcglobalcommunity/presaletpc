-- Create RPC function for admin dashboard statistics
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
    WHERE member_code IS NOT NULL
    AND member_code != '';
    
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats_admin() TO anon;
