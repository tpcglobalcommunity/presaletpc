-- Migration: 20260202_storage_proof_bucket.sql
-- Create storage bucket and policies for proof uploads

-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-proofs', 'invoice-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage objects in bucket invoice-proofs
DROP POLICY IF EXISTS "proofs_read_own" ON storage.objects;
DROP POLICY IF EXISTS "proofs_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "proofs_update_own" ON storage.objects;

CREATE POLICY "proofs_read_own"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'invoice-proofs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "proofs_insert_own"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'invoice-proofs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "proofs_update_own"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'invoice-proofs'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'invoice-proofs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
