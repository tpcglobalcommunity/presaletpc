-- Referral Network Function
CREATE OR REPLACE FUNCTION public.get_referral_network(
    target_member_code TEXT,
    max_depth INTEGER DEFAULT 10
)
RETURNS TABLE (
    level INTEGER,
    member_code TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    referred_by TEXT
) AS $$
DECLARE
    current_depth INTEGER := 0;
    processed_codes TEXT[] := ARRAY[target_member_code];
BEGIN
    -- Create temporary table for results
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_referral_network (
        level INTEGER,
        member_code TEXT,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE,
        referred_by TEXT
    );
    
    -- Clear temporary table
    TRUNCATE TABLE temp_referral_network;
    
    -- Insert root member (level 0)
    INSERT INTO temp_referral_network (level, member_code, email, created_at, referred_by)
    SELECT 
        0,
        p.member_code,
        p.email_current,
        p.created_at,
        p.referred_by
    FROM public.profiles p
    WHERE p.member_code = target_member_code;
    
    -- Recursive CTE to get referral network
    WITH RECURSIVE referral_tree AS (
        -- Base case: direct referrals
        SELECT 
            1 as level,
            p.member_code,
            p.email_current as email,
            p.created_at,
            p.referred_by
        FROM public.profiles p
        WHERE p.referred_by = target_member_code
        
        UNION ALL
        
        -- Recursive case: referrals of referrals
        SELECT 
            rt.level + 1,
            p.member_code,
            p.email_current as email,
            p.created_at,
            p.referred_by
        FROM public.profiles p
        INNER JOIN referral_tree rt ON p.referred_by = rt.member_code
        WHERE rt.level < max_depth
        AND p.member_code NOT IN (SELECT unnest(processed_codes))
    )
    INSERT INTO temp_referral_network
    SELECT * FROM referral_tree;
    
    -- Return results
    RETURN QUERY
    SELECT * FROM temp_referral_network
    ORDER BY level, created_at;
    
    -- Clean up
    DROP TABLE IF EXISTS temp_referral_network;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = '518694f6-bb50-4724-b4a5-77ad30152e0e';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get referral statistics
CREATE OR REPLACE FUNCTION public.get_referral_stats(member_code TEXT)
RETURNS TABLE (
    total_referrals INTEGER,
    active_referrals INTEGER,
    total_levels INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE referral_tree AS (
        SELECT 
            p.member_code,
            p.created_at,
            1 as level
        FROM public.profiles p
        WHERE p.referred_by = member_code
        
        UNION ALL
        
        SELECT 
            p.member_code,
            p.created_at,
            rt.level + 1
        FROM public.profiles p
        INNER JOIN referral_tree rt ON p.referred_by = rt.member_code
        WHERE rt.level < 10
    )
    SELECT 
        COUNT(*) as total_referrals,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as active_referrals,
        MAX(level) as total_levels
    FROM referral_tree;
END;
$$ LANGUAGE plpgsql;
