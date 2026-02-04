-- =========================================================
-- CLEANUP: Assign sponsor to all users without sponsor
-- ONE-TIME TASK - Run after all migrations are applied
-- =========================================================

-- Script to assign sponsors to existing users without sponsors
-- This should be run manually in Supabase SQL Editor

-- Step 1: Check how many users need sponsor assignment
SELECT 
    COUNT(*) as users_without_sponsor,
    COUNT(CASE WHEN sponsor_user_id IS NULL THEN 1 END) as null_sponsor_user_id,
    COUNT(CASE WHEN sponsor_code IS NULL THEN 1 END) as null_sponsor_code
FROM public.profiles 
WHERE user_id IS NOT NULL;

-- Step 2: Assign sponsors to users without them (run in batches)
-- This will call the assign_sponsor RPC for each user

-- Create a temporary function to batch process
CREATE OR REPLACE FUNCTION temp_batch_assign_sponsors()
RETURNS TABLE(
    user_id uuid,
    success boolean,
    sponsor_user_id uuid,
    sponsor_code text,
    reason text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_record RECORD;
    result RECORD;
BEGIN
    -- Loop through users without sponsors
    FOR user_record IN 
        SELECT user_id 
        FROM public.profiles 
        WHERE sponsor_user_id IS NULL 
        LIMIT 100  -- Process in batches of 100
    LOOP
        -- Call assign_sponsor for each user
        BEGIN
            -- Temporarily set auth context for this user
            PERFORM set_config('request.jwt.claims', 
                '{"sub": "' || user_record.user_id::text || '", "role": "authenticated"}', 
                true);
            
            -- Call the assign_sponsor function
            SELECT * INTO result 
            FROM assign_sponsor(NULL::text);
            
            -- Return result
            RETURN NEXT;
            
        EXCEPTION WHEN OTHERS THEN
            RETURN NEXT;
        END;
    END LOOP;
    
    RETURN;
END;
$$;

-- Run the batch assignment
-- SELECT * FROM temp_batch_assign_sponsors();

-- Clean up temporary function
-- DROP FUNCTION IF EXISTS temp_batch_assign_sponsors();

-- Step 3: Verify all users now have sponsors
-- SELECT COUNT(*) as total_users, 
--        COUNT(CASE WHEN sponsor_user_id IS NOT NULL THEN 1 END) as users_with_sponsor
-- FROM public.profiles 
-- WHERE user_id IS NOT NULL;

-- Step 4: After verification, enable NOT NULL constraints
-- Uncomment these lines ONLY after all users have sponsors:
-- ALTER TABLE public.profiles ALTER COLUMN sponsor_user_id SET NOT NULL;
-- ALTER TABLE public.profiles ALTER COLUMN sponsor_code SET NOT NULL;
