-- =====================================================
-- STORAGE POLICIES FOR INVOICE-PROOFS BUCKET (SECURE)
-- Copy and paste this script in Supabase SQL Editor
-- =====================================================

-- 1. DROP EXISTING POLICIES (clean start)
DROP POLICY IF EXISTS "Allow Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin View" ON storage.objects;
DROP POLICY IF EXISTS "Allow User Update Own Proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow User Delete Own Proofs" ON storage.objects;

-- 2. CREATE POLICIES FOR STORAGE.BUCKET "invoice-proofs"

-- Policy untuk INSERT (Upload) - User yang login bisa upload bukti pembayaran
-- Hanya user yang memiliki user_id yang sama dengan folder pertama di path
CREATE POLICY "Allow Authenticated Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'invoice-proofs' AND 
  auth.role() = 'authenticated' AND
  auth.uid()::text = split_part(name, '/', 1)::uuid
);

-- Policy untuk SELECT (View) - Admin bisa melihat semua file, user hanya melihat miliknya
CREATE POLICY "Allow Admin View" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'invoice-proofs' AND (
    -- Admin bisa lihat semua file (dari config)
    auth.uid()::text IN ('518694f6-bb50-4724-b4a5-77ad30152e0e', 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47') OR
    -- User hanya bisa lihat file miliknya (berdasarkan folder pertama di path)
    auth.uid()::text = split_part(name, '/', 1)::text
  )
);

-- Policy untuk UPDATE - User hanya bisa update file miliknya, Admin bisa update semua
CREATE POLICY "Allow User Update Own Proofs" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'invoice-proofs' AND (
    -- Admin bisa update semua file
    auth.uid()::text IN ('518694f6-bb50-4724-b4a5-77ad30152e0e', 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47') OR
    -- User hanya bisa update file miliknya
    auth.uid()::text = split_part(name, '/', 1)::text
  )
)
WITH CHECK (
  bucket_id = 'invoice-proofs' AND 
  auth.uid()::text = split_part(name, '/', 1)::text
);

-- Policy untuk DELETE - User hanya bisa delete file miliknya, Admin bisa delete semua
CREATE POLICY "Allow User Delete Own Proofs" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'invoice-proofs' AND (
    -- Admin bisa delete semua file
    auth.uid()::text IN ('518694f6-bb50-4724-b4a5-77ad30152e0e', 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47') OR
    -- User hanya bisa delete file miliknya
    auth.uid()::text = split_part(name, '/', 1)::text
  )
);

-- 3. VERIFICATION
SELECT '=== INVOICE-PROOFS STORAGE POLICIES CREATED ===' as status;
SELECT 'Policies for invoice-proofs bucket:' as info;

-- Cek existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- Test permissions
SELECT 'Upload permission test:' as test,
       CASE 
         WHEN EXISTS (
           SELECT 1 FROM pg_policies 
           WHERE tablename = 'objects' 
           AND schemaname = 'storage'
           AND cmd = 'INSERT'
           AND 'authenticated' = ANY(roles)
         ) THEN 'ALLOWED' 
         ELSE 'DENIED' 
       END as result;

SELECT 'View permission test:' as test,
       CASE 
         WHEN EXISTS (
           SELECT 1 FROM pg_policies 
           WHERE tablename = 'objects' 
           AND schemaname = 'storage'
           AND cmd = 'SELECT'
           AND 'authenticated' = ANY(roles)
         ) THEN 'ALLOWED' 
         ELSE 'DENIED' 
       END as result;

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Storage policies for invoice-proofs are now active!' as message;
