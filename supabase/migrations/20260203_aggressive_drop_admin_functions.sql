-- AGGRESSIVE DROP ALL ADMIN FUNCTIONS TO PREVENT CONFLICTS
-- This will drop any existing admin functions regardless of signature

-- Drop all possible variations of admin functions
DROP FUNCTION IF EXISTS public.admin_get_paid_totals() CASCADE;
DROP FUNCTION IF EXISTS public.admin_get_paid_totals(integer) CASCADE;
DROP FUNCTION IF EXISTS public.admin_get_paid_totals(text) CASCADE;
DROP FUNCTION IF EXISTS public.admin_get_paid_totals(uuid) CASCADE;

DROP FUNCTION IF EXISTS public.get_dashboard_stats_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_dashboard_stats_admin(integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_dashboard_stats_admin(integer, integer) CASCADE;

DROP FUNCTION IF EXISTS public.get_all_users_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_all_users_admin(integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_all_users_admin(integer, integer) CASCADE;

DROP FUNCTION IF EXISTS public.admin_approve_invoice() CASCADE;
DROP FUNCTION IF EXISTS public.admin_approve_invoice(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.admin_approve_invoice(text) CASCADE;

DROP FUNCTION IF EXISTS public.admin_reject_invoice() CASCADE;
DROP FUNCTION IF EXISTS public.admin_reject_invoice(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.admin_reject_invoice(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.admin_reject_invoice(text) CASCADE;

DROP FUNCTION IF EXISTS public.get_admin_users_data() CASCADE;
DROP FUNCTION IF EXISTS public.get_admin_users_data(integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_admin_users_data(integer, integer) CASCADE;

SELECT '=== ALL ADMIN FUNCTIONS DROPPED ===' as status;
