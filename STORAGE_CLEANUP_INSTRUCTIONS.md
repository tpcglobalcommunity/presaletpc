# 🗑️ STORAGE CLEANUP INSTRUCTIONS

## 📋 MANUAL STEPS (WAJIB)

Setelah menjalankan SQL migration `20260204_full_reset_keep_super_admin.sql`, lakukan storage cleanup manual:

### 1. Buka Supabase Dashboard
- Login sebagai super admin: `tpcglobal.io@gmail.com`
- Navigate ke **Storage** section

### 2. Hapus Semua File di Bucket
Untuk setiap bucket yang ada (biasanya `proofs`, `uploads`, `avatars`, dll):

- ✅ **HAPUS SEMUA FILE** dalam bucket
- ❌ **JANGAN HAPUS BUCKET-NYA** - hanya isinya

### 3. Bucket Checklist (Umum)
- `proofs/` - Hapus semua file pembayaran
- `uploads/` - Hapus semua file upload user
- `avatars/` - Hapus semua avatar user
- `temp/` - Hapus file temporary
- `documents/` - Hapus dokumen user
- `images/` - Hapus gambar user

### 4. Verifikasi Storage Kosong
Setelah cleanup, pastikan tidak ada file tersisa:
- Storage usage harus minimal (hanya system files)
- Tidak ada file yang terkait user/member

## ⚠️ PERINGATAN KRITIS

- **BACKUP DATA PENTING** sebelum reset (jika diperlukan)
- **SUPER ADMIN TIDAK AKAN DIHAPUS** - aman
- **STRUKTUR TABEL TIDAK DIHAPUS** - aman
- **RPC/FUNCTION TIDAK DIHAPUS** - aman
- **MIGRATION HISTORY TIDAK DIHAPUS** - aman

## 🎯 TARGET HASIL

✅ **Data aplikasi bersih** (kecuali super admin)
✅ **Storage bersih** (tidak ada file user)
✅ **Super admin tetap bisa login**
✅ **Struktur database tetap utuh**
✅ **Siap untuk soft-launch ulang**
