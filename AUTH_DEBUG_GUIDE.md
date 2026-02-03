# 🔍 DEBUGGING GUIDE: LOGIN GOOGLE SUKSES TAPI GETSESSION() = NULL

## 📋 **PHASE COMPLETION STATUS:**

### **✅ PHASE 1 — AUDIT FRONTEND ENV (COMPLETED)**
- **File:** `src/integrations/supabase/client.ts`
- **Debug Added:** Console log untuk VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
- **Purpose:** Verifikasi frontend connect ke project Supabase yang benar

### **✅ PHASE 2 — AUDIT LOGIN redirectTo (COMPLETED)**
- **File:** `src/contexts/AuthContext.tsx`
- **Debug Added:** Console log untuk callback URL yang digunakan
- **Current Config:** `${window.location.origin}/id/auth/callback`

### **✅ PHASE 3 — AUDIT CALLBACK PAGE (COMPLETED)**
- **File:** `src/pages/id/AuthCallbackPage.tsx`
- **Debug Added:** Detailed session logging (hasSession, hasError, error, sessionUser)
- **Purpose:** Melihat hasil getSession() secara detail

### **✅ PHASE 4 — SUPABASE DASHBOARD CONFIG (MANUAL CHECK NEEDED)**
- **Status:** ❌ PERLU VERIFIKASI MANUAL
- **Required Config:**
  ```
  Site URL: https://tpcglobal.io
  
  Redirect URLs:
  https://tpcglobal.io/id/auth/callback
  https://tpcglobal.io/en/auth/callback
  ```

### **✅ PHASE 5 — BUILD & REAL TEST (READY)**
- **Build Status:** ✅ PASS
- **Deployment:** ✅ Pushed to main
- **Debug Logging:** ✅ Active

---

## 🔧 **NEXT STEPS (MANUAL VERIFICATION):**

### **🔍 STEP 1: Buka Supabase Dashboard**
1. Login ke Supabase Dashboard
2. Pilih project yang sesuai dengan VITE_SUPABASE_URL
3. Navigation: Authentication → URL Configuration

### **🔍 STEP 2: Verify Site URL**
```
Site URL: https://tpcglobal.io
```
- Harus HTTPS (bukan HTTP)
- Tanpa www (sesuai dengan production)
- Tanpa trailing slash

### **🔍 STEP 3: Verify Redirect URLs**
```
https://tpcglobal.io/id/auth/callback
https://tpcglobal.io/en/auth/callback
```
- Harus persis sama dengan frontend callback URL
- Case-sensitive
- Tanpa trailing slash

### **🔍 STEP 4: Real Test Production**
1. **Buka Incognito:** `https://tpcglobal.io/id/login`
2. **Buka Console:** F12 → Console tab
3. **Login:** Klik "Masuk dengan Google"
4. **Check Logs:**
   ```
   [AUTH ENV] Supabase URL: https://xxxxxxxx.supabase.co
   [AUTH ENV] Supabase Key (first 10): eyJhbGciOi...
   [AUTH LOGIN] Redirecting to OAuth with callback: https://tpcglobal.io/id/auth/callback
   [AUTH CALLBACK] Starting session check...
   [AUTH CALLBACK] Session result: { hasSession: false, hasError: false, error: undefined, sessionUser: undefined }
   ```

### **🔍 STEP 5: Diagnose Based on Logs**
- **Jika `hasSession: false`** → Redirect URL tidak cocok
- **Jika `hasError: true`** → Environment variables salah
- **Jika URL ENV salah** → Frontend connect ke project lain

---

## 🎯 **EXPECTED DIAGNOSIS:**

### **🔍 Most Likely Causes:**
1. **Redirect URL Mismatch:** Supabase dashboard tidak punya `https://tpcglobal.io/id/auth/callback`
2. **Environment Mismatch:** Frontend connect ke project Supabase yang berbeda
3. **Domain Mismatch:** HTTP vs HTTPS atau www vs non-www

### **🔍 Debug Output Interpretation:**
- **`[AUTH ENV]`** → Cek URL dan key project
- **`[AUTH LOGIN]`** → Cek callback URL yang dikirim ke Google
- **`[AUTH CALLBACK]`** → Cek hasil session setelah OAuth

---

## 🚀 **IMMEDIATE ACTIONS:**

### **🔧 IF REDIRECT URL SALAH:**
1. Buka Supabase Dashboard → Authentication → URL Configuration
2. Tambahkan: `https://tpcglobal.io/id/auth/callback`
3. Save changes
4. Test ulang

### **🔧 IF ENV SALAH:**
1. Cek `.env` file di production
2. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY benar
3. Rebuild dan redeploy

### **🔧 IF DOMAIN MISMATCH:**
1. Pastikan Site URL pakai HTTPS
2. Pastikan tanpa www (sesuai production)
3. Clear browser cache dan test ulang

---

## 📊 **DEBUG CHECKLIST:**

- [ ] Supabase Dashboard URL Configuration verified
- [ ] Environment variables logged correctly
- [ ] Callback URL logged correctly
- [ ] Session result logged in detail
- [ ] Real test performed in incognito
- [ ] Root cause identified based on logs

---

## 🎯 **NEXT DEPLOYMENT:**

Setelah issue ditemukan dan diperbaiki:
1. **Remove debug logs** (clean production)
2. **Test final flow** without debug
3. **Deploy to production**
4. **Verify login works** end-to-end

---

**🔍 Debug logging sekarang aktif di production untuk diagnose root cause!**
