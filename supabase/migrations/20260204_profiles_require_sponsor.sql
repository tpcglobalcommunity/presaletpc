-- =========================================================
-- PROFILES: SPONSOR IS MANDATORY
-- =========================================================

-- 1) Pastikan kolom ada
alter table public.profiles
add column if not exists member_code text,
add column if not exists sponsor_user_id uuid,
add column if not exists sponsor_code text;

-- 2) member_code harus unik (dipakai sebagai referral code)
create unique index if not exists profiles_member_code_uidx
on public.profiles(member_code);

-- 3) Index sponsor
create index if not exists profiles_sponsor_user_id_idx
on public.profiles(sponsor_user_id);

-- 4) HARD RULE (DITUNDA JIKA DATA LAMA BELUM BERSIH)
-- Jangan aktifkan dulu jika masih ada user lama tanpa sponsor
-- Setelah cleanup, AKTIFKAN:
-- alter table public.profiles alter column sponsor_user_id set not null;
-- alter table public.profiles alter column sponsor_code set not null;
