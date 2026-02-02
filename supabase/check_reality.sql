-- =====================================================
-- CHECK DATABASE REALITY FOR ADMIN USERS PAGE
-- Copy and paste this script in Supabase SQL Editor
-- This will verify what actually exists in the database
-- =====================================================

-- 1. Check if profiles table exists and its structure
SELECT '=== PROFILES TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check sample data in profiles table
SELECT '=== SAMPLE PROFILES DATA ===' as info;
SELECT 
    id,
    user_id,
    email_current,
    email_initial,
    member_code,
    referred_by,
    created_at
FROM public.profiles 
LIMIT 5;

-- 3. Check if get_admin_users_data function exists
SELECT '=== FUNCTION EXISTENCE CHECK ===' as info;
SELECT 
    proname,
    pronamespace,
    proargtypes,
    prorettype,
    prosrc
FROM pg_proc 
WHERE proname = 'get_admin_users_data'
  AND pronamespace = 'public';

-- 4. Test the function if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'get_admin_users_data' 
        AND pronamespace = 'public'
    ) THEN
        RAISE NOTICE '=== TESTING get_admin_users_data FUNCTION ===';
        PERFORM * FROM get_admin_users_data() LIMIT 3;
    ELSE
        RAISE NOTICE '=== FUNCTION get_admin_users_data DOES NOT EXIST ===';
    END IF;
END $$;

-- 5. Check what fields are actually available
SELECT '=== AVAILABLE FIELDS ANALYSIS ===' as info;
SELECT 
    'Available fields in profiles table:' as analysis,
    array_agg(column_name ORDER BY ordinal_position) as fields
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public';

-- 6. Create the correct function based on reality
SELECT '=== CREATING CORRECT FUNCTION BASED ON REALITY ===' as info;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_admin_users_data();

-- Create function that matches actual database structure
CREATE OR REPLACE FUNCTION get_admin_users_data()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    member_code TEXT,
    referred_by TEXT,
    role_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.user_id AS id,
        p.email_current AS email, 
        p.email_initial AS full_name,
        p.member_code,
        p.referred_by,
        'User' AS role_name,
        p.created_at
    FROM public.profiles p
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_users_data() TO anon;

-- 7. Test the corrected function
SELECT '=== TESTING CORRECTED FUNCTION ===' as info;
SELECT * FROM get_admin_users_data() LIMIT 3;

-- 8. Count total records
SELECT '=== DATA COUNT ===' as info;
SELECT 
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) FROM public.profiles WHERE email_current IS NOT NULL) as with_email,
    (SELECT COUNT(*) FROM public.profiles WHERE member_code IS NOT NULL) as with_member_code;

SELECT '=== REALITY CHECK COMPLETE ===' as status, 'Database structure verified and function corrected!' as message;
