-- Create Super Admin - Correct Table Structure
-- Email: tpcglobal@gmail.com
-- Table: profiles (id, user_id, email, member_code, role, created_at, updated_at)

-- ================================================================
-- 1. DROP CONSTRAINTS
-- ================================================================

DO $$
BEGIN
    -- Drop NOT NULL constraint from user_id if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_id' 
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;
        RAISE NOTICE '✅ Dropped NOT NULL constraint from user_id';
    END IF;
    
    -- Drop UNIQUE constraint from user_id if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%user_id%' 
        AND table_name = 'profiles' 
        AND table_schema = 'public'
    ) THEN
        DECLARE 
            constraint_name TEXT;
        BEGIN
            SELECT constraint_name INTO constraint_name
            FROM information_schema.table_constraints 
            WHERE constraint_name LIKE '%user_id%' 
            AND table_name = 'profiles' 
            AND table_schema = 'public'
            LIMIT 1;
            
            EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', constraint_name);
            RAISE NOTICE '✅ Dropped UNIQUE constraint from user_id: %', constraint_name;
        END;
    END IF;
    
    -- Drop role check constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_role_check' 
        AND table_name = 'profiles' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
        RAISE NOTICE '✅ Dropped profiles_role_check constraint';
    END IF;
END $$;

-- ================================================================
-- 2. ENSURE PROFILES TABLE EXISTS WITH CORRECT STRUCTURE
-- ================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    member_code TEXT UNIQUE,
    role TEXT DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 3. CREATE SUPER ADMIN FUNCTIONS
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
    WHERE email = p_email;
    
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
-- 4. CREATE SUPER ADMIN PROFILE FOR tpcglobal@gmail.com
-- ================================================================

-- Insert super admin profile (user_id NULL initially, will be linked after login)
INSERT INTO public.profiles (
    user_id,
    email,
    member_code,
    role,
    created_at,
    updated_at
) VALUES (
    NULL, -- Will be updated after login with link_admin_user()
    'tpcglobal@gmail.com',
    'TPC-ADMIN',
    'super_admin',
    NOW(),
    NOW()
) ON CONFLICT (member_code) DO NOTHING;

-- ================================================================
-- 5. ENABLE RLS AND CREATE POLICIES
-- ================================================================

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "users_read_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "admin_full_access_profiles" ON public.profiles;

-- Create user policies
CREATE POLICY "users_read_own_profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "users_update_own_profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Create admin policies
CREATE POLICY "admin_full_access_profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (is_super_admin(auth.uid()))
    WITH CHECK (is_super_admin(auth.uid()));

-- ================================================================
-- 6. GRANT PERMISSIONS
-- ================================================================

GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.link_admin_user(TEXT) TO authenticated;

-- ================================================================
-- 7. VERIFICATION
-- ================================================================

DO $$
DECLARE
    profile_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count
    FROM public.profiles
    WHERE email = 'tpcglobal@gmail.com';
    
    IF profile_count > 0 THEN
        RAISE NOTICE '✅ Super admin profile created successfully for tpcglobal@gmail.com';
    ELSE
        RAISE NOTICE '❌ Failed to create super admin profile';
    END IF;
    
    RAISE NOTICE '=== NEXT STEPS ===';
    RAISE NOTICE '1. Login with Google OAuth using: tpcglobal@gmail.com';
    RAISE NOTICE '2. Run: SELECT link_admin_user(''tpcglobal@gmail.com'');';
    RAISE NOTICE '3. Verify admin access with: SELECT is_super_admin(auth.uid());';
    RAISE NOTICE '==================';
END $$;
