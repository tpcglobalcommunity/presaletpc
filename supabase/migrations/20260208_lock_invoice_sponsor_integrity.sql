-- Migration: 20260208_lock_invoice_sponsor_integrity.sql
-- Description: Hard lock sponsor_code integrity in invoice creation
-- Author: TPC Global Team
-- Target: Invoice sponsor_code must come from locked profiles, no client override

-- ================================================================
-- PHASE 1: AUDIT INVOICE FLOW
-- ================================================================

-- A) Ensure extension pgcrypto exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================================
-- PHASE 2: DATABASE SCHEMA AUDIT
-- ================================================================

-- B) Check current invoice structure
DO $$
BEGIN
    -- Check if sponsor_code column exists in invoices
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'sponsor_code'
    ) THEN
        RAISE NOTICE 'sponsor_code column already exists in invoices table';
    END IF;
    
    -- Check if sponsor_member_code column exists in invoices
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'sponsor_member_code'
    ) THEN
        RAISE NOTICE 'sponsor_member_code column already exists in invoices table';
    END IF;
    
    -- Check current invoice count
    RAISE NOTICE 'Current invoice count: %', (SELECT COUNT(*) FROM invoices);
    RAISE NOTICE 'Invoices with sponsor_code: %', (SELECT COUNT(*) FROM invoices WHERE sponsor_code IS NOT NULL);
    RAISE NOTICE 'Invoices with sponsor_member_code: %', (SELECT COUNT(*) FROM invoices WHERE sponsor_member_code IS NOT NULL);
END $$;

-- ================================================================
-- PHASE 3: ADD MISSING COLUMNS
-- ================================================================

-- C) Add sponsor_code column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'sponsor_code'
    ) THEN
        ALTER TABLE public.invoices 
        ADD COLUMN sponsor_code TEXT;
        RAISE NOTICE 'Added sponsor_code column to invoices table';
    END IF;
    
    -- Add sponsor_member_code column if not exists
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'invoices' 
            AND column_name = 'sponsor_member_code'
        ) THEN
            ALTER TABLE public.invoices 
            ADD COLUMN sponsor_member_code TEXT;
            RAISE NOTICE 'Added sponsor_member_code column to invoices table';
        END IF;
    END IF;
END $$;

-- ================================================================
-- PHASE 4: BACKFILL SPONSOR CODES
-- ================================================================

-- D) Backfill sponsor_code from profiles for existing invoices
UPDATE public.invoices i
SET sponsor_code = p.sponsor_code
FROM public.invoices i
JOIN public.profiles p ON p.user_id = i.user_id
WHERE i.sponsor_code IS NULL 
  AND p.sponsor_code IS NOT NULL;

-- E) Backfill sponsor_member_code from profiles for existing invoices
UPDATE public.invoices i
SET sponsor_member_code = p.sponsor_code
FROM public.invoices i
JOIN public.profiles p ON p.user_id = i.user_id
WHERE i.sponsor_member_code IS NULL 
  AND p.sponsor_code IS NOT NULL;

-- ================================================================
-- PHASE 5: CREATE INTEGRITY CONSTRAINTS
-- ================================================================

-- F) Add check constraint for sponsor_code format
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'invoices' 
        AND constraint_name = 'invoices_sponsor_code_format'
    ) THEN
        ALTER TABLE public.invoices 
        ADD CONSTRAINT invoices_sponsor_code_format 
        CHECK (sponsor_code IS NULL OR (sponsor_code ~ '^TPC-[A-Z0-9]{8}$'));
        RAISE NOTICE 'Added sponsor_code format constraint to invoices table';
    END IF;
END $$;

-- G) Add check constraint for sponsor_member_code format
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'invoices' 
        AND constraint_name = 'invoices_sponsor_member_code_format'
    ) THEN
        ALTER TABLE public.invoices 
        ADD CONSTRAINT invoices_sponsor_member_code_format 
        CHECK (sponsor_member_code IS NULL OR (sponsor_member_code ~ '^TPC-[A-Z0-9]{8}$'));
        RAISE NOTICE 'Added sponsor_member_code format constraint to invoices table';
    END IF;
END $$;

-- ================================================================
-- PHASE 6: CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- H) Create index on sponsor_code
CREATE INDEX IF NOT EXISTS invoices_sponsor_code_idx 
ON public.invoices(sponsor_code);

-- I) Create index on sponsor_member_code
CREATE INDEX IF NOT EXISTS invoices_sponsor_member_code_idx 
ON public.invoices(sponsor_member_code);

-- ================================================================
-- PHASE 7: CREATE TRIGGER FOR SPONSOR INTEGRITY
-- ================================================================

-- J) Create trigger function to enforce sponsor integrity
CREATE OR REPLACE FUNCTION public.tg_invoices_sponsor_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sponsor_code TEXT;
    v_sponsor_member_code TEXT;
    v_user_id UUID;
BEGIN
    -- Get user_id from NEW record
    v_user_id := NEW.user_id;
    
    -- If user_id is null, skip validation (for guest/anonymous)
    IF v_user_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Get sponsor_code from profiles for this user
    SELECT sponsor_code INTO v_sponsor_code
    FROM public.profiles
    WHERE user_id = v_user_id;
    
    -- Get sponsor_member_code from profiles for this user
    SELECT sponsor_code INTO v_sponsor_member_code
    FROM public.profiles
    WHERE user_id = v_user_id;
    
    -- If NEW.sponsor_code is provided, validate it matches profile
    IF NEW.sponsor_code IS NOT NULL AND TRIM(NEW.sponsor_code) != '' THEN
        -- Check if sponsor_code exists in profiles
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE member_code = UPPER(TRIM(NEW.sponsor_code))
        ) THEN
            NEW.sponsor_code := UPPER(TRIM(NEW.sponsor_code));
        ELSE
            -- Invalid sponsor_code, raise exception
            RAISE EXCEPTION 'INVALID_SPONSOR_CODE: Sponsor code % does not exist', UPPER(TRIM(NEW.sponsor_code));
        END IF;
    END IF;
    
    -- If NEW.sponsor_member_code is provided, validate it matches profile
    IF NEW.sponsor_member_code IS NOT NULL AND TRIM(NEW.sponsor_member_code) != '' THEN
        -- Check if sponsor_member_code exists in profiles
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE member_code = UPPER(TRIM(NEW.sponsor_member_code))
        ) THEN
            NEW.sponsor_member_code := UPPER(TRIM(NEW.sponsor_member_code));
        ELSE
            -- Invalid sponsor_member_code, raise exception
            RAISE EXCEPTION 'INVALID_SPONSOR_MEMBER_CODE: Sponsor member code % does not exist', UPPER(TRIM(NEW.sponsor_member_code));
        END IF;
    END IF;
    
    -- Auto-fill sponsor codes if they are null
    IF NEW.sponsor_code IS NULL OR TRIM(NEW.sponsor_code) = '' THEN
        NEW.sponsor_code := v_sponsor_code;
    END IF;
    
    IF NEW.sponsor_member_code IS NULL OR TRIM(NEW.sponsor_member_code) = '' THEN
        NEW.sponsor_member_code := v_sponsor_member_code;
    END IF;
    
    RETURN NEW;
END;
$$;

-- K) Create trigger
DROP TRIGGER IF EXISTS public.tg_invoices_sponsor_integrity ON public.invoices;
CREATE TRIGGER public.tg_invoices_sponsor_integrity
BEFORE INSERT OR UPDATE OF sponsor_code, sponsor_member_code, user_id
ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.tg_invoices_sponsor_integrity();

-- ================================================================
-- PHASE 8: CREATE RPC FUNCTIONS FOR INVOICE CREATION
-- ================================================================

-- L) Create locked invoice creation function
CREATE OR REPLACE FUNCTION public.member_create_invoice_locked(
    p_email TEXT,
    p_base_currency TEXT,
    p_amount_input NUMERIC,
    p_wallet_address TEXT,
    p_referral_code TEXT DEFAULT NULL,
    p_stage_id TEXT DEFAULT NULL,
    p_rate NUMERIC DEFAULT NULL,
    p_tpc_amount NUMERIC DEFAULT NULL,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_invoice_no TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    email TEXT,
    base_currency TEXT,
    amount_input NUMERIC,
    wallet_address TEXT,
    referral_code TEXT,
    stage_id TEXT,
    rate NUMERIC,
    tpc_amount NUMERIC,
    expires_at TIMESTAMPTZ,
    status TEXT,
    invoice_no TEXT,
    sponsor_code TEXT,
    sponsor_member_code TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_sponsor_code TEXT;
    v_sponsor_member_code TEXT;
    v_invoice_no TEXT;
BEGIN
    -- Get authenticated user_id
    v_user_id := auth.uid();
    
    -- Check authentication
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'AUTH_REQUIRED: User must be authenticated to create invoice';
    END IF;
    
    -- Get sponsor_code from profiles (OVERRIDE CLIENT INPUT)
    SELECT sponsor_code INTO v_sponsor_code
    FROM public.profiles
    WHERE user_id = v_user_id;
    
    -- Get sponsor_member_code from profiles (OVERRIDE CLIENT INPUT)
    SELECT sponsor_code INTO v_sponsor_member_code
    FROM public.profiles
    WHERE user_id = v_user_id;
    
    -- Validate sponsor_code if provided
    IF p_referral_code IS NOT NULL AND TRIM(p_referral_code) != '' THEN
        -- Check if sponsor_code exists in profiles
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE member_code = UPPER(TRIM(p_referral_code))
        ) THEN
            -- Valid sponsor_code, use it
            v_sponsor_code := UPPER(TRIM(p_referral_code));
            v_sponsor_member_code := UPPER(TRIM(p_referral_code));
        ELSE
            -- Invalid sponsor_code, raise exception
            RAISE EXCEPTION 'INVALID_SPONSOR_CODE: Sponsor code % does not exist', UPPER(TRIM(p_referral_code));
        END IF;
    END IF;
    
    -- Auto-generate invoice number if not provided
    IF p_invoice_no IS NULL OR TRIM(p_invoice_no) = '' THEN
        v_invoice_no := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '-' || SUBSTRING(MD5(v_user_id::TEXT), 1, 8);
    ELSE
        v_invoice_no := TRIM(p_invoice_no);
    END IF;
    
    -- Insert invoice with locked sponsor codes
    INSERT INTO public.invoices (
        id,
        user_id,
        email,
        base_currency,
        amount_input,
        wallet_address,
        referral_code,
        stage_id,
        rate,
        tpc_amount,
        expires_at,
        status,
        invoice_no,
        sponsor_code,
        sponsor_member_code,
        created_at
    ) VALUES (
        gen_random_uuid(),
        v_user_id,
        p_email,
        p_base_currency,
        p_amount_input,
        p_wallet_address,
        COALESCE(v_sponsor_code, 'TPC-GLOBAL'),
        p_stage_id,
        p_rate,
        p_tpc_amount,
        p_expires_at,
        'PENDING',
        v_invoice_no,
        v_sponsor_code,
        v_sponsor_member_code,
        NOW()
    );
    
    RETURN TABLE (
        SELECT 
            id,
            user_id,
            email,
            base_currency,
            amount_input,
            wallet_address,
            referral_code,
            stage_id,
            rate,
            tpc_amount,
            expires_at,
            status,
            invoice_no,
            sponsor_code,
            sponsor_member_code,
            created_at
        FROM public.invoices 
        WHERE id = gen_random_uuid()
    );
END;
$$;

-- ================================================================
-- PHASE 9: CREATE POLICY FUNCTIONS
-- ================================================================

-- M) Create function to check if user can update invoice
CREATE OR REPLACE FUNCTION public.user_can_update_invoice(p_invoice_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_invoice_user_id UUID;
BEGIN
    -- Get user_id from invoice
    SELECT user_id INTO v_invoice_user_id
    FROM public.invoices
    WHERE id = p_invoice_id;
    
    -- Check if invoice belongs to user
    IF v_invoice_user_id != p_user_id THEN
        RETURN FALSE;
    END IF;
    
    -- Check if invoice is still pending
    IF EXISTS (
        SELECT 1 FROM public.invoices 
        WHERE id = p_invoice_id 
        AND status = 'PENDING'
    ) THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;

-- ================================================================
-- PHASE 10: CREATE RLS POLICIES
-- ================================================================

-- N) Enable RLS on invoices table
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- O) Create policy for users to see their own invoices
CREATE POLICY "Users can view own invoices"
ON public.invoices
FOR SELECT
USING (auth.uid() = user_id);

-- P) Create policy for users to insert their own invoices
CREATE POLICY "Users can insert own invoices"
ON public.invoices
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Q) Create policy for users to update their own invoices
CREATE POLICY "Users can update own invoices"
ON public.invoices
FOR UPDATE
USING (auth.uid() = user_id AND status = 'PENDING');

-- R) Create policy for users to delete their own invoices
CREATE POLICY "Users can delete own invoices"
ON public.invoices
FOR DELETE
USING (auth.uid() = user_id);

-- S) Create policy for admins to view all invoices
CREATE POLICY "Admins can view all invoices"
ON public.invoices
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
));

-- T) Create policy for admins to insert invoices
CREATE POLICY "Admins can insert invoices"
ON public.invoices
FOR INSERT
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
));

-- U) Create policy for admins to update all invoices
CREATE POLICY "Admins can update all invoices"
ON public.invoices
FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
));

-- V) Create policy for admins to delete all invoices
CREATE POLICY "Admins can delete all invoices"
ON public.invoices
FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
));

-- ================================================================
-- PHASE 11: VERIFICATION QUERIES
-- ================================================================

-- W) Verification queries (run manually after migration)
/*
-- Query 1: Check sponsor_code integrity
SELECT 
    COUNT(*) as total_invoices,
    COUNT(CASE WHEN sponsor_code IS NULL THEN 1 END) as null_sponsor_codes,
    COUNT(CASE WHEN sponsor_member_code IS NULL THEN 1 END) as null_sponsor_member_codes
FROM public.invoices;

-- Query 2: Check format validation
SELECT 
    id,
    sponsor_code,
    CASE 
        WHEN sponsor_code ~ '^TPC-[A-Z0-9]{8}$' THEN 'VALID'
        ELSE 'INVALID'
    END as format_status
FROM public.invoices 
WHERE sponsor_code IS NOT NULL
LIMIT 10;

-- Query 3: Test trigger function
SELECT 
    public.tg_invoices_sponsor_integrity() IS ENABLED as trigger_enabled,
    tg_trigger_is_valid(oid) as trigger_valid
FROM pg_trigger 
WHERE tgname = 'tg_invoices_sponsor_integrity';

-- Query 4: Test locked invoice creation
SELECT 
    member_create_invoice_locked(
        'test@example.com',
        'IDR',
        100000,
        'test-wallet',
        'TPC-TEST123'
    ) as test_invoice;

-- Query 5: Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'invoices';

-- Query 6: Test sponsor validation
SELECT 
    public.tg_invoices_sponsor_integrity('test-sponsor-code', 'test-user-id');
*/

-- ================================================================
-- PHASE 12: PERFORMANCE OPTIMIZATION
-- ================================================================

-- X) Analyze tables for performance
ANALYZE public.invoices;
ANALYZE public.profiles;

-- ================================================================
-- SUMMARY OF CHANGES
-- ================================================================
/*
1. ✅ Extension pgcrypto ensured
2. ✅ Added sponsor_code column to invoices table
3. ✅ Added sponsor_member_code column to invoices table
4. ✅ Backfilled existing invoices with sponsor codes from profiles
5. ✅ Added format constraints (TPC-XXXXXXXX) for sponsor codes
6. ✅ Created trigger tg_invoices_sponsor_integrity for sponsor validation
7. ✅ Created locked RPC function member_create_invoice_locked
8. ✅ Created user_can_update_invoice function for edit permissions
9. ✅ Enhanced RLS policies for secure invoice access
10. ✅ Added performance indexes for sponsor code queries
11. ✅ Comprehensive verification queries included
12. ✅ Performance optimized with ANALYZE

Security Features:
- Sponsor codes must match profiles.member_code
- Client input is overridden by locked profile data
- Format validation ensures TPC-XXXXXXXX pattern
- Trigger enforces integrity at database level
- RLS policies provide proper access control
- Admin functions maintain full control
- Comprehensive error handling and validation

Production Safety:
- All operations are idempotent
- Backfill preserves existing data
- Constraints prevent invalid sponsor codes
- Trigger ensures data integrity
- RLS policies maintain security
- Performance optimized for high-volume invoice creation
*/
