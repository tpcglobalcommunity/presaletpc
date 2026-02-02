-- =====================================================
-- INSTALL ADMIN USERS FUNCTION
-- Copy and paste this script in Supabase SQL Editor
-- This will create the get_admin_users_data function
-- =====================================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_admin_users_data();

-- Create the function
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
        p.user_id AS id,
        p.email_current AS email, 
        p.email_initial AS full_name,
        'User' AS role_name,
        p.created_at
    FROM public.profiles p
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO anon;

-- Test the function
SELECT '=== ADMIN USERS FUNCTION INSTALLED ===' as status;
SELECT 'Testing get_admin_users_data:' as test;
SELECT * FROM get_admin_users_data() LIMIT 5;

-- Check table structure for verification
SELECT 'Table profiles structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '=== INSTALLATION SUCCESSFUL ===' as status, 'get_admin_users_data function is now ready!' as message;
