# Cloudflare Pages Configuration

## 🎯 **Required Settings**

### **Framework Preset**
- **Framework:** Vite
- **Root directory:** `/` (default)

### **Build Configuration**
- **Install command:** `npm ci`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** `20`

### **Environment Variables**
**WAJIB:** Konfigurasi di dashboard Cloudflare Pages → Settings → Environment variables

```
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPER_ADMIN_UUID=your_admin_uuid
VITE_APP_URL=https://tpcglobal.io
```

**⚠️ PENTING:**
- JANGAN pernah commit `.env` file ke repository
- Gunakan `.env.example` sebagai template lokal
- Set semua variabel di Cloudflare Pages dashboard

## ✅ **Why These Settings**

### **npm ci vs npm install**
- `npm ci` uses exact versions from `package-lock.json`
- Faster and more reliable for CI/CD
- Prevents version drift in production

### **Node 20**
- Matches local development environment
- Latest LTS with best performance
- Compatible with all dependencies

### **Vite Framework Preset**
- Optimized build process
- Automatic asset optimization
- Built-in code splitting

## 🚀 **Deployment Process**

1. **Cloudflare Pages detects:** Vite project
2. **Runs:** `npm ci` (install dependencies)
3. **Runs:** `npm run build` (build production)
4. **Serves:** `dist/` directory
5. **Result:** Production-ready TPC Global

## � **Security Headers**

**File:** `public/_headers`

Security headers otomatis diterapkan untuk semua routes:
- `X-Content-Type-Options: nosniff` - Mencegah MIME type sniffing
- `X-Frame-Options: DENY` - Mencegah clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin` - Kontrol referrer info
- `Permissions-Policy: geolocation=(), microphone=(), camera=()` - Blok akses perangkat
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` - Force HTTPS

## �📋 **Important Notes**

- ✅ **No Bun artifacts** (bun.lockb removed)
- ✅ **NPM lockfile present** (package-lock.json)
- ✅ **Build passes locally** and on Cloudflare
- ✅ **Node 20 compatibility** verified

## 🔧 **Troubleshooting**

Jika build gagal:
1. Pastikan Node version diset ke 20
2. Verifikasi `package-lock.json` ada
3. Pastikan tidak ada `bun.lockb` di repository
4. Cek environment variables di Cloudflare Pages dashboard
5. Verifikasi semua variabel dari `.env.example` sudah diset

Jika auth tidak berfungsi:
1. Cek `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` benar
2. Pastikan Supabase mengizinkan domain `tpcglobal.io`

---

**🎯 TPC Global is configured for reliable Cloudflare Pages deployment!**
