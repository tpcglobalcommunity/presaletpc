-- Initial Setup: Create Super Admin User
-- Purpose: Create super admin user after database reset
-- Email: tpcglobal.io@gmail.com

-- ================================================================
-- 1. CREATE SUPER ADMIN PROFILE
-- ================================================================

-- Insert super admin profile directly
INSERT INTO public.profiles (
    user_id,
    email_initial,
    email_current,
    member_code,
    display_name,
    avatar_url,
    role,
    is_active,
    is_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(), -- Will be updated with actual auth user ID
    'tpcglobal.io@gmail.com',
    'tpcglobal.io@gmail.com',
    'TPC-ADMIN',
    'TPC Global Admin',
    NULL,
    'super_admin',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email_current) DO NOTHING;

-- ================================================================
-- 2. CREATE FUNCTION TO UPDATE ADMIN USER ID
-- ================================================================

CREATE OR REPLACE FUNCTION link_admin_user(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_user_id UUID;
    profile_user_id UUID;
    update_count INTEGER;
BEGIN
    -- Get auth user ID for the admin email
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = p_email;
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found in auth.users for email: %', p_email;
        RETURN FALSE;
    END IF;
    
    -- Update profile with correct user_id
    UPDATE public.profiles 
    SET user_id = admin_user_id, updated_at = NOW()
    WHERE email_current = p_email;
    
    GET DIAGNOSTICS update_count = ROW_COUNT;
    
    IF update_count > 0 THEN
        RAISE NOTICE 'Successfully linked admin user: %', p_email;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'No profile found for admin email: %', p_email;
        RETURN FALSE;
    END IF;
END;
$$;

-- ================================================================
-- 3. CREATE ADMIN ROLE MANAGEMENT FUNCTIONS
-- ================================================================

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    SELECT (role = 'super_admin' AND is_active = true) INTO is_admin
    FROM public.profiles
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(is_admin, FALSE);
END;
$$;

-- Function to check if user is admin (super_admin or admin)
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    SELECT (role IN ('super_admin', 'admin') AND is_active = true) INTO is_admin
    FROM public.profiles
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(is_admin, FALSE);
END;
$$;

-- ================================================================
-- 4. UPDATE RLS POLICIES FOR ADMIN ACCESS
-- ================================================================

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "admin_full_access_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_full_access_invoices" ON public.invoices;
DROP POLICY IF EXISTS "admin_full_access_app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "admin_full_access_stage_timers" ON public.stage_timers;

-- Create admin policies for profiles
CREATE POLICY "admin_full_access_profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (is_super_admin(auth.uid()))
    WITH CHECK (is_super_admin(auth.uid()));

-- Create admin policies for invoices
CREATE POLICY "admin_full_access_invoices" ON public.invoices
    FOR ALL TO authenticated
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Create admin policies for app_settings
CREATE POLICY "admin_full_access_app_settings" ON public.app_settings
    FOR ALL TO authenticated
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Create admin policies for stage_timers
CREATE POLICY "admin_full_access_stage_timers" ON public.stage_timers
    FOR ALL TO authenticated
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- ================================================================
-- 5. GRANT PERMISSIONS TO ADMIN FUNCTIONS
-- ================================================================

GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_admin_user(TEXT) TO authenticated;

-- ================================================================
-- 6. CREATE INITIAL APP SETTINGS
-- ================================================================

INSERT INTO public.app_settings (
    key,
    value,
    description,
    is_public,
    created_at,
    updated_at
) VALUES 
    ('system_initialized', 'true', 'System has been initialized', false, NOW(), NOW()),
    ('admin_email', 'tpcglobal.io@gmail.com', 'Super admin email', false, NOW(), NOW()),
    ('maintenance_mode', 'false', 'System maintenance mode', false, NOW(), NOW()),
    ('referral_bonus_percentage', '5', 'Referral bonus percentage', false, NOW(), NOW()),
    ('tpc_price_usd', '0.001', 'TPC token price in USD', false, NOW(), NOW()),
    ('idr_rate', '17000', 'IDR to USD conversion rate', false, NOW(), NOW())
ON CONFLICT (key) DO NOTHING;

-- ================================================================
-- 7. CREATE AUDIT LOG FOR ADMIN ACTIONS
-- ================================================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log (only admins can see their own actions, super admins can see all)
CREATE POLICY "admin_audit_log_access" ON public.admin_audit_log
    FOR SELECT TO authenticated
    USING (
        is_super_admin(auth.uid()) OR 
        admin_user_id = auth.uid()
    );

CREATE POLICY "admin_audit_log_insert" ON public.admin_audit_log
    FOR INSERT TO authenticated
    WITH CHECK (is_admin(auth.uid()));

-- ================================================================
-- 8. CREATE TRIGGER FOR ADMIN AUDIT
-- ================================================================

CREATE OR REPLACE FUNCTION log_admin_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only log if current user is admin
    IF is_admin(auth.uid()) THEN
        INSERT INTO public.admin_audit_log (
            admin_user_id,
            action,
            table_name,
            record_id,
            old_values,
            new_values
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            CASE TG_OP
                WHEN 'UPDATE' THEN row_to_json(OLD)
                WHEN 'DELETE' THEN row_to_json(OLD)
                ELSE NULL
            END,
            CASE TG_OP
                WHEN 'INSERT' THEN row_to_json(NEW)
                WHEN 'UPDATE' THEN row_to_json(NEW)
                ELSE NULL
            END
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for admin tables
DROP TRIGGER IF EXISTS profiles_admin_audit ON public.profiles;
CREATE TRIGGER profiles_admin_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION log_admin_changes();

DROP TRIGGER IF EXISTS invoices_admin_audit ON public.invoices;
CREATE TRIGGER invoices_admin_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION log_admin_changes();

-- ================================================================
-- 9. VERIFICATION AND SETUP COMPLETE
-- ================================================================

DO $$
DECLARE
    profile_count INTEGER;
    function_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Check if admin profile exists
    SELECT COUNT(*) INTO profile_count
    FROM public.profiles
    WHERE email_current = 'tpcglobal.io@gmail.com';
    
    IF profile_count > 0 THEN
        RAISE NOTICE '✅ Super admin profile created for tpcglobal.io@gmail.com';
    ELSE
        RAISE NOTICE '❌ Failed to create super admin profile';
    END IF;
    
    -- Check admin functions
    SELECT COUNT(*) INTO function_count
    FROM pg_proc
    WHERE proname IN ('is_super_admin', 'is_admin', 'link_admin_user')
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    
    IF function_count = 3 THEN
        RAISE NOTICE '✅ All admin functions created';
    ELSE
        RAISE NOTICE '❌ Missing admin functions';
    END IF;
    
    -- Check admin policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE policyname LIKE 'admin_full_access_%';
    
    IF policy_count >= 4 THEN
        RAISE NOTICE '✅ Admin policies created';
    ELSE
        RAISE NOTICE '❌ Missing admin policies';
    END IF;
    
    RAISE NOTICE '=== NEXT STEPS ===';
    RAISE NOTICE '1. Login with Google OAuth using: tpcglobal.io@gmail.com';
    RAISE NOTICE '2. Run: SELECT link_admin_user(''tpcglobal.io@gmail.com'');';
    RAISE NOTICE '3. Verify admin access in dashboard';
    RAISE NOTICE '==================';
END $$;

-- ================================================================
-- 10. POST-LOGIN INSTRUCTIONS
-- ================================================================

-- After logging in with tpcglobal.io@gmail.com, run this:
-- SELECT link_admin_user('tpcglobal.io@gmail.com');

-- This will link the auth user ID with the admin profile
