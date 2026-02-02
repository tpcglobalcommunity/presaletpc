# TPC Global - Panduan Update Supabase Domain

## 🔧 **Konfigurasi Supabase yang Perlu Diupdate**

Setelah menghubungkan `tpcglobal.io` ke Cloudflare, update pengaturan Supabase ini:

### **1. Pengaturan Authentication**
Di Supabase Dashboard → Authentication → Settings:

```
Site URL: https://tpcglobal.io
Redirect URLs: 
- https://tpcglobal.io/**
- https://www.tpcglobal.io/**
```

### **2. Konfigurasi CORS**
Di Supabase Dashboard → Authentication → URL Configuration:

```
Allowed Redirect URLs:
https://tpcglobal.io/**
https://www.tpcglobal.io/**
```

### **3. Update Environment Variables**
Update environment variables Cloudflare Pages Anda:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### **4. OAuth Providers (jika pakai Google)**
Di Supabase Dashboard → Authentication → Providers → Google:

```
Authorized Redirect URI:
https://tpcglobal.io/**
```

## 🧪 **Testing Auth Flow**

Setelah setup domain, test:

1. **Login Flow:**
   - Kunjungi: `https://tpcglobal.io/id/login`
   - Klik login Google
   - Harus redirect ke Google dan kembali ke `tpcglobal.io`

2. **Magic Link:**
   - Masukkan email di login
   - Cek email berisi link `tpcglobal.io`
   - Link harus bekerja dan redirect dengan benar

3. **Session Persistence:**
   - Login harus bertahan setelah refresh halaman
   - Auth state harus bekerja di semua subpage

## ⚠️ **Masalah Umum**

**OAuth redirect mismatch:**
- Update Supabase redirect URLs
- Tunggu 1-2 menit untuk perubahan propagate

**Magic links tidak bekerja:**
- Cek link email berisi domain yang benar
- Verifikasi pengaturan CORS di Supabase

**Session hilang saat navigasi:**
- Cek site URL di pengaturan Supabase
- Verifikasi environment variables di Pages

---

**🎯 Selesaikan update Supabase setelah DNS propagation!**
