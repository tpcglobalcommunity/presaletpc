-- ============================================================
-- FULL DATA RESET - KEEP SUPER ADMIN ONLY
-- SUPER ADMIN UUID:
-- dfbbf71c-0a7c-43fb-bab0-d21f12b78b47
-- ============================================================

begin;

-- ============================================================
-- 1. DEFINE SUPER ADMIN UUID
-- ============================================================
do $$
declare
  v_super_admin uuid := 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';
begin

-- ============================================================
-- 2. DELETE APPLICATION DATA (ORDER MATTERS)
-- ============================================================

-- Invoices & payments
delete from public.invoices
where user_id <> v_super_admin;

-- Withdrawals (if exists)
delete from public.withdrawals
where user_id <> v_super_admin;

-- Referral / commission tables (adjust names if needed)
delete from public.referrals
where user_id <> v_super_admin
   or sponsor_user_id <> v_super_admin;

delete from public.commissions
where user_id <> v_super_admin;

-- Commission ledger (if exists)
delete from public.commission_ledger
where user_id <> v_super_admin
   or source_user_id <> v_super_admin;

-- Audit / logs
delete from public.audit_logs
where user_id <> v_super_admin;

-- Any other member-only tables (SAFE GENERIC)
delete from public.member_settings
where user_id <> v_super_admin;

-- ============================================================
-- 3. CLEAN PROFILES (KEEP SUPER ADMIN)
-- ============================================================
delete from public.profiles
where user_id <> v_super_admin;

-- Ensure super admin role is correct
update public.profiles
set role = 'super_admin'
where user_id = v_super_admin;

-- ============================================================
-- 4. CLEAN AUTH USERS (KEEP SUPER ADMIN)
-- ============================================================
delete from auth.users
where id <> v_super_admin;

end $$;

commit;
