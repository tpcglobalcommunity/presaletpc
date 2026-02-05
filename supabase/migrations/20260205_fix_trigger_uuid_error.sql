-- Migration: 20260205_fix_trigger_uuid_error.sql
-- Purpose: Fix UUID error by removing problematic trigger that references non-existent field
-- Safety: Idempotent, production-safe

-- 0) Safety
set search_path = public;

-- 1) Drop problematic trigger that references non-existent field
drop trigger if exists trg_profiles_sync_sponsor_user_id on public.profiles;

-- 2) Drop problematic function that references non-existent field
drop function if exists public._profiles_sync_sponsor_user_id();

-- 3) Verify fix
do $$
begin
  if exists (select 1 from pg_trigger where tgname = 'trg_profiles_sync_sponsor_user_id') then
    raise notice '❌ ERROR: Trigger still exists - manual cleanup may be required';
  else
    raise notice '✅ SUCCESS: Problematic trigger removed';
  end if;
  
  if exists (select 1 from pg_proc where proname = '_profiles_sync_sponsor_user_id' and pronamespace = (select oid from pg_namespace where nspname = 'public')) then
    raise notice '❌ ERROR: Function still exists - manual cleanup may be required';
  else
    raise notice '✅ SUCCESS: Problematic function removed';
  end if;
end $$;
