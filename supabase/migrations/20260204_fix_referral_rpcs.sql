-- Fix missing referral RPC functions for member referral page
-- These functions are SECURITY DEFINER and enforce auth.uid() access control

-- Function: get_referral_direct_stats
-- Returns direct referral statistics for the authenticated user
CREATE OR REPLACE FUNCTION public.get_referral_direct_stats()
RETURNS TABLE (
    direct_count bigint,
    active_count bigint,
    total_tpc_purchased numeric
) SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_user_member_code TEXT;
BEGIN
    -- Enforce authentication
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    
    -- Get current user's member code
    SELECT p.member_code INTO v_user_member_code
    FROM public.profiles p
    WHERE p.user_id = auth.uid();
    
    IF v_user_member_code IS NULL THEN
        RAISE EXCEPTION 'User profile not found';
    END IF;
    
    -- Return direct referral statistics
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT p.id)::bigint as direct_count,
        COUNT(DISTINCT CASE WHEN i.status = 'APPROVED' THEN p.id END)::bigint as active_count,
        COALESCE(SUM(CASE WHEN i.status = 'APPROVED' THEN i.tpc_amount ELSE 0 END), 0)::numeric as total_tpc_purchased
    FROM public.profiles p
    LEFT JOIN public.invoices i ON p.user_id = i.user_id AND i.status = 'APPROVED'
    WHERE p.referred_by = v_user_member_code;
END;
$$ LANGUAGE plpgsql;

-- Function: get_referral_tree_stats
-- Returns tree-level referral statistics for the authenticated user
CREATE OR REPLACE FUNCTION public.get_referral_tree_stats(p_max_level int DEFAULT 10)
RETURNS TABLE (
    total_downline bigint,
    total_active bigint,
    total_tpc_purchased numeric
) SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_user_member_code TEXT;
BEGIN
    -- Enforce authentication
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    
    -- Get current user's member code
    SELECT p.member_code INTO v_user_member_code
    FROM public.profiles p
    WHERE p.user_id = auth.uid();
    
    IF v_user_member_code IS NULL THEN
        RAISE EXCEPTION 'User profile not found';
    END IF;
    
    -- Return tree-level referral statistics using recursive CTE
    RETURN QUERY
    WITH RECURSIVE referral_tree AS (
        -- Base case: direct referrals
        SELECT 
            p.id,
            p.member_code,
            p.referred_by,
            1 as level
        FROM public.profiles p
        WHERE p.referred_by = v_user_member_code
        
        UNION ALL
        
        -- Recursive case: referrals of referrals
        SELECT 
            p.id,
            p.member_code,
            p.referred_by,
            rt.level + 1
        FROM public.profiles p
        INNER JOIN referral_tree rt ON p.referred_by = rt.member_code
        WHERE rt.level < p_max_level
    )
    SELECT 
        COUNT(DISTINCT rt.id)::bigint as total_downline,
        COUNT(DISTINCT CASE WHEN i.status = 'APPROVED' THEN rt.id END)::bigint as total_active,
        COALESCE(SUM(CASE WHEN i.status = 'APPROVED' THEN i.tpc_amount ELSE 0 END), 0)::numeric as total_tpc_purchased
    FROM referral_tree rt
    LEFT JOIN public.invoices i ON rt.id IN (
        SELECT p2.id FROM public.profiles p2 WHERE p2.user_id = i.user_id
    ) AND i.status = 'APPROVED';
END;
$$ LANGUAGE plpgsql;

-- Function: get_referral_direct_financial_stats
-- Returns financial statistics for direct referrals matching frontend expectations
CREATE OR REPLACE FUNCTION public.get_referral_direct_financial_stats()
RETURNS TABLE (
    direct_total_tpc_bought numeric,
    direct_total_commission_tpc numeric,
    total_withdrawn_tpc numeric,
    pending_withdrawn_tpc numeric
) SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_user_member_code TEXT;
    v_direct_tpc_bought numeric;
BEGIN
    -- Enforce authentication
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    
    -- Get current user's member code
    SELECT p.member_code INTO v_user_member_code
    FROM public.profiles p
    WHERE p.user_id = auth.uid();
    
    IF v_user_member_code IS NULL THEN
        RAISE EXCEPTION 'User profile not found';
    END IF;
    
    -- Calculate total TPC bought by direct referrals
    SELECT COALESCE(SUM(i.tpc_amount), 0) INTO v_direct_tpc_bought
    FROM public.profiles p
    INNER JOIN public.invoices i ON p.user_id = i.user_id
    WHERE p.referred_by = v_user_member_code
    AND i.status = 'APPROVED';
    
    -- Return financial statistics
    -- TODO: Implement commission and withdrawal tracking when those tables are available
    RETURN QUERY
    SELECT 
        v_direct_tpc_bought as direct_total_tpc_bought,
        0::numeric as direct_total_commission_tpc,  -- TODO: Calculate from commission table
        0::numeric as total_withdrawn_tpc,          -- TODO: Calculate from withdrawal table
        0::numeric as pending_withdrawn_tpc;        -- TODO: Calculate from withdrawal table
END;
$$ LANGUAGE plpgsql;

-- Function: get_referral_stats (overload for authenticated users)
-- Overload existing function to work without parameters for authenticated users
CREATE OR REPLACE FUNCTION public.get_referral_stats()
RETURNS TABLE (
    total_downline bigint,
    total_active bigint,
    total_levels bigint
) SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_user_member_code TEXT;
BEGIN
    -- Enforce authentication
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    
    -- Get current user's member code
    SELECT p.member_code INTO v_user_member_code
    FROM public.profiles p
    WHERE p.user_id = auth.uid();
    
    IF v_user_member_code IS NULL THEN
        RAISE EXCEPTION 'User profile not found';
    END IF;
    
    -- Use the existing get_referral_stats function with the user's member code
    RETURN QUERY
    SELECT 
        total_referrals::bigint as total_downline,
        active_referrals::bigint as total_active,
        total_levels::bigint
    FROM public.get_referral_stats(v_user_member_code);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_referral_direct_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_tree_stats(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_direct_financial_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_stats() TO authenticated;
