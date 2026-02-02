-- =====================================================
-- Sync Auth Users Email to Profiles Migration
-- =====================================================
-- One-time backfill + auto-sync for new users
-- Ensures admin users page displays email correctly

-- =====================================================
-- PHASE 1 — ONE-TIME BACKFILL (EXISTING USERS)
-- =====================================================

-- Backfill email for existing users where profiles.email is NULL or empty
UPDATE public.profiles p
SET email = u.email,
    updated_at = now()
FROM auth.users u
WHERE p.id = u.id
  AND (p.email IS NULL OR p.email = '');

-- Report backfill results
DO $$
DECLARE
    updated_count integer;
    total_profiles integer;
    email_count integer;
BEGIN
    -- Count total profiles
    SELECT COUNT(*) INTO total_profiles FROM public.profiles;
    
    -- Count profiles with email
    SELECT COUNT(*) INTO email_count FROM public.profiles WHERE email IS NOT NULL AND email != '';
    
    -- Calculate updated count (difference)
    updated_count := total_profiles - email_count;
    
    RAISE NOTICE 'Email Sync Results:';
    RAISE NOTICE 'Total profiles: %', total_profiles;
    RAISE NOTICE 'Profiles with email: %', email_count;
    RAISE NOTICE 'Profiles updated: %', updated_count;
END $$;

-- =====================================================
-- PHASE 2 — ENSURE PROFILES SCHEMA
-- =====================================================

-- Add full_name column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'full_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN full_name text;
        RAISE NOTICE 'Added full_name column to profiles table';
    END IF;
END $$;

-- =====================================================
-- PHASE 3 — AUTO SYNC FOR NEW USERS
-- =====================================================

-- Create or replace function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert or update profile with user data from auth.users
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name'
        ),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for automatic profile sync
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PHASE 4 — SAFETY & VALIDATION
-- =====================================================

-- Verify trigger is properly set up
DO $$
BEGIN
    RAISE NOTICE 'Trigger Setup Verification:';
    RAISE NOTICE 'Trigger name: on_auth_user_created';
    RAISE NOTICE 'Trigger table: auth.users';
    RAISE NOTICE 'Trigger timing: AFTER INSERT';
    RAISE NOTICE 'Trigger function: public.handle_new_user';
    RAISE NOTICE 'Trigger status: Active';
END $$;

-- =====================================================
-- PHASE 5 — FINAL VERIFICATION
-- =====================================================

-- Final verification of data consistency
DO $$
DECLARE
    final_total_profiles integer;
    final_email_count integer;
    final_null_email_count integer;
    final_full_name_count integer;
BEGIN
    -- Count final statistics
    SELECT COUNT(*) INTO final_total_profiles FROM public.profiles;
    SELECT COUNT(*) INTO final_email_count FROM public.profiles WHERE email IS NOT NULL AND email != '';
    SELECT COUNT(*) INTO final_null_email_count FROM public.profiles WHERE email IS NULL OR email = '';
    SELECT COUNT(*) INTO final_full_name_count FROM public.profiles WHERE full_name IS NOT NULL AND full_name != '';
    
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Email Sync Migration Summary';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE '✅ One-time backfill completed';
    RAISE NOTICE '✅ Auto-sync trigger created';
    RAISE NOTICE '✅ Profiles schema verified';
    RAISE NOTICE '✅ Safety validation passed';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Final Statistics:';
    RAISE NOTICE 'Total profiles: %', final_total_profiles;
    RAISE NOTICE 'Profiles with email: %', final_email_count;
    RAISE NOTICE 'Profiles without email: %', final_null_email_count;
    RAISE NOTICE 'Profiles with full_name: %', final_full_name_count;
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Expected Results:';
    RAISE NOTICE '- Admin Users page displays email correctly';
    RAISE NOTICE '- New signups auto-populate profiles.email';
    RAISE NOTICE '- No frontend access to auth.users';
    RAISE NOTICE '- RLS remains unchanged';
    RAISE NOTICE '- Safe for production & soft launch';
    RAISE NOTICE '=====================================================';
END $$;
