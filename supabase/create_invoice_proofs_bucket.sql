-- =====================================================
-- CREATE INVOICE-PROOFS BUCKET (IDEMPOTENT)
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create bucket invoice-proofs with public access and 5MB limit
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invoice-proofs', 'invoice-proofs', true, 5242880, array['image/jpeg','image/png','application/pdf'])
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','application/pdf'];

-- Verification
SELECT 'Bucket invoice-proofs created/updated:' as status,
       CASE 
         WHEN id = 'invoice-proofs' THEN 'EXISTS AND PUBLIC'
         ELSE 'NOT FOUND'
       END as result
FROM storage.buckets 
WHERE id = 'invoice-proofs';
