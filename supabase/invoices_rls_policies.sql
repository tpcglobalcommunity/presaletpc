-- ============================================================
-- RLS POLICIES: public.invoices
-- Member can read own invoices (user_id primary, email fallback)
-- Admin can read all invoices via public.is_admin()
-- ============================================================

-- 1) Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 2) Drop old policies (safe)
DROP POLICY IF EXISTS "member_read_own_invoices" ON public.invoices;
DROP POLICY IF EXISTS "admin_read_all_invoices" ON public.invoices;
DROP POLICY IF EXISTS "member_update_own_invoices" ON public.invoices;
DROP POLICY IF EXISTS "admin_update_all_invoices" ON public.invoices;
DROP POLICY IF EXISTS "admin_delete_invoices" ON public.invoices;

-- 3) MEMBER: read own invoices
-- primary: user_id = auth.uid()
-- fallback: email = auth.jwt()->>'email' (temporary safety for legacy rows)
CREATE POLICY "member_read_own_invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR (
    user_id IS NULL
    AND email IS NOT NULL
    AND email = (auth.jwt() ->> 'email')
  )
);

-- 4) ADMIN: read all invoices (no table dependency)
CREATE POLICY "admin_read_all_invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (
  public.is_admin()
);

-- 5) MEMBER: update own invoices (for proof upload, status changes)
CREATE POLICY "member_update_own_invoices"
ON public.invoices
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR (
    user_id IS NULL
    AND email IS NOT NULL
    AND email = (auth.jwt() ->> 'email')
  )
)
WITH CHECK (
  user_id = auth.uid()
  OR (
    user_id IS NULL
    AND email IS NOT NULL
    AND email = (auth.jwt() ->> 'email')
  )
);

-- 6) ADMIN: update all invoices
CREATE POLICY "admin_update_all_invoices"
ON public.invoices
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);

-- 7) ADMIN: delete invoices (system cleanup)
CREATE POLICY "admin_delete_invoices"
ON public.invoices
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);

-- 8) No INSERT policies (system only)
-- Invoices should only be created by backend/system functions
