-- Create enum for invoice status
CREATE TYPE public.invoice_status AS ENUM ('UNPAID', 'PENDING_REVIEW', 'PAID', 'EXPIRED', 'CANCELLED');

-- Create enum for payment currency
CREATE TYPE public.payment_currency AS ENUM ('IDR', 'USDC', 'SOL');

-- Create enum for transfer method
CREATE TYPE public.transfer_method AS ENUM ('USDC', 'SOL', 'BCA', 'OVO');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_initial TEXT NOT NULL,
  email_current TEXT NOT NULL,
  member_code TEXT NOT NULL UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  base_currency payment_currency NOT NULL,
  amount_input NUMERIC NOT NULL,
  amount_usd NUMERIC NOT NULL,
  tpc_amount NUMERIC NOT NULL,
  status invoice_status NOT NULL DEFAULT 'UNPAID',
  transfer_method transfer_method,
  wallet_tpc TEXT,
  proof_url TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Security definer function for admin check
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id = '518694f6-bb50-4724-b4a5-77ad30152e0e'::UUID
$$;

-- Profile policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Invoice policies
CREATE POLICY "Anyone can create invoice"
  ON public.invoices FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own invoices"
  ON public.invoices FOR SELECT
  USING (
    auth.uid() = user_id 
    OR email = (SELECT email_current FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_super_admin(auth.uid())
  );

CREATE POLICY "Users can update own unpaid invoices"
  ON public.invoices FOR UPDATE
  USING (
    (auth.uid() = user_id AND status IN ('UNPAID', 'PENDING_REVIEW'))
    OR public.is_super_admin(auth.uid())
  );

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_no()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_no TEXT;
  prefix TEXT;
  seq_num INTEGER;
BEGIN
  prefix := 'TPC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_no FROM LENGTH(prefix) + 1) AS INTEGER)), 0) + 1
  INTO seq_num
  FROM public.invoices
  WHERE invoice_no LIKE prefix || '%';
  new_no := prefix || LPAD(seq_num::TEXT, 4, '0');
  RETURN new_no;
END;
$$;

-- Function to generate member code
CREATE OR REPLACE FUNCTION public.generate_member_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i INTEGER;
BEGIN
  LOOP
    new_code := 'M-';
    FOR i IN 1..6 LOOP
      new_code := new_code || SUBSTR(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INTEGER, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE member_code = new_code);
  END LOOP;
  RETURN new_code;
END;
$$;

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for proof uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('proofs', 'proofs', false);

-- Storage policies
CREATE POLICY "Authenticated users can upload proofs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own proofs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'proofs' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_super_admin(auth.uid())));

CREATE POLICY "Admin can view all proofs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'proofs' AND public.is_super_admin(auth.uid()));