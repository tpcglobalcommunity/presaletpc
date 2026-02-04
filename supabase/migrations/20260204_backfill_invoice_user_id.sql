-- BACKFILL USER_ID FOR LEGACY INVOICES
-- Update invoices with NULL user_id by matching email with auth.users

update public.invoices i
set user_id = u.id
from auth.users u
where i.user_id is null
  and lower(i.email) = lower(u.email);
