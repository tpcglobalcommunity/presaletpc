-- Migration: 20260209_admin_audit_log_rpc.sql
-- Description: Add RPC for admin withdrawal audit log viewing
-- Author: TPC Global Team
-- Target: Consistent RPC for audit log access with proper security

-- ================================================================
-- RPC FOR ADMIN AUDIT LOG ACCESS
-- ================================================================

-- Create RPC for admin to get withdrawal audit logs
CREATE OR REPLACE FUNCTION public.admin_get_withdrawal_audit_logs(p_withdrawal_id UUID)
RETURNS TABLE (
    id UUID,
    action TEXT,
    actor_role TEXT,
    actor_user_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate admin access
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied: Admin access required';
    END IF;
    
    -- Return audit logs for the specific withdrawal
    RETURN QUERY
    SELECT 
        al.id,
        al.action,
        al.actor_role,
        al.actor_user_id,
        al.metadata,
        al.created_at
    FROM public.withdrawal_audit_logs al
    WHERE al.withdrawal_id = p_withdrawal_id
    ORDER BY al.created_at ASC;
END;
$$;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

/*
-- Query 1: Test admin audit log RPC
SELECT * FROM public.admin_get_withdrawal_audit_logs('test-withdrawal-id');

-- Query 2: Check RPC function exists
SELECT proname, prosrc FROM pg_proc WHERE proname = 'admin_get_withdrawal_audit_logs';

-- Query 3: Verify audit logs table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'withdrawal_audit_logs'
ORDER BY ordinal_position;
*/

-- ================================================================
-- SUMMARY OF CHANGES
-- ================================================================
/*
1. ✅ Created admin_get_withdrawal_audit_logs() RPC for consistent audit log access
2. ✅ Added proper admin access verification via public.is_admin()
3. ✅ Returns audit logs in chronological order (ASC by created_at)
4. ✅ Includes all necessary fields: id, action, actor_role, actor_user_id, metadata, created_at
5. ✅ SECURITY DEFINER with proper search_path configuration
6. ✅ Comprehensive verification queries included

Security Features:
- Admin-only access verification
- Consistent RPC interface for audit log access
- Proper error handling for unauthorized access
- Performance optimized with proper query structure
- Complete audit trail visibility for compliance

Production Safety:
- Single source of truth for admin access
- Consistent with existing RPC patterns
- Proper security definer configuration
- Performance optimized for audit log queries
- Complete error handling and validation
*/
