-- ============================================================
-- FULL DATA RESET - KEEP SUPER ADMIN ONLY
-- SUPER ADMIN UUID:
-- dfbbf71c-0a7c-43fb-bab0-d21f12b78b47
-- ============================================================

begin;

do $$
declare
  v_super_admin uuid := 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';
begin
  -- ============================================================
  -- 1) DELETE APPLICATION DATA (ORDER MATTERS)
  -- ============================================================

  -- invoices
  if to_regclass('public.invoices') is not null then
    execute format('delete from public.invoices where user_id <> %L::uuid', v_super_admin);
  end if;

  -- withdrawals (optional)
  if to_regclass('public.withdrawals') is not null then
    execute format('delete from public.withdrawals where user_id <> %L::uuid', v_super_admin);
  end if;

  -- referrals (optional, columns may vary)
  if to_regclass('public.referrals') is not null then
    begin
      execute format(
        'delete from public.referrals where user_id <> %L::uuid or sponsor_user_id <> %L::uuid',
        v_super_admin, v_super_admin
      );
    exception when others then
      null;
    end;
  end if;

  -- commissions (optional)
  if to_regclass('public.commissions') is not null then
    execute format('delete from public.commissions where user_id <> %L::uuid', v_super_admin);
  end if;

  -- commission_ledger (optional, columns may vary)
  if to_regclass('public.commission_ledger') is not null then
    begin
      execute format(
        'delete from public.commission_ledger where user_id <> %L::uuid or source_user_id <> %L::uuid',
        v_super_admin, v_super_admin
      );
    exception when others then
      null;
    end;
  end if;

  -- audit_logs (optional)
  if to_regclass('public.audit_logs') is not null then
    execute format('delete from public.audit_logs where user_id <> %L::uuid', v_super_admin);
  end if;

  -- member_settings (optional)
  if to_regclass('public.member_settings') is not null then
    execute format('delete from public.member_settings where user_id <> %L::uuid', v_super_admin);
  end if;

  -- ============================================================
  -- 2) PROFILES (KEEP SUPER ADMIN)
  -- ============================================================
  if to_regclass('public.profiles') is not null then
    execute format('delete from public.profiles where user_id <> %L::uuid', v_super_admin);

    update public.profiles
    set role = 'super_admin'
    where user_id = v_super_admin;
  end if;

  -- ============================================================
  -- 3) AUTH USERS (KEEP SUPER ADMIN) - may fail if no privilege
  -- ============================================================
  begin
    execute format('delete from auth.users where id <> %L::uuid', v_super_admin);
  exception when others then
    null;
  end;

end $$;

commit;

-- ============================================================
-- VERIFICATION (SAFE)
-- - no DO variables here
-- - no missing table references
-- ============================================================

-- Super admin auth user must exist
select
  'AUTH USERS (super admin)' as check_name,
  count(*) as row_count,
  array_agg(email) as emails
from auth.users
where id = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';

-- Super admin profile must exist
select
  'PROFILES (super admin)' as check_name,
  count(*) as row_count,
  array_agg(email) as emails,
  array_agg(role) as roles
from public.profiles
where user_id = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';

-- Optional counts (dynamic, won't error if table missing)
do $$
declare
  t text;
  cnt bigint;
begin
  foreach t in array array[
    'public.invoices',
    'public.withdrawals',
    'public.referrals',
    'public.commissions',
    'public.commission_ledger',
    'public.audit_logs',
    'public.member_settings',
    'public.profiles'
  ]
  loop
    if to_regclass(t) is not null then
      execute format('select count(*) from %s', t) into cnt;
      raise notice '% => % rows', t, cnt;
    else
      raise notice '% => (table not found)', t;
    end if;
  end loop;

  -- Also verify no other auth users if privileges allow reading
  begin
    execute 'select count(*) from auth.users' into cnt;
    raise notice 'auth.users => % rows (should be 1)', cnt;
  exception when others then
    raise notice 'auth.users => (no privilege to count)';
  end;
end $$;
