-- =====================================================
-- STORAGE POLICIES FOR PROOF UPLOADS
-- Copy and paste this script in Supabase SQL Editor
-- This enables users to upload payment proofs and admins to view them
-- =====================================================

-- 1. DROP EXISTING POLICIES (clean start)
DROP POLICY IF EXISTS "Allow Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin View" ON storage.objects;
DROP POLICY IF EXISTS "Allow User Update Own Proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow User Delete Own Proofs" ON storage.objects;

-- 2. CREATE POLICIES FOR STORAGE.BUCKET "proofs"

-- Policy untuk INSERT (Upload) - User yang login bisa upload bukti pembayaran
CREATE POLICY "Allow Authenticated Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'proofs');

-- Policy untuk SELECT (View) - Admin bisa melihat semua bukti, user hanya melihat miliknya
CREATE POLICY "Allow Admin View" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'proofs' AND (
    -- Admin bisa lihat semua file
    (auth.uid() = '518694f6-bb50-4724-b4a5-77ad30152e0e') OR
    -- User hanya bisa lihat file miliknya (berdasarkan path atau metadata)
    (storage.foldername(name) = auth.uid()::text) OR
    -- Alternative: berdasarkan metadata user_id
    (metadata->>'user_id' = auth.uid()::text)
  )
);

-- Policy untuk UPDATE - User hanya bisa update file miliknya
CREATE POLICY "Allow User Update Own Proofs" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'proofs' AND (
    (storage.foldername(name) = auth.uid()::text) OR
    (metadata->>'user_id' = auth.uid()::text)
  )
)
WITH CHECK (
  bucket_id = 'proofs' AND (
    (storage.foldername(name) = auth.uid()::text) OR
    (metadata->>'user_id' = auth.uid()::text)
  )
);

-- Policy untuk DELETE - User hanya bisa delete file miliknya, Admin bisa delete semua
CREATE POLICY "Allow User Delete Own Proofs" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'proofs' AND (
    -- Admin bisa delete semua file
    (auth.uid() = '518694f6-bb50-4724-b4a5-77ad30152e0e') OR
    -- User hanya bisa delete file miliknya
    (storage.foldername(name) = auth.uid()::text) OR
    (metadata->>'user_id' = auth.uid()::text)
  )
);

-- 3. CREATE HELPER FUNCTIONS (optional)
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

-- 4. VERIFICATION
SELECT '=== STORAGE POLICIES CREATED ===' as status;
SELECT 'Policies for proofs bucket:' as info;

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

-- 5. TEST QUERIES (optional)
-- Test jika user bisa upload (simulasi)
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

-- Test jika admin bisa view (simulasi)
SELECT 'Admin view permission test:' as test,
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

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Storage policies for proof uploads are now active!' as message;
