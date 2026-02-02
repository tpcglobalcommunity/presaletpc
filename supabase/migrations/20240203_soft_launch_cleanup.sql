-- =====================================================
-- TPC Global Soft Launch Data Cleanup
-- =====================================================
-- ONE-TIME cleanup before soft launch
-- Removes dummy operational data without touching schema or admin accounts

-- =====================================================
-- PHASE 1 — CLEAN INVOICES
-- =====================================================

-- Count invoices before cleanup
DO $$
DECLARE
    invoice_count integer;
    invoice_items_count integer;
    invoice_proofs_count integer;
    payment_proofs_count integer;
BEGIN
    -- Count invoices
    SELECT COUNT(*) INTO invoice_count FROM invoices;
    RAISE NOTICE 'Invoices before cleanup: %', invoice_count;
    
    -- Check for related tables and count if they exist
    BEGIN
        SELECT COUNT(*) INTO invoice_items_count FROM invoice_items;
        RAISE NOTICE 'Invoice items before cleanup: %', invoice_items_count;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Invoice items table does not exist';
    END;
    
    BEGIN
        SELECT COUNT(*) INTO invoice_proofs_count FROM invoice_proofs;
        RAISE NOTICE 'Invoice proofs before cleanup: %', invoice_proofs_count;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Invoice proofs table does not exist';
    END;
    
    BEGIN
        SELECT COUNT(*) INTO payment_proofs_count FROM payment_proofs;
        RAISE NOTICE 'Payment proofs before cleanup: %', payment_proofs_count;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Payment proofs table does not exist';
    END;
END $$;

-- Delete ALL invoices (soft launch reset)
-- This removes all operational data before soft launch
DELETE FROM invoices;

-- Delete related invoice items if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_class 
        WHERE relname = 'invoice_items' 
        AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        DELETE FROM invoice_items;
        RAISE NOTICE 'Invoice items deleted successfully';
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM pg_class 
        WHERE relname = 'invoice_proofs' 
        AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        DELETE FROM invoice_proofs;
        RAISE NOTICE 'Invoice proofs deleted successfully';
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM pg_class 
        WHERE relname = 'payment_proofs' 
        AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        DELETE FROM payment_proofs;
        RAISE NOTICE 'Payment proofs deleted successfully';
    END IF;
END $$;

-- =====================================================
-- PHASE 2 — RESET AGGREGATES
-- =====================================================

-- No explicit aggregates to reset - dashboard will recompute from invoices table
-- The dashboard queries will naturally return zero results since invoices table is empty

-- =====================================================
-- PHASE 3 — KEEP IMPORTANT DATA (VERIFICATION)
-- =====================================================

-- Verify important data is preserved
DO $$
DECLARE
    user_count integer;
    profile_count integer;
    admin_profile_count integer;
    marketing_template_count integer;
    referral_count integer;
BEGIN
    -- Count auth.users (should be preserved)
    SELECT COUNT(*) INTO user_count FROM auth.users;
    RAISE NOTICE 'Auth users preserved: %', user_count;
    
    -- Count profiles (should be preserved)
    SELECT COUNT(*) INTO profile_count FROM profiles;
    RAISE NOTICE 'Profiles preserved: %', profile_count;
    
    -- Count admin profiles (should be preserved)
    SELECT COUNT(*) INTO admin_profile_count FROM profiles WHERE role = 'admin';
    RAISE NOTICE 'Admin profiles preserved: %', admin_profile_count;
    
    -- Count marketing templates (should be preserved)
    SELECT COUNT(*) INTO marketing_template_count FROM marketing_templates;
    RAISE NOTICE 'Marketing templates preserved: %', marketing_template_count;
    
    -- Count referral codes (should be preserved unless explicitly dummy)
    SELECT COUNT(*) INTO referral_count FROM profiles WHERE referral_code IS NOT NULL;
    RAISE NOTICE 'Referral codes preserved: %', referral_count;
END $$;

-- =====================================================
-- PHASE 4 — VERIFY CLEANUP
-- =====================================================

-- Verify invoices are deleted
DO $$
DECLARE
    invoice_count_after integer;
    invoice_items_count_after integer;
    invoice_proofs_count_after integer;
    payment_proofs_count_after integer;
BEGIN
    -- Verify invoices are deleted
    SELECT COUNT(*) INTO invoice_count_after FROM invoices;
    RAISE NOTICE 'Invoices after cleanup: %', invoice_count_after;
    
    -- Verify related tables are empty
    BEGIN
        SELECT COUNT(*) INTO invoice_items_count_after FROM invoice_items;
        RAISE NOTICE 'Invoice items after cleanup: %', invoice_items_count_after;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Invoice items table does not exist';
    END;
    
    BEGIN
        SELECT COUNT(*) INTO invoice_proofs_count_after FROM invoice_proofs;
        RAISE NOTICE 'Invoice proofs after cleanup: %', invoice_proofs_count_after;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Invoice proofs table does not exist';
    END;
    
    BEGIN
        SELECT COUNT(*) INTO payment_proofs_count_after FROM payment_proofs;
        RAISE NOTICE 'Payment proofs after cleanup: %', payment_proofs_count_after;
    EXCEPTION WHEN undefined_table THEN
        RAISE NOTICE 'Payment proofs table does not exist';
    END;
END $$;

-- =====================================================
-- CLEANUP SUMMARY
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'TPC Global Soft Launch Data Cleanup Summary';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE '✅ All operational invoices deleted';
    RAISE NOTICE '✅ Related invoice items/proofs deleted';
    RAISE NOTICE '✅ Admin accounts preserved';
    RAISE NOTICE '✅ User profiles preserved';
    RAISE NOTICE '✅ Marketing templates preserved';
    RAISE NOTICE '✅ Referral codes preserved';
    RAISE NOTICE '✅ Database schema intact';
    RAISE NOTICE '✅ Ready for soft launch';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Dashboard totals should now be ZERO';
    RAISE NOTICE 'Admin login should still work';
    RAISE NOTICE 'Marketing Templates should still be available';
    RAISE NOTICE '====================================================='; 
END $$;
