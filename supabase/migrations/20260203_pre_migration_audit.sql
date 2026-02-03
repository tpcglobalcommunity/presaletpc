-- Script: Database Security Audit - PRE-MIGRATION CHECK
-- Purpose: Check current security state before applying production fixes

-- ================================================================
-- 1. CHECK RLS STATUS ON ALL TABLES
-- ================================================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables pt
LEFT JOIN pg_class pc ON pc.relname = pt.tablename
WHERE pt.schemaname = 'public' 
    AND pt.tablename NOT LIKE 'pg_%'
ORDER BY tablename;

-- ================================================================
-- 2. CHECK CURRENT RLS POLICIES
-- ================================================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ================================================================
-- 3. CHECK DANGEROUS GRANTS TO PUBLIC
-- ================================================================

SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type,
    grantor
FROM information_schema.role_table_grants 
WHERE grantee = 'PUBLIC' 
    OR grantee = 'PUBLIC'
ORDER BY table_schema, table_name, privilege_type;

-- ================================================================
-- 4. CHECK FUNCTION PERMISSIONS
-- ================================================================

SELECT 
    proname as function_name,
    pronargs as arg_count,
    proargtypes as arg_types,
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

-- ================================================================
-- 5. CHECK STORAGE BUCKETS AND POLICIES
-- ================================================================

SELECT 
    name as bucket_name,
    public as is_public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
ORDER BY name;

-- ================================================================
-- 6. CHECK INDEXES ON CRITICAL TABLES
-- ================================================================

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'invoices', 'app_settings', 'stage_timers')
ORDER BY tablename, indexname;

-- ================================================================
-- 7. CHECK CONSTRAINTS
-- ================================================================

SELECT 
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
    AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'CHECK')
ORDER BY tc.table_name, tc.constraint_type;

-- ================================================================
-- 8. CHECK TRIGGERS
-- ================================================================

SELECT 
    event_object_schema,
    event_object_table,
    trigger_name,
    action_timing,
    action_condition,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ================================================================
-- 9. CHECK ROW COUNTS (for data validation)
-- ================================================================

SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ================================================================
-- 10. CHECK AUTH USERS vs PROFILES SYNC
-- ================================================================

SELECT 
    (SELECT COUNT(*) FROM auth.users) as auth_users_count,
    (SELECT COUNT(*) FROM public.profiles) as profiles_count,
    (SELECT COUNT(*) FROM public.profiles WHERE user_id IS NOT NULL) as profiles_with_user_id,
    (SELECT COUNT(*) FROM public.invoices) as invoices_count;

-- ================================================================
-- 11. CHECK FOR ANY DISABLED RLS TABLES (SECURITY RISK)
-- ================================================================

SELECT 
    tablename,
    'RLS DISABLED - SECURITY RISK' as status
FROM pg_tables pt
LEFT JOIN pg_class pc ON pc.relname = pt.tablename
WHERE pt.schemaname = 'public' 
    AND pt.tablename NOT LIKE 'pg_%'
    AND (pc.rowsecurity IS NULL OR pc.rowsecurity = false)
    AND pt.tablename IN ('profiles', 'invoices', 'app_settings', 'stage_timers', 'price_cache', 'marketing_templates');

-- ================================================================
-- 12. CHECK FOR ANY TABLES WITH PUBLIC GRANTS (SECURITY RISK)
-- ================================================================

SELECT 
    table_schema,
    table_name,
    privilege_type,
    grantee,
    'PUBLIC GRANT - SECURITY RISK' as status
FROM information_schema.role_table_grants 
WHERE (grantee = 'PUBLIC' OR grantee = 'PUBLIC')
    AND table_schema = 'public'
    AND table_name IN ('profiles', 'invoices', 'app_settings', 'stage_timers', 'price_cache', 'marketing_templates')
ORDER BY table_name, privilege_type;

-- ================================================================
-- AUDIT SUMMARY
-- ================================================================

-- Run this script in Supabase SQL Editor to get current security state
-- Then run the production migration to fix any issues found
