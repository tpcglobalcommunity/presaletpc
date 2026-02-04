-- =========================================================
-- FIX admin_list_users RPC
-- Drop + Recreate to resolve ERROR 42P13
-- =========================================================

-- 1) DROP function lama (return type tidak boleh diubah langsung)
drop function if exists public.admin_list_users(integer, integer);

-- 2) CREATE ulang dengan return type yang BENAR
create or replace function public.admin_list_users(
  p_limit int default 200,
  p_offset int default 0
)
returns table (
  user_id uuid,
  email_initial text,
  display_name text,
  avatar_url text,
  created_at timestamptz,
  auth_email text,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Access denied: Admin access required';
  end if;

  return query
  select
    au.id as user_id,
    coalesce(p.email, au.email, '') as email_initial,
    coalesce(p.nama, null) as display_name,
    p.avatar_url,
    coalesce(p.created_at, au.created_at) as created_at,
    au.email as auth_email,
    au.last_sign_in_at
  from auth.users au
  left join public.profiles p
    on p.user_id = au.id
  order by coalesce(p.created_at, au.created_at) desc
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
end;
$$;

-- 3) Permissions
revoke all on function public.admin_list_users(int, int) from public;
grant execute on function public.admin_list_users(int, int) to authenticated;

-- 4) Reload PostgREST schema cache
do $$
begin
  perform pg_notify('pgrst', 'reload schema');
exception when others then
  null;
end$$;
