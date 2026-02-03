# 🍪 AUTH COOKIE TROUBLESHOOTING GUIDE

## 🔍 **WHY COOKIES BLOCKED WITHOUT PKCE**

### **🌐 Modern Browser Cookie Policy**
Browser modern (Chrome, Firefox, Safari) memblokir third-party cookies secara default untuk privacy. Ini mempengaruhi OAuth flow:

#### **❌ Implicit Flow (Legacy - Blocked)**
```
User → Google OAuth → Supabase → Browser
Browser: "Ini third-party cookie! BLOCK!"
Result: Tidak ada auth cookie, getSession() = null
```

#### **✅ PKCE Flow (Modern - Allowed)**
```
User → Google OAuth → Supabase → PKCE Challenge → Browser
Browser: "Ini first-party context dengan PKCE! ALLOW!"
Result: Auth cookie ter-set, getSession() = session object
```

---

## 🔧 **HOW MODERN BROWSERS TREAT CROSS-SITE AUTH**

### **🚨 Third-Party Cookie Blocking**
- **Chrome:** Blokir default untuk cross-site cookies
- **Firefox:** Enhanced Tracking Protection
- **Safari:** Intelligent Tracking Prevention

### **🎯 What's Considered Third-Party:**
- Cookie dari domain berbeda dengan current page
- OAuth redirect dari provider ke berbeda domain
- Implicit flow tanpa PKCE validation

### **✅ First-Party Context with PKCE:**
- PKCE (Proof Key for Code Exchange) ensures first-party context
- Browser recognizes legitimate auth flow
- Cookie allowed untuk domain yang sama

---

## 🔐 **WHY SUPABASE REQUIRES PKCE IN PRODUCTION**

### **🛡️ Security Benefits:**
1. **Code Injection Prevention:** PKCE prevents authorization code injection
2. **First-Party Context:** Ensures cookies set in correct domain
3. **Modern OAuth 2.1:** Compliant with latest security standards
4. **Browser Compatibility:** Works with modern browser policies

### **🔧 Technical Details:**
```
Without PKCE:
- Authorization code bisa di-reuse
- Cookie dianggap third-party
- Browser memblokir cookie

With PKCE:
- Code verifier + challenge digunakan
- Cookie dianggap first-party
- Browser mengizinkan cookie
```

---

## 🧪 **DIAGNOSTIC CHECKLIST**

### **🔍 Step 1: Check Cookie Existence**
```javascript
// Di browser console
console.log("All cookies:", document.cookie);
console.log("Auth cookie:", document.cookie.includes('sb-mzzwhrmciijyuqtfgtgg-auth-token'));
```

### **🔍 Step 2: Check Session**
```javascript
// Di browser console
await window.supabase.auth.getSession()
// Expected: { data: { session: { user: {...} } } }
// Not: { data: { session: null } }
```

### **🔍 Step 3: Check Browser Settings**
- Chrome Settings → Privacy → Third-party cookies
- Pastikan tidak "Block all third-party cookies"
- Atau gunakan PKCE untuk bypass

---

## 🚨 **COMMON SYMPTOMS & SOLUTIONS**

### **❌ Symptom 1: Cookie Not Found**
```
[AUTH CALLBACK] Auth cookie found: false
[AUTH CALLBACK SESSION] { session: null }
```
**Cause:** Implicit flow, third-party cookie blocked
**Solution:** Enable PKCE in Supabase Dashboard

### **❌ Symptom 2: Intermittent Login**
```
[AUTH CALLBACK] Auth cookie found: true (sometimes)
[AUTH CALLBACK SESSION] { session: null } (sometimes)
```
**Cause:** Browser cookie policy inconsistency
**Solution:** Ensure PKCE always enabled

### **❌ Symptom 3: Incognito Works, Normal Doesn't**
```
Incognito: Login success
Normal: Login fails
```
**Cause:** Cookie extensions or settings interference
**Solution:** Disable extensions, enable PKCE

---

## 🔧 **SUPABASE DASHBOARD CONFIGURATION**

### **🎯 Required Settings:**
1. **Navigation:** Authentication → Settings → Advanced
2. **Enable PKCE Flow:** ON
3. **Disable Implicit Flow:** OFF
4. **Cookie Domain:** Follow Site URL (https://tpcglobal.io)

### **⚠️ Critical Notes:**
- **NEVER disable PKCE in production**
- **ALWAYS use redirectTo parameter**
- **NEVER use implicit flow**

---

## 🧪 **TEST MATRIX**

### **🔍 Test Scenarios:**

#### **A) Chrome Normal**
- **Expected:** ✅ Success with PKCE
- **Without PKCE:** ❌ Cookie blocked

#### **B) Chrome Incognito**
- **Expected:** ✅ Success with PKCE
- **Without PKCE:** ❌ Cookie blocked

#### **C) Chrome Third-Party Cookies Disabled**
- **Expected:** ✅ Success with PKCE
- **Without PKCE:** ❌ Cookie blocked

#### **D) Chrome Third-Party Cookies Enabled**
- **Expected:** ✅ Success both ways
- **Recommendation:** Still use PKCE

---

## 🚀 **IMPLEMENTATION CHECKLIST**

### **✅ Frontend Code:**
- [ ] `signInWithOAuth` tanpa `response_type=token`
- [ ] `redirectTo` parameter selalu diset
- [ ] Tidak ada manual token storage
- [ ] Tidak ada localStorage hacks

### **✅ Supabase Config:**
- [ ] PKCE Flow enabled
- [ ] Implicit Flow disabled
- [ ] Site URL correct
- [ ] Redirect URLs correct

### **✅ Browser Testing:**
- [ ] Chrome normal mode
- [ ] Chrome incognito
- [ ] Third-party cookie scenarios
- [ ] Cookie verification

---

## 🔄 **ROLLBACK PLAN**

### **🔧 If PKCE Causes Issues:**
1. **Check Supabase version:** Ensure latest client library
2. **Verify redirect URLs:** Must match exactly
3. **Check browser console:** Look for PKCE errors
4. **Test in different browsers:** Ensure compatibility

### **🔧 Never Disable PKCE:**
- PKCE is security requirement
- Disabling will cause more issues
- Modern browsers require PKCE for OAuth

---

## 📊 **SUCCESS INDICATORS**

### **✅ Expected Logs:**
```
[AUTH CALLBACK] Auth cookie found: true
[AUTH CALLBACK] Auth cookie name: sb-mzzwhrmciijyuqtfgtgg-auth-token
[AUTH CALLBACK SESSION] { session: { user: {...} } }
[AUTH] Login success, redirect to: /id/dashboard
```

### **✅ Expected Behavior:**
- Cookie exists in browser
- Session object returned
- Login flow completes
- User stays logged in after refresh

---

## 🎯 **FINAL WARNING**

### **🚨 NEVER DO:**
- ❌ Disable PKCE in production
- ❌ Use implicit flow
- ❌ Store tokens manually
- ❌ Use localStorage for auth

### **✅ ALWAYS DO:**
- ✅ Enable PKCE Flow
- ✅ Use redirectTo parameter
- ✅ Let Supabase handle cookies
- ✅ Test across browsers

---

**🍪 PKCE is not optional - it's required for modern auth to work!**
