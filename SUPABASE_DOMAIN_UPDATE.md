# TPC Global - Supabase Domain Update Guide

## 🔧 **Supabase Configuration Updates**

After connecting `tpcglobal.io` to Cloudflare, update these Supabase settings:

### **1. Authentication Settings**
In Supabase Dashboard → Authentication → Settings:

```
Site URL: https://tpcglobal.io
Redirect URLs: 
- https://tpcglobal.io/**
- https://www.tpcglobal.io/**
```

### **2. CORS Configuration**
In Supabase Dashboard → Authentication → URL Configuration:

```
Allowed Redirect URLs:
https://tpcglobal.io/**
https://www.tpcglobal.io/**
```

### **3. Environment Variables Update**
Update your Cloudflare Pages environment variables:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### **4. OAuth Providers (if using Google)**
In Supabase Dashboard → Authentication → Providers → Google:

```
Authorized Redirect URI:
https://tpcglobal.io/**
```

## 🧪 **Testing Auth Flow**

After domain setup, test:

1. **Login Flow:**
   - Visit: `https://tpcglobal.io/id/login`
   - Click Google login
   - Should redirect to Google and back to `tpcglobal.io`

2. **Magic Link:**
   - Enter email at login
   - Check email contains `tpcglobal.io` links
   - Links should work and redirect correctly

3. **Session Persistence:**
   - Login should persist across page refreshes
   - Auth state should work on all subpages

## ⚠️ **Common Issues**

**OAuth redirect mismatch:**
- Update Supabase redirect URLs
- Wait 1-2 minutes for changes to propagate

**Magic links not working:**
- Check email links contain correct domain
- Verify CORS settings in Supabase

**Session lost on navigation:**
- Check site URL in Supabase settings
- Verify environment variables in Pages

---

**🎯 Complete Supabase updates after DNS propagation!**
