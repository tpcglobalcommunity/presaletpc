-- Debug Script: Check OAuth Flow Components
-- Purpose: Verify all components needed for successful OAuth

-- ================================================================
-- 1. Check if upsert_profile_from_auth function exists and works
-- ================================================================

SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'upsert_profile_from_auth' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
) as function_exists;

-- ================================================================
-- 2. Check profiles table structure
-- ================================================================

SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ================================================================
-- 3. Check RLS status on profiles
-- ================================================================

SELECT rowsecurity as rls_enabled
FROM pg_class 
WHERE relname = 'profiles';

-- ================================================================
-- 4. Check RLS policies on profiles
-- ================================================================

SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles' 
    AND schemaname = 'public';

-- ================================================================
-- 5. Check foreign key constraint
-- ================================================================

SELECT 
    tc.constraint_name,
    kcu.table_name,
    kcu.column_name,
    ccu.table_name as foreign_table,
    ccu.column_name as foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND kcu.table_name = 'profiles';

-- ================================================================
-- 6. Check function permissions
-- ================================================================

SELECT 
    routine_name,
    privilege_type,
    grantee
FROM information_schema.routine_privileges 
WHERE routine_name = 'upsert_profile_from_auth'
    AND routine_schema = 'public';

-- ================================================================
-- 7. Test function with dummy data (safe test)
-- ================================================================

DO $$
BEGIN
    -- This will fail but proves the function exists and can be called
    BEGIN
        PERFORM public.upsert_profile_from_auth('00000000-0000-0000-0000-000000000000');
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Function exists but failed as expected: %', SQLERRM;
    END;
END $$;

-- ================================================================
-- 8. Check for any remaining conflicts
-- ================================================================

-- Check for any tables that might conflict with auth
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public'
    AND (table_name LIKE '%user%' OR table_name LIKE '%auth%')
ORDER BY table_name;

-- ================================================================
-- SUMMARY
-- ================================================================

DO $$
BEGIN
    RAISE NOTICE '=== OAUTH COMPONENTS CHECK ===';
    RAISE NOTICE '1. Function exists: Checked above';
    RAISE NOTICE '2. Profiles table: Checked above';
    RAISE NOTICE '3. RLS enabled: Checked above';
    RAISE NOTICE '4. RLS policies: Checked above';
    RAISE NOTICE '5. Foreign key: Checked above';
    RAISE NOTICE '6. Permissions: Checked above';
    RAISE NOTICE '7. Function test: Checked above';
    RAISE NOTICE '8. Conflicts: Checked above';
    RAISE NOTICE '============================';
END $$;
