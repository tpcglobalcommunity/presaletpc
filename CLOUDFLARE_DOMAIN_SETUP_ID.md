# TPC Global - Panduan Konfigurasi Domain Cloudflare

## 🎯 **FASE 1 - DOMAIN & DNS SETUP**

### **1. Tambah Domain ke Cloudflare**
1. Login ke Dashboard Cloudflare
2. Pilih "Add a site"
3. Masukkan: `tpcglobal.io`
4. Pilih paket FREE (cukup untuk Pages)
5. Lanjut ke setup DNS

### **2. Update Nameserver**
Setelah menambah domain, Cloudflare akan menampilkan nameserver seperti:
- `dina.ns.cloudflare.com`
- `josh.ns.cloudflare.com`

**Aksi:** Update nameserver di registrar domain Anda (GoDaddy, Namecheap, dll)

### **3. Konfigurasi DNS Records**
Di pengaturan DNS Cloudflare untuk `tpcglobal.io`:

```
TIPE    NAMA    TARGET                              PROXY   TTL
CNAME   @       your-project.pages.dev             ON      Auto
CNAME   www     tpcglobal.io                        ON      Auto
```

**Penting:**
- ✅ Status Proxy: **ORANGE CLOUD** (diproksi)
- ❌ TANPA A records (jangan ekspos IP)
- ❌ TANPA AAAA records
- TTL: Auto (default)

### **4. Koneksi Domain Cloudflare Pages**
1. Pergi ke Dashboard Cloudflare Pages
2. Pilih project TPC Global Anda
3. Pilih "Custom domains"
4. Tambah: `tpcglobal.io`
5. Tambah: `www.tpcglobal.io`
6. Tunggu sertifikat SSL (biasanya 5-10 menit)

---

## 🎯 **FASE 2 - SSL & KEAMANAN**

### **Konfigurasi SSL/TLS**
Di pengaturan SSL/TLS Cloudflare:

```
Mode Enkripsi SSL/TLS: Full (strict)
Versi TLS Minimum: 1.2
Onion Routing: Off
Opportunistic Encryption: On
TLS 1.3: On
```

### **Security Headers**
Di "Transform Rules" → "Response Headers":

```
Nama Rule: TPC Security Headers
Field: Header
Value: 
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### **Bot Fight Mode**
```
Settings → Bots → Bot Fight Mode: ON
```

---

## 🎯 **FASE 3 - REDIRECT & ROUTING**

### **Domain Redirects**
Di "Rules" → "Redirect Rules":

```
Rule 1: www → apex
Source URL: www.tpcglobal.io/*
Target URL: https://tpcglobal.io/$1
Status: 301 (Permanent)
```

### **Language Redirects (Opsional)**
```
Rule 2: Root ke bahasa default
Source URL: tpcglobal.io/
Target URL: https://tpcglobal.io/id/
Status: 302 (Temporary)
```

### **Page Rules (jika diperlukan)**
Di "Rules" → "Page Rules":

```
Rule 1: Force HTTPS
URL pattern: *tpcglobal.io/*
Settings: Always Use HTTPS (ON)

Rule 2: Cache static assets
URL pattern: *tpcglobal.io/assets/*
Settings: Cache Level: Cache Everything
          Edge Cache TTL: 1 month
```

---

## 🎯 **FASE 4 - PERFORMANCE & CACHING**

### **Konfigurasi Caching**
Di "Caching" → "Configuration":

```
Browser Cache TTL: 4 hours
Development Mode: OFF
Cache Everything: OFF (untuk konten dinamis)
```

### **Argo Smart Routing**
```
Network → Argo Smart Routing: ON (jika tersedia di paket)
```

### **Image Optimization**
```
Speed → Image Optimization: ON
```

---

## 🎯 **FASE 5 - ANALYTICS & MONITORING**

### **Web Analytics**
```
Analytics → Web Analytics: ON
Privacy Controls: Anonymize IP addresses
```

### **Real User Monitoring (RUM)**
```
Analytics → Web Analytics → RUM: ON
```

---

## 🎯 **FASE 6 - FIREWALL & PROTEKSI**

### **Firewall Rules**
Di "Security" → "WAF" → "Firewall Rules":

```
Rule 1: Block malicious bots
Expression: (cf.bot_management.score lt 30)
Action: Block

Rule 2: Rate limiting auth endpoints
Expression: (http.request.uri.path contains "/auth")
Action: Rate Limit
Rate Limit: 10 requests per minute
```

### **DDoS Protection**
```
Security → DDoS Protection: ON
HTTP DDoS Protection: ON
```

---

## 🎯 **FASE 7 - ENVIRONMENT & DEPLOYMENT**

### **Environment Variables di Cloudflare Pages**
Di pengaturan project Pages:

```
VITE_SUPABASE_URL: your_supabase_url
VITE_SUPABASE_ANON_KEY: your_supabase_anon_key
```

### **Build Configuration**
```
Build command: npm run build
Build output directory: dist
Root directory: /
Node version: 20
```

---

## 🎯 **FASE 8 - VERIFICATION CHECKLIST**

### **DNS Propagation**
```bash
# Cek DNS propagation
dig tpcglobal.io CNAME
dig www.tpcglobal.io CNAME
```

### **SSL Certificate**
```bash
# Cek SSL certificate
openssl s_client -connect tpcglobal.io:443
```

### **HTTPS Redirect Test**
```bash
# Test redirect
curl -I http://tpcglobal.io
# Should return 301 ke https://tpcglobal.io
```

### **Functionality Tests**
- [ ] Homepage loads: `https://tpcglobal.io`
- [ ] www redirects: `https://www.tpcglobal.io`
- [ ] Language routes: `/en`, `/id`
- [ ] Auth flow works
- [ ] Static assets load
- [ ] No mixed content warnings

---

## 🎯 **FASE 9 - TROUBLESHOOTING**

### **Common Issues & Solutions**

**SSL Certificate Pending**
- Tunggu 10-15 menit setelah DNS propagation
- Cek DNS records sudah benar
- Verifikasi nameservers sudah diupdate

**Too Many Redirects**
- Cek Page Rules tidak bentrok
- Verifikasi mode SSL/TLS adalah "Full (strict)"

**Auth Not Working**
- Cek Supabase URL di environment variables
- Verifikasi redirect URLs cocok dengan domain baru
- Update Supabase auth settings untuk izinkan `tpcglobal.io`

**Static Assets 404**
- Cek build output directory adalah `dist`
- Verifikasi asset paths di build adalah relative
- Cek konfigurasi custom domain Pages

---

## 🎯 **FASE 10 - MAINTENANCE**

### **Regular Tasks**
- Monitor analytics dan error rates
- Update SSL certificates (otomatis dengan Cloudflare)
- Review firewall rules bulanan
- Backup DNS settings

### **Monitoring**
- Set up Cloudflare alerts untuk high error rates
- Monitor Page Rules performance
- Track Core Web Vitals

---

## 🚀 **PRODUCTION READY**

Setelah menyelesaikan semua fase:
- ✅ Custom domain terhubung
- ✅ HTTPS enforced
- ✅ Security headers dikonfigurasi
- ✅ Performance optimized
- ✅ Monitoring aktif
- ✅ Auth flow working

**TPC Global akan sepenuhnya production-ready di `https://tpcglobal.io`!**
