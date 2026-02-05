-- PHASE 1: Inspeksi Schema Invoices
-- Jalankan di Supabase SQL Editor

-- 1) Cek struktur kolom invoices
select column_name, data_type, is_nullable
from information_schema.columns
where table_name = 'invoices'
  and table_schema = 'public'
order by ordinal_position;

-- 2) Cek kolom ownership yang tersedia
-- Cari kolom yang mungkin sebagai ownership:
select column_name, data_type
from information_schema.columns
where table_name = 'invoices'
  and table_schema = 'public'
  and column_name in ('user_id', 'profile_id', 'member_id', 'buyer_id', 'owner_id', 'customer_id')
order by column_name;

-- 3) Cek data lama - konsistensi kolom ownership
select
  count(*) as total_invoices,
  count(user_id) as user_id_filled,
  count(email) as email_filled
from public.invoices;

-- 4) Sample data untuk melihat pola
select 
  invoice_no,
  user_id,
  email,
  status,
  created_at
from public.invoices
order by created_at desc
limit 5;
