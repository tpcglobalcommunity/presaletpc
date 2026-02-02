-- 1. Tabel Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_initial TEXT,
    email_current TEXT,
    member_code TEXT UNIQUE,
    referred_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabel Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    referral_code TEXT,
    status TEXT DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Fungsi Pembuat Kode Member (Fix RPC 404)
CREATE OR REPLACE FUNCTION public.generate_member_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TPC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;
