-- Migration: 20260205_fix_invoice_proofs_storage.sql
-- Purpose: Fix bucket public access and add proof path columns

-- 1. Set invoice-proofs bucket to public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'invoice-proofs';

-- 2. Add proof storage columns to invoices table
DO $$
BEGIN
    -- Add proof_bucket column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'proof_bucket'
    ) THEN
        ALTER TABLE public.invoices 
        ADD COLUMN proof_bucket TEXT DEFAULT 'invoice-proofs';
    END IF;

    -- Add proof_path column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'proof_path'
    ) THEN
        ALTER TABLE public.invoices 
        ADD COLUMN proof_path TEXT;
    END IF;

    -- Add proof_uploaded_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'proof_uploaded_at'
    ) THEN
        ALTER TABLE public.invoices 
        ADD COLUMN proof_uploaded_at TIMESTAMPTZ;
    END IF;

    -- Add submitted_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'submitted_at'
    ) THEN
        ALTER TABLE public.invoices 
        ADD COLUMN submitted_at TIMESTAMPTZ;
    END IF;
END $$;

-- 3. Update existing proof_url data to extract bucket and path
UPDATE public.invoices 
SET 
    proof_bucket = CASE 
        WHEN proof_url LIKE '%/invoice-proofs/%' THEN 'invoice-proofs'
        WHEN proof_url LIKE '%/proofs/%' THEN 'proofs'
        ELSE 'invoice-proofs'
    END,
    proof_path = CASE 
        WHEN proof_url LIKE '%/invoice-proofs/%' THEN 
            regexp_replace(proof_url, '.*/invoice-proofs/', '')
        WHEN proof_url LIKE '%/proofs/%' THEN 
            regexp_replace(proof_url, '.*/proofs/', '')
        ELSE NULL
    END
WHERE proof_url IS NOT NULL 
AND proof_path IS NULL;

-- 4. Create index for proof queries
CREATE INDEX IF NOT EXISTS idx_invoices_proof_bucket_path ON public.invoices(proof_bucket, proof_path) 
WHERE proof_path IS NOT NULL;

-- 5. Add RLS policy for proof access (if RLS is enabled)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'invoices' 
        AND rowsecurity = true
    ) THEN
        -- Allow users to see their own proof info
        CREATE POLICY "users_view_own_proofs" ON public.invoices
        FOR SELECT USING (
            auth.uid() = user_id OR 
            (user_id IS NULL AND email = auth.email())
        );
    END IF;
END $$;
