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
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

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

## 📋 **Important Notes**

- ✅ **No Bun artifacts** (bun.lockb removed)
- ✅ **NPM lockfile present** (package-lock.json)
- ✅ **Build passes locally** and on Cloudflare
- ✅ **Node 20 compatibility** verified

## 🔧 **Troubleshooting**

If build fails:
1. Check Node version is set to 20
2. Verify `package-lock.json` exists
3. Ensure no `bun.lockb` in repository
4. Check environment variables are set

---

**🎯 TPC Global is configured for reliable Cloudflare Pages deployment!**
