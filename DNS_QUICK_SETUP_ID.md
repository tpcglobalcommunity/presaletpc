# TPC Global - Script Konfigurasi DNS Cepat

## 📋 **DNS Records untuk Ditambahkan di Cloudflare**

Untuk domain: `tpcglobal.io`

| Type | Name | Target | Proxy | TTL |
|------|------|--------|-------|-----|
| CNAME | @ | your-project.pages.dev | ON ☑️ | Auto |
| CNAME | www | tpcglobal.io | ON ☑️ | Auto |

## ⚠️ **PENTING - JANGAN DITAMBAHKAN**

❌ **TANPA A records** (jangan ekspos alamat IP)
❌ **TANPA AAAA records** 
❌ **TANPA MX records** (kecuali pakai email)

## 🔄 **Perintah Verifikasi**

```bash
# Cek CNAME records
dig tpcglobal.io CNAME
dig www.tpcglobal.io CNAME

# Cek SSL certificate
openssl s_client -connect tpcglobal.io:443

# Test HTTPS redirect
curl -I http://tpcglobal.io
```

## 🚀 **Hasil yang Diharapkan**

Setelah DNS propagation (5-30 menit):

1. `tpcglobal.io` → CNAME ke `your-project.pages.dev`
2. `www.tpcglobal.io` → CNAME ke `tpcglobal.io`
3. SSL certificate diterbitkan otomatis
4. HTTPS enforced secara default

## 📱 **Testing Checklist**

- [ ] `https://tpcglobal.io` memuat homepage
- [ ] `https://www.tpcglobal.io` redirect ke apex
- [ ] `http://tpcglobal.io` redirect ke HTTPS
- [ ] Tidak ada browser security warnings
- [ ] Auth flow bekerja dengan domain baru
- [ ] Static assets load dengan benar

## 🔧 **Koneksi Domain Cloudflare Pages**

1. Pergi ke Cloudflare Pages → Project Anda
2. Custom domains → Add custom domain
3. Tambah: `tpcglobal.io`
4. Tambah: `www.tpcglobal.io`
5. Tunggu SSL certificate (5-10 menit)

## 🎯 **URL Production**

- **Site utama:** `https://tpcglobal.io`
- **Auth:** `https://tpcglobal.io/id/login`
- **Dashboard:** `https://tpcglobal.io/id/dashboard`
- **Buy TPC:** `https://tpcglobal.io/id/buytpc`

---

**📌 Simpan guide ini untuk referensi saat setup!**
