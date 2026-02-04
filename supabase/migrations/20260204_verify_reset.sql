-- ============================================================
-- FULL DATA RESET - KEEP SUPER ADMIN ONLY
-- SUPER ADMIN UUID:
-- dfbbf71c-0a7c-43fb-bab0-d21f12b78b47
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
where user_id <> v_super_admin or sponsor_user_id <> v_super_admin;

delete from public.commissions
where user_id <> v_super_admin;

-- Commission ledger (if exists)
delete from public.commission_ledger
where user_id <> v_super_admin or source_user_id <> v_super_admin;

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

-- ============================================================
-- 5. VERIFICATION
-- ============================================================

-- Check super admin still exists
select 
  'AUTH USERS' as table_name,
  count(*) as row_count,
  array_agg(email) as emails
from auth.users
where id = v_super_admin
group by 'AUTH USERS';

-- Check super admin profile still exists
select 
  'PROFILES' as table_name,
  count(*) as row_count,
  array_agg(email) as emails,
  array_agg(role) as roles
from public.profiles
where user_id = v_super_admin
group by 'PROFILES';

-- Check all other data is gone (safe generic)
select 
  table_name,
  row_count
from (
  select 'invoices' as table_name, count(*) as row_count from public.invoices where user_id <> v_super_admin
  union all
  select 'profiles' as table_name, count(*) as row_count from public.profiles where user_id <> v_super_admin
  union all
  select 'auth.users' as table_name, count(*) as row_count from auth.users where id <> v_super_admin
  union all
  select 'referrals' as table_name, count(*) as row_count from public.referrals
  union all
  select 'withdrawals' as table_name, count(*) as row_count from public.withdrawals
  union all
  select 'commission_ledger' as table_name, count(*) as row_count from public.commission_ledger
  union all
  select 'member_settings' as table_name, count(*) as row_count from public.member_settings
) table_counts
order by table_name;
