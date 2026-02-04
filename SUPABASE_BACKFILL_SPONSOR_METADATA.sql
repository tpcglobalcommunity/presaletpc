-- 1) pastikan semua profiles punya sponsor (jalankan assign via app jika perlu)
-- 2) sync sponsor dari profiles ke auth metadata

update auth.users au
set raw_user_meta_data =
  coalesce(au.raw_user_meta_data, '{}'::jsonb)
  || jsonb_build_object(
    'sponsor_code', p.sponsor_code,
    'sponsor_user_id', p.sponsor_user_id::text
  )
from public.profiles p
where p.user_id = au.id
  and p.sponsor_user_id is not null
  and p.sponsor_code is not null;
