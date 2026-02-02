-- Clean up broken admin reject function
DROP FUNCTION IF EXISTS admin_reject_invoice(uuid,text);

-- Note: This removes the broken RPC function that referenced non-existent admin_whitelist table
-- Admin authorization is now handled in frontend (RequireAdmin component with UUID whitelist)
-- Invoice rejection uses direct table update instead of RPC
