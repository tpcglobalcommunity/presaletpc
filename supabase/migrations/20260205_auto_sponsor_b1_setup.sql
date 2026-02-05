-- Migration: 20260205_auto_sponsor_b1_setup.sql
-- Purpose: Setup for AUTO SPONSOR B1 implementation

-- 0) Safety
set search_path = public;

-- 1) Ensure profiles has required columns for sponsor selection
do $$
begin
  -- Add role column if not exists
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='role'
  ) then
    alter table public.profiles add column role text default 'member';
  end if;
  
  -- Add is_active column if not exists
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='is_active'
  ) then
    alter table public.profiles add column is_active boolean default true;
  end if;
  
  -- Ensure sponsor_user_id exists (from previous migration)
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='profiles' and column_name='sponsor_user_id'
  ) then
    alter table public.profiles add column sponsor_user_id uuid;
  end if;
end$$;

-- 2) Create referrals table for direct referrals tracking
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references public.profiles(user_id) on delete cascade,
  referred_user_id uuid not null references public.profiles(user_id) on delete cascade,
  created_at timestamptz default now(),
  reason text default 'MANUAL_REFERRAL',
  unique(referred_user_id) -- Each user can only have one sponsor
);

-- 3) Create indexes for performance
create index if not exists idx_referrals_sponsor_id on public.referrals(sponsor_id);
create index if not exists idx_referrals_referred_user_id on public.referrals(referred_user_id);
create index if not exists idx_profiles_role_active on public.profiles(role, is_active) where is_active = true;

-- 4) Create audit logs table for sponsor assignment tracking
create table if not exists public.sponsor_assignment_audit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  sponsor_id uuid not null,
  reason text not null,
  created_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

create index if not exists idx_sponsor_audit_user_id on public.sponsor_assignment_audit(user_id);
create index if not exists idx_sponsor_audit_created_at on public.sponsor_assignment_audit(created_at);

-- 5) Backfill existing sponsor relationships to referrals table
insert into public.referrals (sponsor_id, referred_user_id, reason)
select 
  p.sponsor_user_id,
  p.user_id,
  'AUTO_B1_BACKFILL'::text
from public.profiles p
where p.sponsor_user_id is not null
  and not exists (
    select 1 from public.referrals r 
    where r.referred_user_id = p.user_id
  )
on conflict (referred_user_id) do nothing;
