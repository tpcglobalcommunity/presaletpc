-- Create Super Admin Profile for tpcglobal.io@gmail.com
-- User ID: 518694f6-bb50-4724-b4a5-77ad30152e0e

-- 1. Delete existing admin profile if exists
DELETE FROM public.profiles 
WHERE user_id = '518694f6-bb50-4724-b4a5-77ad30152e0e';

-- 2. Insert admin profile
INSERT INTO public.profiles (
    id,
    user_id,
    email_initial,
    email_current,
    member_code,
    referred_by,
    created_at
) VALUES (
    '518694f6-bb50-4724-b4a5-77ad30152e0e',
    '518694f6-bb50-4724-b4a5-77ad30152e0e',
    'tpcglobal.io@gmail.com',
    'tpcglobal.io@gmail.com',
    'TPC-ADMIN',
    NULL,
    NOW()
);

-- 3. Verify admin creation
SELECT * FROM public.profiles 
WHERE user_id = '518694f6-bb50-4724-b4a5-77ad30152e0e';

-- 4. Test admin function
SELECT public.is_super_admin();
