-- Fix function search path for generate_invoice_no
CREATE OR REPLACE FUNCTION public.generate_invoice_no()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix function search path for generate_member_code
CREATE OR REPLACE FUNCTION public.generate_member_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Drop and recreate invoice insert policy with proper restriction
DROP POLICY IF EXISTS "Anyone can create invoice" ON public.invoices;
CREATE POLICY "Anyone can create invoice with valid data"
  ON public.invoices FOR INSERT
  WITH CHECK (
    email IS NOT NULL 
    AND referral_code IS NOT NULL 
    AND amount_input > 0 
    AND status = 'UNPAID'
  );