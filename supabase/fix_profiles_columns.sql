-- Fix: Tambah kolom yang missing di tabel profiles
-- Jalankan ini di SQL Editor Supabase

-- 1. Tambah kolom email_initial jika belum ada
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_initial TEXT;

-- 2. Tambah kolom email_current jika belum ada  
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_current TEXT;

-- 3. Tambah kolom member_code jika belum ada
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS member_code TEXT UNIQUE;

-- 4. Tambah kolom referred_by jika belum ada
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- 5. Pastikan kolom user_id ada dan indexed
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_member_code ON public.profiles(member_code);

-- 6. Update data existing: isi email_current dari auth.users jika kosong
UPDATE public.profiles p
SET email_current = u.email
FROM auth.users u
WHERE p.user_id = u.id 
AND (p.email_current IS NULL OR p.email_current = '');

-- 7. Update data existing: generate member_code jika kosong
UPDATE public.profiles
SET member_code = 'TPC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
WHERE member_code IS NULL OR member_code = '';
