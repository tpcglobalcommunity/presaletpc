-- Migration: Fix profiles table for new user registration (safe & idempotent)

-- 0) Ensure table exists (optional safety)
-- DO NOT create table here unless you want to.
-- Assume profiles already exists.

-- 1) Add missing columns (safe)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name text NULL,
  ADD COLUMN IF NOT EXISTS avatar_url text NULL,
  ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz NULL;

-- 2) Enable RLS FIRST (recommended order)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3) Indexes (safe)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 4) Ensure unique constraint for user_id (safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_user_id_unique'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- 5) Recreate policies (safe reset)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 6) Grants: ONLY if functions exist (avoid migration failure)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'upsert_profile_from_auth'
      AND n.nspname = 'public'
  ) THEN
    GRANT EXECUTE ON FUNCTION public.upsert_profile_from_auth(uuid) TO authenticated;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'is_admin'
      AND n.nspname = 'public'
  ) THEN
    GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
  END IF;
END $$;
