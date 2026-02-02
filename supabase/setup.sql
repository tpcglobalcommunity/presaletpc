-- Complete database setup for TPC Gateway
-- Run this script in Supabase SQL Editor

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

-- 2. Tabel Invoices dengan semua field
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT,
    referral_code TEXT,
    status TEXT DEFAULT 'UNPAID',
    amount_input NUMERIC,
    amount_usd NUMERIC,
    base_currency TEXT,
    invoice_no TEXT UNIQUE,
    proof_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    review_note TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by TEXT,
    tpc_amount NUMERIC,
    transfer_method TEXT,
    wallet_tpc TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Fungsi Pembuat Kode Member
CREATE OR REPLACE FUNCTION public.generate_member_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TPC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- 4. Fungsi Pembuat Nomor Invoice
CREATE OR REPLACE FUNCTION public.generate_invoice_no()
RETURNS TEXT AS $$
BEGIN
    RETURN 'INV-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
END;
$$ LANGUAGE plpgsql;

-- 5. Indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_invoices_email ON public.invoices(email);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_member_code ON public.profiles(member_code);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own invoices
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert invoices with their email
CREATE POLICY "Users can insert invoices" ON public.invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Super admin can access all data
CREATE POLICY "Super admin full access" ON public.profiles
    FOR ALL USING (auth.uid() = '518694f6-bb50-4724-b4a5-77ad30152e0e');

CREATE POLICY "Super admin full access invoices" ON public.invoices
    FOR ALL USING (auth.uid() = '518694f6-bb50-4724-b4a5-77ad30152e0e');

-- 8. Create admin user (optional - uncomment if needed)
-- INSERT INTO auth.users (id, email, email_confirmed_at)
-- VALUES ('518694f6-bb50-4724-b4a5-77ad30152e0e', 'admin@tpc-gateway.com', now())
-- ON CONFLICT (id) DO NOTHING;

-- 9. Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.invoices TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.invoices TO anon;
