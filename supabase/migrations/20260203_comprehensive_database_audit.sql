-- COMPREHENSIVE DATABASE AUDIT - OAuth & Security Complete Check
-- Purpose: Full audit of all database components affecting OAuth and security

-- ================================================================
-- 1. TABLES AUDIT - All user-related tables
-- ================================================================

RAISE NOTICE '=== TABLES AUDIT ===';

-- Check all tables that might affect OAuth
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
    AND (tablename LIKE '%user%' OR tablename LIKE '%profile%' OR tablename LIKE '%auth%' OR tablename LIKE '%invoice%')
ORDER BY tablename;

-- Check for any dangerous tables (should not exist)
SELECT 
    tablename,
    'DANGEROUS TABLE - SHOULD NOT EXIST' as status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'auth', 'auth_users')
ORDER BY tablename;

-- ================================================================
-- 2. COLUMNS AUDIT - Profiles table detailed check
-- ================================================================

RAISE NOTICE '=== PROFILES COLUMNS AUDIT ===';

SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable, 
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check for missing critical columns
DO $$
DECLARE
    missing_columns TEXT[];
BEGIN
    missing_columns := ARRAY[];
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
        missing_columns := array_append(missing_columns, 'user_id');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
        missing_columns := array_append(missing_columns, 'display_name');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        missing_columns := array_append(missing_columns, 'avatar_url');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'last_sign_in_at') THEN
        missing_columns := array_append(missing_columns, 'last_sign_in_at');
    END IF;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE NOTICE '❌ MISSING COLUMNS: %', array_to_string(missing_columns, ', ');
    ELSE
        RAISE NOTICE '✅ All required columns present';
    END IF;
END $$;

-- ================================================================
-- 3. RLS AUDIT - Row Level Security complete check
-- ================================================================

RAISE NOTICE '=== RLS AUDIT ===';

-- Check RLS status on all critical tables
DO $$
DECLARE
    table_record RECORD;
    rls_enabled BOOLEAN;
BEGIN
    FOR table_record IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('profiles', 'invoices', 'app_settings', 'stage_timers', 'price_cache', 'marketing_templates')
    LOOP
        SELECT relrowsecurity INTO rls_enabled 
        FROM pg_class 
        WHERE relname = table_record.tablename;
        
        IF rls_enabled THEN
            RAISE NOTICE '✅ %: RLS ENABLED', table_record.tablename;
        ELSE
            RAISE NOTICE '❌ %: RLS DISABLED - SECURITY RISK', table_record.tablename;
        END IF;
    END LOOP;
END $$;

-- Check all RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'HAS CONDITION'
        ELSE 'NO CONDITION'
    END as condition_status
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ================================================================
-- 4. CONSTRAINTS AUDIT - Foreign keys and unique constraints
-- ================================================================

RAISE NOTICE '=== CONSTRAINTS AUDIT ===';

-- Check foreign key constraints (critical for auth flow)
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name as foreign_table,
    ccu.column_name as foreign_column,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- Check for dangerous FK pointing to wrong tables
DO $$
DECLARE
    bad_fk_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO bad_fk_count
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND ccu.table_name = 'users';  -- Should NOT point to public.users
    
    IF bad_fk_count > 0 THEN
        RAISE NOTICE '❌ FOUND % FOREIGN KEYS POINTING TO public.users - DANGEROUS!', bad_fk_count;
    ELSE
        RAISE NOTICE '✅ No dangerous foreign keys found';
    END IF;
END $$;

-- ================================================================
-- 5. FUNCTIONS AUDIT - All RPC functions
-- ================================================================

RAISE NOTICE '=== FUNCTIONS AUDIT ===';

-- Check all functions in public schema
SELECT 
    proname as function_name,
    pronargs as arg_count,
    prokind as function_type,
    CASE 
        WHEN prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END as security_type,
    array_to_string(
        array(
            SELECT unnest(string_to_array(array_to_string(regexp_split_to_array(spgproc::text, ' '), ','), ' '))
            WHERE unnest ~ 'public'
        ), ', '
    ) as permissions
FROM pg_proc p
LEFT JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
    AND p.prokind = 'f'
ORDER BY proname;

-- Check critical auth functions specifically
DO $$
DECLARE
    function_exists BOOLEAN;
BEGIN
    -- Check upsert_profile_from_auth
    SELECT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'upsert_profile_from_auth' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) INTO function_exists;
    
    IF function_exists THEN
        RAISE NOTICE '✅ upsert_profile_from_auth exists';
        
        -- Check if it's SECURITY DEFINER
        IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'upsert_profile_from_auth' AND prosecdef = true) THEN
            RAISE NOTICE '✅ upsert_profile_from_auth is SECURITY DEFINER';
        ELSE
            RAISE NOTICE '❌ upsert_profile_from_auth is NOT SECURITY DEFINER';
        END IF;
    ELSE
        RAISE NOTICE '❌ upsert_profile_from_auth MISSING';
    END IF;
    
    -- Check is_admin function
    SELECT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'is_admin' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) INTO function_exists;
    
    IF function_exists THEN
        RAISE NOTICE '✅ is_admin exists';
    ELSE
        RAISE NOTICE '❌ is_admin MISSING';
    END IF;
    
    -- Check create_invoice_locked function
    SELECT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'create_invoice_locked' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) INTO function_exists;
    
    IF function_exists THEN
        RAISE NOTICE '✅ create_invoice_locked exists';
    ELSE
        RAISE NOTICE '❌ create_invoice_locked MISSING';
    END IF;
END $$;

-- ================================================================
-- 6. PERMISSIONS AUDIT - Who can access what
-- ================================================================

RAISE NOTICE '=== PERMISSIONS AUDIT ===';

-- Check table permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type,
    grantor,
    CASE 
        WHEN grantee = 'PUBLIC' THEN 'DANGEROUS - PUBLIC ACCESS'
        WHEN grantee = 'anon' THEN 'DANGEROUS - ANONYMOUS ACCESS'
        ELSE 'OK'
    END as security_level
FROM information_schema.role_table_grants 
WHERE table_schema = 'public'
    AND table_name IN ('profiles', 'invoices', 'app_settings', 'stage_timers')
ORDER BY 
    CASE 
        WHEN grantee = 'PUBLIC' THEN 1
        WHEN grantee = 'anon' THEN 2
        ELSE 3
    END,
    table_name, privilege_type;

-- Check function permissions
SELECT 
    routine_name,
    privilege_type,
    grantee,
    CASE 
        WHEN grantee = 'PUBLIC' THEN 'DANGEROUS'
        WHEN grantee = 'anon' THEN 'DANGEROUS'
        ELSE 'OK'
    END as security_level
FROM information_schema.routine_privileges 
WHERE routine_schema = 'public'
    AND routine_name IN ('upsert_profile_from_auth', 'is_admin', 'create_invoice_locked')
ORDER BY routine_name, security_level;

-- ================================================================
-- 7. INDEXES AUDIT - Performance and constraint indexes
-- ================================================================

RAISE NOTICE '=== INDEXES AUDIT ===';

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef,
    CASE 
        WHEN indexdef LIKE '%UNIQUE%' THEN 'UNIQUE INDEX'
        WHEN indexdef LIKE '%PRIMARY KEY%' THEN 'PRIMARY KEY'
        ELSE 'REGULAR INDEX'
    END as index_type
FROM pg_indexes 
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'invoices', 'app_settings', 'stage_timers')
ORDER BY tablename, indexname;

-- Check for missing critical indexes
DO $$
DECLARE
    missing_indexes TEXT[];
BEGIN
    missing_indexes := ARRAY[];
    
    -- Check profiles.user_id index
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'profiles' AND indexname LIKE '%user_id%') THEN
        missing_indexes := array_append(missing_indexes, 'profiles.user_id');
    END IF;
    
    -- Check profiles.member_code index
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'profiles' AND indexname LIKE '%member_code%') THEN
        missing_indexes := array_append(missing_indexes, 'profiles.member_code');
    END IF;
    
    -- Check invoices.user_id index
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'invoices' AND indexname LIKE '%user_id%') THEN
        missing_indexes := array_append(missing_indexes, 'invoices.user_id');
    END IF;
    
    IF array_length(missing_indexes, 1) > 0 THEN
        RAISE NOTICE '❌ MISSING INDEXES: %', array_to_string(missing_indexes, ', ');
    ELSE
        RAISE NOTICE '✅ All critical indexes present';
    END IF;
END $$;

-- ================================================================
-- 8. TRIGGERS AUDIT - Any triggers that might interfere
-- ================================================================

RAISE NOTICE '=== TRIGGERS AUDIT ===';

SELECT 
    event_object_schema,
    event_object_table,
    trigger_name,
    action_timing,
    action_condition,
    substring(action_statement, 1, 100) as action_preview,
    CASE 
        WHEN action_statement LIKE '%public.users%' THEN 'DANGEROUS - REFERENCES public.users'
        ELSE 'OK'
    END as safety_check
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ================================================================
-- 9. STORAGE AUDIT - Buckets and policies
-- ================================================================

RAISE NOTICE '=== STORAGE AUDIT ===';

DO $$
DECLARE
    bucket_record RECORD;
BEGIN
    FOR bucket_record IN 
        SELECT name, public, file_size_limit, allowed_mime_types
        FROM storage.buckets
    LOOP
        RAISE NOTICE 'Bucket: %, Public: %, Size Limit: %', 
            bucket_record.name, 
            bucket_record.public, 
            bucket_record.file_size_limit;
            
        -- Check bucket policies
        FOR policy_record IN 
            SELECT name, definition
            FROM storage.policies
            WHERE bucket_id = bucket_record.name
        LOOP
            RAISE NOTICE '  Policy: % - %', policy_record.name, substring(policy_record.definition, 1, 100);
        END LOOP;
    END LOOP;
END $$;

-- ================================================================
-- 10. DATA INTEGRITY AUDIT
-- ================================================================

RAISE NOTICE '=== DATA INTEGRITY AUDIT ===';

-- Check for orphaned records
DO $$
DECLARE
    orphan_count INTEGER;
BEGIN
    -- Check profiles without valid user_id
    SELECT COUNT(*) INTO orphan_count
    FROM public.profiles p
    LEFT JOIN auth.users u ON p.user_id = u.id
    WHERE u.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE '❌ FOUND % orphaned profiles (invalid user_id)', orphan_count;
    ELSE
        RAISE NOTICE '✅ No orphaned profiles found';
    END IF;
    
    -- Check invoices without valid user_id
    SELECT COUNT(*) INTO orphan_count
    FROM public.invoices i
    LEFT JOIN auth.users u ON i.user_id = u.id
    WHERE u.id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE NOTICE '❌ FOUND % orphaned invoices (invalid user_id)', orphan_count;
    ELSE
        RAISE NOTICE '✅ No orphaned invoices found';
    END IF;
END $$;

-- Check row counts
SELECT 
    'auth.users' as table_name,
    (SELECT COUNT(*) FROM auth.users) as row_count
UNION ALL
SELECT 
    'public.profiles' as table_name,
    (SELECT COUNT(*) FROM public.profiles) as row_count
UNION ALL
SELECT 
    'public.invoices' as table_name,
    (SELECT COUNT(*) FROM public.invoices) as row_count
ORDER BY table_name;

-- ================================================================
-- 11. SECURITY RISK ASSESSMENT
-- ================================================================

RAISE NOTICE '=== SECURITY RISK ASSESSMENT ===';

DO $$
DECLARE
    risk_count INTEGER := 0;
BEGIN
    -- Check for PUBLIC grants
    SELECT COUNT(*) INTO risk_count
    FROM information_schema.role_table_grants 
    WHERE grantee = 'PUBLIC' 
    AND table_schema = 'public';
    
    IF risk_count > 0 THEN
        RAISE NOTICE '❌ SECURITY RISK: Found % PUBLIC grants', risk_count;
    END IF;
    
    -- Check for anon grants
    SELECT COUNT(*) INTO risk_count
    FROM information_schema.role_table_grants 
    WHERE grantee = 'anon' 
    AND table_schema = 'public';
    
    IF risk_count > 0 THEN
        RAISE NOTICE '❌ SECURITY RISK: Found % anon grants', risk_count;
    END IF;
    
    -- Check for disabled RLS
    SELECT COUNT(*) INTO risk_count
    FROM pg_tables pt
    LEFT JOIN pg_class pc ON pc.relname = pt.tablename
    WHERE pt.schemaname = 'public' 
        AND pt.tablename IN ('profiles', 'invoices', 'app_settings', 'stage_timers')
        AND (pc.relrowsecurity IS NULL OR pc.relrowsecurity = false);
    
    IF risk_count > 0 THEN
        RAISE NOTICE '❌ SECURITY RISK: % tables have RLS disabled', risk_count;
    END IF;
    
    -- Check for dangerous functions
    SELECT COUNT(*) INTO risk_count
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
        AND p.prokind = 'f'
        AND prosecdef = false
        AND proname LIKE '%user%';
    
    IF risk_count > 0 THEN
        RAISE NOTICE '❌ SECURITY RISK: Found % user-related functions without SECURITY DEFINER', risk_count;
    END IF;
    
    IF risk_count = 0 THEN
        RAISE NOTICE '✅ NO CRITICAL SECURITY RISKS FOUND';
    END IF;
END $$;

-- ================================================================
-- FINAL SUMMARY
-- ================================================================

RAISE NOTICE '=== COMPREHENSIVE AUDIT COMPLETE ===';
RAISE NOTICE '1. Tables audit: Checked all user-related tables';
RAISE NOTICE '2. Columns audit: Verified all required columns';
RAISE NOTICE '3. RLS audit: Checked Row Level Security status';
RAISE NOTICE '4. Constraints audit: Verified foreign keys and constraints';
RAISE NOTICE '5. Functions audit: Checked all RPC functions';
RAISE NOTICE '6. Permissions audit: Checked table and function permissions';
RAISE NOTICE '7. Indexes audit: Verified performance indexes';
RAISE NOTICE '8. Triggers audit: Checked for interfering triggers';
RAISE NOTICE '9. Storage audit: Checked buckets and policies';
RAISE NOTICE '10. Data integrity audit: Checked for orphaned records';
RAISE NOTICE '11. Security risk assessment: Identified potential risks';
RAISE NOTICE '=====================================';
