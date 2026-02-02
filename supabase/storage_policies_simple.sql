-- =====================================================
-- SIMPLE STORAGE POLICIES FOR PROOF UPLOADS
-- Copy and paste this script in Supabase SQL Editor
-- No array comparison - simplified version
-- =====================================================

-- 1. DROP EXISTING POLICIES (clean start)
DROP POLICY IF EXISTS "Allow Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin View" ON storage.objects;
DROP POLICY IF EXISTS "Allow User Update Own Proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow User Delete Own Proofs" ON storage.objects;

-- 2. CREATE SIMPLE POLICIES FOR STORAGE.BUCKET "proofs"

-- Policy untuk INSERT (Upload) - User yang login bisa upload bukti pembayaran
CREATE POLICY "Allow Authenticated Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'proofs');

-- Policy untuk SELECT (View) - Semua authenticated users bisa lihat semua file di bucket proofs
CREATE POLICY "Allow Admin View" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'proofs');

-- Policy untuk UPDATE - User hanya bisa update file miliknya
CREATE POLICY "Allow User Update Own Proofs" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'proofs' AND (
    storage.foldername(name) = auth.uid()::text OR
    (metadata->>'user_id') = auth.uid()::text
  )
)
WITH CHECK (
  bucket_id = 'proofs' AND (
    storage.foldername(name) = auth.uid()::text OR
    (metadata->>'user_id') = auth.uid()::text
  )
);

-- Policy untuk DELETE - User hanya bisa delete file miliknya, Admin bisa delete semua
CREATE POLICY "Allow User Delete Own Proofs" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'proofs' AND (
    -- Admin bisa delete semua file
    auth.uid()::text = '518694f6-bb50-4724-b4a5-77ad30152e0e' OR
    -- User hanya bisa delete file miliknya
    storage.foldername(name) = auth.uid()::text OR
    (metadata->>'user_id') = auth.uid()::text
  )
);

-- 3. CREATE HELPER FUNCTIONS
-- Function untuk extract foldername dari file path
CREATE OR REPLACE FUNCTION storage.foldername(path text)
RETURNS text
LANGUAGE sql IMMUTABLE
AS $$
SELECT 
  CASE 
    WHEN path LIKE '%/%' THEN split_part(path, '/', 1)
    ELSE ''
  END;
$$;

-- 4. VERIFICATION - SIMPLE VERSION WITHOUT ARRAY COMPARISON
SELECT '=== STORAGE POLICIES CREATED ===' as status;

-- Cek existing policies by name (no array comparison)
SELECT 'Upload policy exists:' as test,
       CASE 
         WHEN EXISTS (
           SELECT 1 FROM pg_policies 
           WHERE policyname = 'Allow Authenticated Upload'
         ) THEN 'YES' 
         ELSE 'NO' 
       END as result;

SELECT 'View policy exists:' as test,
       CASE 
         WHEN EXISTS (
           SELECT 1 FROM pg_policies 
           WHERE policyname = 'Allow Admin View'
         ) THEN 'YES' 
         ELSE 'NO' 
       END as result;

SELECT 'Update policy exists:' as test,
       CASE 
         WHEN EXISTS (
           SELECT 1 FROM pg_policies 
           WHERE policyname = 'Allow User Update Own Proofs'
         ) THEN 'YES' 
         ELSE 'NO' 
       END as result;

SELECT 'Delete policy exists:' as test,
       CASE 
         WHEN EXISTS (
           SELECT 1 FROM pg_policies 
           WHERE policyname = 'Allow User Delete Own Proofs'
         ) THEN 'YES' 
         ELSE 'NO' 
       END as result;

-- Show all created policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname IN (
    'Allow Authenticated Upload',
    'Allow Admin View', 
    'Allow User Update Own Proofs',
    'Allow User Delete Own Proofs'
  )
ORDER BY policyname;

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Simple storage policies are now active!' as message;
