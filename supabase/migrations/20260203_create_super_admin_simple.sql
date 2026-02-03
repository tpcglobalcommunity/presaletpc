-- Create Super Admin User - Simple Version
-- Email: tpcglobal.io@gmail.com

-- ================================================================
-- 1. ADD MISSING COLUMNS TO PROFILES TABLE
-- ================================================================

-- Add role column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'member';
    END IF;
END $$;

-- Add display_name column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'display_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
    END IF;
END $$;

-- Add avatar_url column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'avatar_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Add updated_at column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ================================================================
-- 2. CREATE SUPER ADMIN FUNCTIONS
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
    SELECT (role = 'super_admin') INTO is_admin
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
    SELECT (role IN ('super_admin', 'admin')) INTO is_admin
    FROM public.profiles
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(is_admin, FALSE);
END;
$$;

-- Function to link auth user with admin profile
CREATE OR REPLACE FUNCTION link_admin_user(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_user_id UUID;
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
-- 3. CREATE SUPER ADMIN PROFILE
-- ================================================================

-- Insert super admin profile
INSERT INTO public.profiles (
    user_id,
    email_initial,
    email_current,
    member_code,
    referred_by,
    display_name,
    avatar_url,
    role,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'tpcglobal.io@gmail.com',
    'tpcglobal.io@gmail.com',
    'TPC-ADMIN',
    NULL,
    'TPC Global Admin',
    NULL,
    'super_admin',
    NOW(),
    NOW()
);

-- ================================================================
-- 4. CREATE ADMIN RLS POLICIES
-- ================================================================

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "admin_full_access_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_full_access_invoices" ON public.invoices;

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

-- ================================================================
-- 5. GRANT PERMISSIONS
-- ================================================================

GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_admin_user(TEXT) TO authenticated;

-- ================================================================
-- 6. VERIFICATION
-- ================================================================

DO $$
DECLARE
    profile_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count
    FROM public.profiles
    WHERE email_current = 'tpcglobal.io@gmail.com';
    
    IF profile_count > 0 THEN
        RAISE NOTICE '✅ Super admin profile created successfully';
    ELSE
        RAISE NOTICE '❌ Failed to create super admin profile';
    END IF;
    
    RAISE NOTICE '=== NEXT STEPS ===';
    RAISE NOTICE '1. Login with Google OAuth using: tpcglobal.io@gmail.com';
    RAISE NOTICE '2. Run: SELECT link_admin_user(''tpcglobal.io@gmail.com'');';
    RAISE NOTICE '3. Verify admin access with: SELECT is_super_admin(auth.uid());';
    RAISE NOTICE '==================';
END $$;
