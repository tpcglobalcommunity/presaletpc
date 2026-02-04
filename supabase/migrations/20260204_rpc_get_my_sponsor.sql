drop function if exists public.get_my_sponsor();

create or replace function public.get_my_sponsor()
returns table (
  sponsor_user_id uuid,
  sponsor_code text
)
language sql
security definer
set search_path = public
as $$
  select sponsor_user_id, sponsor_code
  from public.profiles
  where user_id = auth.uid()
  limit 1;
$$;

revoke all on function public.get_my_sponsor() from public;
grant execute on function public.get_my_sponsor() to authenticated;

do $$
begin
  perform pg_notify('pgrst','reload schema');
exception when others then null;
end$$;
