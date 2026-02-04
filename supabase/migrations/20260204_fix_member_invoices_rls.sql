-- Migration: 20260204_fix_member_invoices_rls.sql
-- Purpose: Fix RLS policies to use email instead of user_id for invoice access
-- Safety: Updates existing policies to match create_invoice_locked implementation

-- Drop existing policies that use user_id
DROP POLICY IF EXISTS "invoices_select_own" ON public.invoices;
DROP POLICY IF EXISTS "invoices_insert_own" ON public.invoices;

-- CREATE POLICY: member boleh lihat invoice miliknya (by email)
CREATE POLICY "member_select_own_invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (
  email = auth.jwt() ->> 'email'
);

-- CREATE POLICY: member boleh insert invoice (for completeness, though RPC handles this)
CREATE POLICY "member_insert_own_invoices"
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (
  email = auth.jwt() ->> 'email'
);

-- Optional: Admin policy (if is_admin function exists)
-- Note: This assumes there's an is_admin() function, adjust if needed
DO $$
BEGIN
  -- Check if is_admin function exists before creating admin policy
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'is_admin' 
    AND pronamespace = 'public'::regnamespace
  ) THEN
    DROP POLICY IF EXISTS "admin_select_all_invoices" ON public.invoices;
    
    CREATE POLICY "admin_select_all_invoices"
    ON public.invoices
    FOR SELECT
    TO authenticated
    USING (
      public.is_admin()
    );
  END IF;
END $$;
