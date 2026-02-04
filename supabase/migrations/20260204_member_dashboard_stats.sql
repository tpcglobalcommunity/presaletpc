-- MEMBER DASHBOARD STATS (secure, fast)
-- returns: total_invoice, total_tpc_bought, total_referral_bonus_tpc

create or replace function public.member_get_dashboard_stats()
returns table (
  total_invoice bigint,
  total_tpc_bought numeric,
  total_referral_bonus_tpc numeric
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- total invoice = semua invoice milik user
  select
    count(*)::bigint
  into total_invoice
  from public.invoices
  where user_id = auth.uid();

  -- total TPC dibeli = hanya invoice yang benar-benar sukses
  -- (PAID) -> sesuaikan jika kamu pakai status lain untuk "approved"
  select
    coalesce(sum(tpc_amount), 0)
  into total_tpc_bought
  from public.invoices
  where user_id = auth.uid()
    and status = 'PAID';

  -- bonus referral:
  -- ✅ Jika kamu sudah punya kolom bonus di invoices, pakai itu.
  -- Aku buat robust: coba hitung dari invoices.sponsor_bonus_tpc kalau ada.
  -- Kalau kolom belum ada, result tetap 0 (via exception handler tidak bisa di SQL),
  -- jadi kita rekomendasikan bikin kolom/ table bonus. (lihat catatan di bawah)

  -- OPSI A (recommended): kamu punya table referral_earnings(user_id, bonus_tpc, status)
  -- Jika table itu belum ada, COMMENT bagian ini dan pakai opsi B.

  select
    coalesce(sum(bonus_tpc), 0)
  into total_referral_bonus_tpc
  from public.referral_earnings
  where user_id = auth.uid()
    and status in ('approved','paid'); -- sesuaikan enum kamu

  return next;
end;
$$;

revoke all on function public.member_get_dashboard_stats() from public;
grant execute on function public.member_get_dashboard_stats() to authenticated;
