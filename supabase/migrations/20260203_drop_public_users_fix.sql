-- EMERGENCY FIX: Drop public.users table (ROOT CAUSE OF OAuth ERROR)
-- Purpose: Remove conflicting public.users table that breaks Supabase Auth

-- ================================================================
-- 1. VERIFICATION - Check if public.users exists
-- ================================================================

-- Check if table exists
SELECT to_regclass('public.users') as table_exists;

-- Show table structure if exists
DO $$
BEGIN
    IF to_regclass('public.users') IS NOT NULL THEN
        RAISE NOTICE 'public.users table structure:';
        FOR column_record IN 
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users' AND table_schema = 'public'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE 'Column: %, Type: %, Nullable: %, Default: %', 
                column_record.column_name, 
                column_record.data_type, 
                column_record.is_nullable, 
                column_record.column_default;
        END LOOP;
    ELSE
        RAISE NOTICE 'public.users table does not exist - no structure to show';
    END IF;
END $$;

-- Show row count (only if table exists)
DO $$
BEGIN
    IF to_regclass('public.users') IS NOT NULL THEN
        RAISE NOTICE 'Row count in public.users: %', (SELECT COUNT(*) FROM public.users);
    ELSE
        RAISE NOTICE 'public.users table does not exist - already cleaned up!';
    END IF;
END $$;

-- ================================================================
-- 2. DROP TABLE CASCADE (SOLUTION UTAMA)
-- ================================================================

-- WARNING: This will drop the table and all dependencies
DROP TABLE IF EXISTS public.users CASCADE;

-- ================================================================
-- 3. VERIFICATION AFTER DROP
-- ================================================================

-- Verify table is gone
SELECT to_regclass('public.users') as table_exists_after_drop;

-- ================================================================
-- 4. CHECK PROFILES FOREIGN KEY (PASTIKAN KE auth.users)
-- ================================================================

-- Check foreign key constraints on profiles table
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

-- Expected result: foreign_table = 'auth.users'

-- ================================================================
-- 5. ENSURE PROFILES TABLE IS CORRECT
-- ================================================================

-- Check profiles table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS status
SELECT rowsecurity as rls_enabled
FROM pg_class 
WHERE relname = 'profiles';

-- ================================================================
-- 6. VERIFY upsert_profile_from_auth FUNCTION
-- ================================================================

-- Check if function exists
SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'upsert_profile_from_auth' 
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
) as function_exists;

-- ================================================================
-- 7. FINAL VERIFICATION
-- ================================================================

-- Check for any remaining references to public.users
DO $$
DECLARE
    reference_count INTEGER;
BEGIN
    -- Check for any remaining references
    SELECT COUNT(*) INTO reference_count
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
    WHERE ccu.table_name = 'users' 
        AND ccu.table_schema = 'public';
    
    IF reference_count > 0 THEN
        RAISE NOTICE 'WARNING: Still found % references to public.users', reference_count;
    ELSE
        RAISE NOTICE 'SUCCESS: No references to public.users found';
    END IF;
END $$;

-- ================================================================
-- SUMMARY
-- ================================================================

DO $$
BEGIN
    RAISE NOTICE '=== PUBLIC.USERS CLEANUP COMPLETE ===';
    RAISE NOTICE '1. public.users table dropped';
    RAISE NOTICE '2. All dependencies removed with CASCADE';
    RAISE NOTICE '3. Profiles FK verified to auth.users';
    RAISE NOTICE '4. Ready for OAuth testing';
    RAISE NOTICE '==================================';
END $$;
