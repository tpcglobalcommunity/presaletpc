-- Manual Admin Setup
-- Ganti 'YOUR_USER_ID' dengan user ID Anda

-- 1. Update environment variable di .env:
-- VITE_SUPER_ADMIN_UUID="YOUR_USER_ID"

-- 2. Atau jalankan query ini untuk testing:
-- UPDATE public.profiles 
-- SET user_id = '518694f6-bb50-4724-b4a5-77ad30152e0e' 
-- WHERE email_current = 'email@gmail.com';

-- 3. Check admin status:
SELECT auth.uid() as current_user_id, 
       (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1) as profile_id;

-- 4. Test admin function:
SELECT * FROM public.is_super_admin();
