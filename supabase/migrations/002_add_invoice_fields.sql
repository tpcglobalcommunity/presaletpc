-- Add additional fields to invoices table based on types.ts
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS amount_input NUMERIC,
ADD COLUMN IF NOT EXISTS amount_usd NUMERIC,
ADD COLUMN IF NOT EXISTS base_currency TEXT,
ADD COLUMN IF NOT EXISTS invoice_no TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS proof_url TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS review_note TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
ADD COLUMN IF NOT EXISTS tpc_amount NUMERIC,
ADD COLUMN IF NOT EXISTS transfer_method TEXT,
ADD COLUMN IF NOT EXISTS wallet_tpc TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_no()
RETURNS TEXT AS $$
BEGIN
    RETURN 'INV-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_email ON public.invoices(email);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_member_code ON public.profiles(member_code);
