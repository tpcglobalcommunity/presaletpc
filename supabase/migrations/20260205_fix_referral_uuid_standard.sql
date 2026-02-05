-- Migration: 20260205_fix_referral_uuid_standard.sql
-- Purpose: Standardize referral to use UUID instead of TEXT for type safety

-- 0) Safety
set search_path = public;

-- 1) Tambah kolom sponsor_user_id (UUID) untuk standar baru
alter table public.profiles
  add column if not exists sponsor_user_id uuid;

-- 2) Pastikan member_code ada dan unik (dipakai sebagai kode sponsor)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='member_code'
  ) then
    alter table public.profiles add column member_code text;
  end if;
end$$;

-- Optional: unique index member_code jika belum ada
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname='public' and tablename='profiles' and indexname='profiles_member_code_key'
  ) then
    create unique index profiles_member_code_key on public.profiles(member_code)
    where member_code is not null;
  end if;
end$$;

-- 3) BACKFILL sponsor_user_id dari referred_by(text) -> profiles.user_id(uuid)
update public.profiles p
set sponsor_user_id = s.user_id
from public.profiles s
where p.sponsor_user_id is null
  and p.referred_by is not null
  and s.member_code is not null
  and s.member_code = p.referred_by::text;

-- 4) Trigger helper: setiap insert/update referred_by -> otomatis isi sponsor_user_id
create or replace function public._profiles_sync_sponsor_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sponsor_user_id uuid;
begin
  if new.referred_by is null or new.referred_by = '' then
    new.sponsor_user_id := null;
    return new;
  end if;

  select user_id into v_sponsor_user_id
  from public.profiles
  where member_code = new.referred_by::text
  limit 1;

  new.sponsor_user_id := v_sponsor_user_id;
  return new;
end;
$$;

drop trigger if exists trg_profiles_sync_sponsor_user_id on public.profiles;
create trigger trg_profiles_sync_sponsor_user_id
before insert or update of referred_by
on public.profiles
for each row
execute function public._profiles_sync_sponsor_user_id();

-- 5) RPC: get_referral_stats() dengan UUID type-safe
drop function if exists public.get_referral_stats();

create or replace function public.get_referral_stats()
returns table (
  total_downline bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  return query
  select count(*)
  from public.profiles p
  where p.sponsor_user_id = v_user_id;
end;
$$;

-- 6) RPC: get_referral_direct_financial_stats() dengan UUID type-safe
drop function if exists public.get_referral_direct_financial_stats();

create or replace function public.get_referral_direct_financial_stats()
returns table (
  total_invoice bigint,
  total_tpc numeric,
  total_commission numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  return query
  select
    count(i.id) as total_invoice,
    coalesce(sum(i.tpc_amount), 0) as total_tpc,
    coalesce(sum(i.sponsor_bonus_tpc), 0) as total_commission
  from public.invoices i
  join public.profiles buyer on buyer.user_id = i.user_id
  where buyer.sponsor_user_id = v_user_id
    and i.status = 'PAID';
end;
$$;

-- 7) Grant permissions
grant execute on function public.get_referral_stats() to authenticated;
grant execute on function public.get_referral_direct_financial_stats() to authenticated;

-- 8) Add index for performance
create index if not exists idx_profiles_sponsor_user_id on public.profiles(sponsor_user_id) where sponsor_user_id is not null;
