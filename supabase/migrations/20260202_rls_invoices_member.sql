-- Migration: 20260202_rls_invoices_member.sql
-- Enable RLS and lock invoices to member-only access

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Remove old broad policies (be safe)
DROP POLICY IF EXISTS "invoices_select_own" ON public.invoices;
DROP POLICY IF EXISTS "invoices_insert_own" ON public.invoices;
DROP POLICY IF EXISTS "invoices_update_own" ON public.invoices;

-- SELECT: authenticated user can only see invoices they own
CREATE POLICY "invoices_select_own"
ON public.invoices
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- INSERT: allow insert only if user_id = auth.uid()
CREATE POLICY "invoices_insert_own"
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- No UPDATE policy - force RPC for all updates
