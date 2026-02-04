-- ============================================================
-- HARDEN PROFILES RLS POLICIES
-- ============================================================

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop overly permissive policies if exist (best-effort)
do $$
begin
  -- drop known policy names if exist (ignore errors)
  begin execute 'drop policy if exists "profiles_select_all" on public.profiles'; exception when others then null; end;
  begin execute 'drop policy if exists "profiles_read_all" on public.profiles'; exception when others then null; end;
  begin execute 'drop policy if exists "profiles_all" on public.profiles'; exception when others then null; end;
  begin execute 'drop policy if exists "Users can view their own profile" on public.profiles'; exception when others then null; end;
  begin execute 'drop policy if exists "Users can update their own profile" on public.profiles'; exception when others then null; end;
  begin execute 'drop policy if exists "Users can insert their own profile" on public.profiles'; exception when others then null; end;
end $$;

-- 1) Users can select their own profile
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

-- 2) Users can update their own profile (non-sensitive columns)
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
)
with check (
  user_id = auth.uid()
  or public.is_admin()
);

-- 3) Users can insert their own profile (ensureProfile)
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
  user_id = auth.uid()
  or public.is_admin()
);
