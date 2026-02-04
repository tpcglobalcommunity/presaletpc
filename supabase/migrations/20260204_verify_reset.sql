-- ============================================================
-- VERIFICATION SCRIPT - POST RESET CHECK
-- ============================================================

-- Check super admin still exists
select 
  'AUTH USERS' as table_name,
  count(*) as row_count,
  array_agg(email) as emails
from auth.users
where id = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'
group by 'AUTH USERS';

-- Check super admin profile still exists
select 
  'PROFILES' as table_name,
  count(*) as row_count,
  array_agg(email) as emails,
  array_agg(role) as roles
from public.profiles
where user_id = 'dfbbf71c-0a7c-43fb-bab0-ditu21f12b78b47'
group by 'PROFILES';

-- Check all other data is gone
select 
  'INVOICES' as table_name,
  count(*) as row_count
from public.invoices
where user_id <> 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';

select 
  'PROFILES (non-admin)' as table_name,
  count(*) as row_count
from public.profiles
where user_id <> 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';

-- Check if tables still exist (should return data)
select 
  table_name,
  row_count
from (
  select 'invoices' as table_name, count(*) as row_count from public.invoices where user_id <> 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'
  union all
  select 'profiles' as table_name, count(*) as row_count from public.profiles where user_id <> 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'
  union all
  select 'auth.users' as table_name, count(*) as row_count from auth.users where id <> 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'
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
