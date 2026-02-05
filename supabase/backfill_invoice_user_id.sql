-- Backfill user_id for invoices that don't have it
-- Link invoices to profiles based on email

UPDATE invoices i
SET user_id = p.user_id
FROM profiles p
WHERE i.email = p.email_initial
  AND i.user_id IS NULL;

-- Verify backfill
SELECT 
  COUNT(*) as total_invoices,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as invoices_with_user_id,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as invoices_without_user_id
FROM invoices;

-- Show sample of updated invoices
SELECT 
  i.invoice_no,
  i.email,
  i.user_id,
  p.email_initial,
  p.user_id as profile_user_id
FROM invoices i
JOIN profiles p ON i.email = p.email_initial
WHERE i.user_id = p.user_id
LIMIT 10;
