-- ============================================================================
-- SOLUSI TUNTAS: Recreate Tabel Profiles dengan Struktur Benar
-- ============================================================================
-- Jalankan SEMUA perintah ini secara berurutan di SQL Editor Supabase
-- WARNING: Backup data terlebih dahulu jika ada data penting!
-- ============================================================================

-- STEP 1: Hapus tabel profiles lama (HATI-HATI: ini menghapus semua data!)
-- Jika ingin menyimpan data, skip step ini dan gunakan ALTER TABLE saja
DROP TABLE IF EXISTS public.profiles CASCADE;

-- STEP 2: Buat ulang tabel profiles dengan struktur yang BENAR
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email_initial TEXT,
    email_current TEXT,
    member_code TEXT UNIQUE,
    referred_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- STEP 3: Buat index untuk performa
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_member_code ON public.profiles(member_code);
CREATE INDEX idx_profiles_email_current ON public.profiles(email_current);

-- STEP 4: Buat trigger untuk auto-populate email dari auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email_initial, email_current)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.email
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Attach trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 6: Sinkronisasi data existing dari auth.users ke profiles
INSERT INTO public.profiles (user_id, email_initial, email_current, member_code)
SELECT 
    u.id,
    u.email,
    u.email,
    'TPC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- STEP 7: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- STEP 8: Buat policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
CREATE POLICY "Service role can manage all profiles"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- STEP 9: Verifikasi struktur tabel
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
