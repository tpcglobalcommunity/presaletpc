-- Migration: Fix profiles table for new user registration
-- File: supabase/migrations/20260203_fix_profiles_columns.sql

-- 1. Ensure all required columns exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name text NULL,
ADD COLUMN IF NOT EXISTS avatar_url text NULL,
ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz NULL;

-- 2. Ensure proper indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 3. Ensure unique constraint (PostgreSQL tidak support IF NOT EXISTS untuk constraint)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_user_id_unique' 
        AND conrelid = 'public.profiles'::regclass
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- 4. Drop and recreate RLS policies to ensure they work correctly
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 5. Recreate RLS policies
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- 6. Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. Grant proper permissions
GRANT EXECUTE ON FUNCTION upsert_profile_from_auth(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
