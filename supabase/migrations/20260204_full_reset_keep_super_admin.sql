-- ============================================================
-- FULL DATA RESET - KEEP SUPER ADMIN ONLY (SUPABASE COMPAT)
-- SUPER ADMIN UUID:
-- dfbbf71c-0a7c-43fb-bab0-d21f12b78b47
-- ============================================================

begin;

do $$
declare
  v_super_admin uuid := 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';
begin
  -- ============================================================
  -- 1) DELETE CHILD TABLES FIRST (FK-safe order)
  -- ============================================================

  if to_regclass('public.invoices') is not null then
    execute format('delete from public.invoices where user_id <> %L::uuid', v_super_admin);
  end if;

  if to_regclass('public.withdrawals') is not null then
    execute format('delete from public.withdrawals where user_id <> %L::uuid', v_super_admin);
  end if;

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

  if to_regclass('public.commissions') is not null then
    execute format('delete from public.commissions where user_id <> %L::uuid', v_super_admin);
  end if;

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

  if to_regclass('public.audit_logs') is not null then
    execute format('delete from public.audit_logs where user_id <> %L::uuid', v_super_admin);
  end if;

  if to_regclass('public.member_settings') is not null then
    execute format('delete from public.member_settings where user_id <> %L::uuid', v_super_admin);
  end if;

  -- ============================================================
  -- 2) PROFILES: KEEP ONLY SUPER ADMIN
  -- ============================================================
  if to_regclass('public.profiles') is not null then
    execute format('delete from public.profiles where user_id <> %L::uuid', v_super_admin);

    update public.profiles
    set role = 'super_admin'
    where user_id = v_super_admin;
  end if;

  -- ============================================================
  -- 3) AUTH USERS: KEEP ONLY SUPER ADMIN (may fail if no privilege)
  -- ============================================================
  begin
    execute format('delete from auth.users where id <> %L::uuid', v_super_admin);
  exception when others then
    null;
  end;

end $$;

commit;

-- ============================================================
-- VERIFICATION (SAFE, NO MISSING TABLE REFERENCES)
-- ============================================================

-- Must exist: super admin auth user
select
  'auth.users(super admin)' as check_name,
  count(*) as row_count,
  array_agg(email) as emails
from auth.users
where id = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';

-- Must exist: super admin profile
select
  'public.profiles(super admin)' as check_name,
  count(*) as row_count,
  array_agg(email) as emails,
  array_agg(role) as roles
from public.profiles
where user_id = 'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47';

-- Optional counts: dynamic SQL so missing tables won't error
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
    'public.member_settings'
  ]
  loop
    if to_regclass(t) is not null then
      execute format('select count(*) from %s', t) into cnt;
      raise notice '%: % rows', t, cnt;
    else
      raise notice '%: (table not found)', t;
    end if;
  end loop;
end $$;
