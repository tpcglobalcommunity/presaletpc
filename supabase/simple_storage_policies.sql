-- =====================================================
-- SIMPLE STORAGE POLICIES FOR PROOF UPLOADS
-- Copy and paste this script in Supabase SQL Editor
-- Simplified version for basic upload and view permissions
-- =====================================================

-- 1. Hapus policy lama yang menyebabkan bentrok
DROP POLICY IF EXISTS "Allow Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin View" ON storage.objects;

-- 2. Buat ulang dengan definisi yang lebih lengkap
CREATE POLICY "Allow Authenticated Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'proofs');

CREATE POLICY "Allow Admin View" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'proofs');

-- 3. VERIFICATION
SELECT '=== SIMPLE STORAGE POLICIES CREATED ===' as status;

-- Cek policies yang dibuat
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
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname IN ('Allow Authenticated Upload', 'Allow Admin View')
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
           AND policyname = 'Allow Authenticated Upload'
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
           AND policyname = 'Allow Admin View'
         ) THEN 'ALLOWED' 
         ELSE 'DENIED' 
       END as result;

SELECT '=== SETUP SUCCESSFUL ===' as status, 'Simple storage policies are now active!' as message;
