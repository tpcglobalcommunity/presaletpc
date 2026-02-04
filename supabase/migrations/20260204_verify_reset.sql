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
do $$
begin
  delete from public.withdrawals where user_id <> v_super_admin;
exception when others then null;
end $$;

-- Referral / commission tables (adjust names if needed)
do $$
begin
  delete from public.referrals where user_id <> v_super_admin or sponsor_user_id <> v_super_admin;
exception when others then null;
end $$;

do $$
begin
  delete from public.commissions where user_id <> v_super_admin;
exception when others then null;
end $$;

-- Commission ledger (if exists)
do $$
begin
  delete from public.commission_ledger where user_id <> v_super_admin or source_user_id <> v_super_admin;
exception when others then null;
end $$;

-- Audit / logs
do $$
begin
  delete from public.audit_logs where user_id <> v_super_admin;
exception when others then null;
end $$;

-- Any other member-only tables (SAFE GENERIC)
do $$
begin
  delete from public.member_settings where user_id <> v_super_admin;
exception when others then null;
end $$;

-- ============================================================
-- 3. CLEAN PROFILES (KEEP SUPER ADMIN)
-- ============================================================
do $$
begin
  delete from public.profiles where user_id <> v_super_admin;
exception when others then null;
end $$;

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

-- ============================================================
-- 6. POST-RESET LOCK (REKOMENDASI KERAS)
-- ============================================================

-- Nonaktifkan registrasi sementara
-- Admin-only access mode
-- Soft-launch mode
-- Maintenance banner
-- Monitoring checklist
-- Recovery plan siapkan perlu

-- ============================================================
