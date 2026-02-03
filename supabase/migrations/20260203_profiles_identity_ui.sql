-- Migration: Create profiles identity UI infrastructure
-- File: supabase/migrations/20260203_profiles_identity_ui.sql

-- 1. Add UI columns to public.profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name text NULL,
ADD COLUMN IF NOT EXISTS avatar_url text NULL,
ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz NULL;

-- Ensure user_id is unique and indexed
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 2. Function: upsert_profile_from_auth
CREATE OR REPLACE FUNCTION upsert_profile_from_auth(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_record auth.users%ROWTYPE;
    existing_profile profiles%ROWTYPE;
    v_display_name text;
    v_avatar_url text;
BEGIN
    -- Get auth user data
    SELECT * INTO auth_user_record 
    FROM auth.users 
    WHERE id = p_user_id;
    
    IF auth_user_record IS NULL THEN
        RAISE EXCEPTION 'User not found: %', p_user_id;
    END IF;
    
    -- Extract display_name with priority
    v_display_name := COALESCE(
        auth_user_record.raw_user_meta_data->>'full_name',
        auth_user_record.raw_user_meta_data->>'name',
        auth_user_record.raw_user_meta_data->>'given_name',
        SPLIT_PART(auth_user_record.email, '@', 1)
    );
    
    -- Extract avatar_url with priority
    v_avatar_url := COALESCE(
        auth_user_record.raw_user_meta_data->>'avatar_url',
        auth_user_record.raw_user_meta_data->>'picture'
    );
    
    -- Upsert profile data with safe updates
    INSERT INTO profiles (
        user_id,
        email_initial,
        display_name,
        avatar_url,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        auth_user_record.email,
        v_display_name,
        v_avatar_url,
        auth_user_record.last_sign_in_at,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        display_name = CASE 
            WHEN EXCLUDED.display_name IS NOT NULL AND EXCLUDED.display_name != '' 
            THEN EXCLUDED.display_name 
            ELSE profiles.display_name 
        END,
        avatar_url = CASE 
            WHEN EXCLUDED.avatar_url IS NOT NULL AND EXCLUDED.avatar_url != '' 
            THEN EXCLUDED.avatar_url 
            ELSE profiles.avatar_url 
        END,
        last_sign_in_at = EXCLUDED.last_sign_in_at,
        email_initial = COALESCE(profiles.email_initial, EXCLUDED.email_initial),
        updated_at = NOW()
    WHERE profiles.user_id = p_user_id;
    
END;
$$;

-- 3. Trigger: on_auth_user_created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION upsert_profile_from_auth(new.id);

-- 4. Admin helper function (check if user is admin)
CREATE OR REPLACE FUNCTION is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check against hardcoded admin IDs (matches frontend ADMIN_USER_IDS)
    RETURN p_user_id IN (
        '9d8499ba-5b7b-4f8e-8d3f-2a1b4c5d6e7f', -- Example admin UUID
        '8c7388a9-4c6c-3d7d-9c2e-1b9a3b4c5d6e', -- Example admin UUID
        '7b6277b8-3d5b-2c6c-8b1d-0a8a2a3b4c5d'  -- Example admin UUID
    );
END;
$$;

-- 5. RPC Admin: admin_list_users
CREATE OR REPLACE FUNCTION admin_list_users(p_limit int DEFAULT 200, p_offset int DEFAULT 0)
RETURNS TABLE (
    user_id uuid,
    email_initial text,
    display_name text,
    avatar_url text,
    created_at timestamptz,
    last_sign_in_at timestamptz,
    auth_email text,
    auth_created_at timestamptz,
    last_sign_in_auth timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if caller is admin
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    RETURN QUERY
    SELECT 
        p.user_id,
        p.email_initial,
        p.display_name,
        p.avatar_url,
        p.created_at,
        p.last_sign_in_at,
        a.email as auth_email,
        a.created_at as auth_created_at,
        a.last_sign_in_at as last_sign_in_auth
    FROM profiles p
    JOIN auth.users a ON p.user_id = a.id
    ORDER BY p.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- 6. Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for profiles
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (user_id = auth.uid());

-- Users can update their own display_name and avatar_url
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Only service roles can insert (via trigger/function)
-- No INSERT policy needed as it's handled by SECURITY DEFINER functions

-- 8. Grant execute permissions
GRANT EXECUTE ON FUNCTION upsert_profile_from_auth(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_list_users(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;

-- 9. Sanity check - verify profiles table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
