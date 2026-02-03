-- Add role column to profiles table for member/admin filtering
-- Migration to enable role-based filtering in admin users page

-- =========================
-- 1) ADD ROLE COLUMN (IDEMPOTENT)
-- =========================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';

-- =========================
-- 2) UPDATE EXISTING RECORDS
-- =========================
-- Set existing users to 'member' by default
UPDATE public.profiles 
SET role = 'member' 
WHERE role IS NULL;

-- Set specific users as super_admin based on known user_ids
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE user_id IN (
  'cd6d5d3d-e59d-4fd0-8543-93da9e3d87c1'::uuid,
  '518694f6-bb50-4724-b4a5-77ad30152e0e'::uuid
);

-- =========================
-- 3) ADD CONSTRAINT
-- =========================
-- Ensure role only has valid values
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_role_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
  END IF;

  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_role_check CHECK (role IN ('member','admin','super_admin'));
END $$;

-- =========================
-- 4) ADD INDEX FOR PERFORMANCE
-- =========================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =========================
-- 5) VERIFICATION
-- =========================
DO $$
DECLARE
    total_profiles integer;
    member_count integer;
    admin_count integer;
    super_admin_count integer;
BEGIN
    SELECT COUNT(*) INTO total_profiles FROM public.profiles;
    SELECT COUNT(*) INTO member_count FROM public.profiles WHERE role = 'member';
    SELECT COUNT(*) INTO admin_count FROM public.profiles WHERE role = 'admin';
    SELECT COUNT(*) INTO super_admin_count FROM public.profiles WHERE role = 'super_admin';
    
    RAISE NOTICE 'Role Column Migration Results:';
    RAISE NOTICE 'Total profiles: %', total_profiles;
    RAISE NOTICE 'Members: %', member_count;
    RAISE NOTICE 'Admins: %', admin_count;
    RAISE NOTICE 'Super Admins: %', super_admin_count;
    RAISE NOTICE 'Migration completed successfully!';
END $$;
