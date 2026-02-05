-- RLS Policies for Invoices Table
-- Member can read own invoices (user_id primary, email fallback)

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "member_read_own_invoices" ON public.invoices;
DROP POLICY IF EXISTS "admin_read_all_invoices" ON public.invoices;
DROP POLICY IF EXISTS "member_update_own_invoices" ON public.invoices;

-- Member can read own invoices
CREATE POLICY "member_read_own_invoices"
ON public.invoices
FOR SELECT
USING (
  user_id = auth.uid()
  OR (email = auth.jwt() ->> 'email' AND user_id IS NULL)
);

-- Admin can read all invoices
CREATE POLICY "admin_read_all_invoices"
ON public.invoices
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE is_active = true
  )
);

-- Member can update own invoices (for proof upload, etc.)
CREATE POLICY "member_update_own_invoices"
ON public.invoices
FOR UPDATE
USING (
  user_id = auth.uid()
  OR (email = auth.jwt() ->> 'email' AND user_id IS NULL)
)
WITH CHECK (
  user_id = auth.uid()
  OR (email = auth.jwt() ->> 'email' AND user_id IS NULL)
);

-- Admin can update all invoices
CREATE POLICY "admin_update_all_invoices"
ON public.invoices
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE is_active = true
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE is_active = true
  )
);

-- Member cannot insert invoices (system only)
-- Admin cannot insert invoices (system only)

-- Member cannot delete invoices (system only)
-- Admin can delete invoices
CREATE POLICY "admin_delete_invoices"
ON public.invoices
FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users WHERE is_active = true
  )
);
