-- PHASE 1: CREATE CANONICAL ADMIN CHECK FUNCTION (DB)
-- Single source of truth for admin validation in database

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null
  and auth.uid()::uuid in (
    '518694f6-bb50-4724-b4a5-77ad30152e0e',
    'dfbbf71c-0a7c-43fb-bab0-d21f12b78b47'
  );
$$;

-- Grant execution for authenticated users
grant execute on function public.is_admin() to authenticated;
