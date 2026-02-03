-- Migration: Create public RPC to validate member code safely
-- Purpose: Bypass RLS for member code validation while maintaining security
-- File: 20260204_public_validate_member_code.sql

create or replace function public.public_validate_member_code(p_code text)
returns table(id uuid, member_code text)
language sql
security definer
set search_path = public
as $$
  select p.id, p.member_code
  from public.profiles p
  where p.member_code = upper(trim(p_code))
  limit 1;
$$;

-- Grant execute permissions for public access
grant execute on function public.public_validate_member_code(text) to anon, authenticated;

-- Add comment for documentation
comment on function public.public_validate_member_code is 'Public RPC to validate member codes safely, bypassing RLS while maintaining security';
