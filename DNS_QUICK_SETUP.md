# TPC Global - Quick DNS Configuration Script

## 📋 **DNS Records to Add in Cloudflare**

For domain: `tpcglobal.io`

| Type | Name | Target | Proxy | TTL |
|------|------|--------|-------|-----|
| CNAME | @ | your-project.pages.dev | ON ☑️ | Auto |
| CNAME | www | tpcglobal.io | ON ☑️ | Auto |

## ⚠️ **IMPORTANT - DO NOT ADD**

❌ **NO A records** (don't expose IP addresses)
❌ **NO AAAA records** 
❌ **NO MX records** (unless using email)

## 🔄 **Verification Commands**

```bash
# Check CNAME records
dig tpcglobal.io CNAME
dig www.tpcglobal.io CNAME

# Check SSL certificate
openssl s_client -connect tpcglobal.io:443

# Test HTTPS redirect
curl -I http://tpcglobal.io
```

## 🚀 **Expected Results**

After DNS propagation (5-30 minutes):

1. `tpcglobal.io` → CNAME to `your-project.pages.dev`
2. `www.tpcglobal.io` → CNAME to `tpcglobal.io`
3. SSL certificate issued automatically
4. HTTPS enforced by default

## 📱 **Testing Checklist**

- [ ] `https://tpcglobal.io` loads homepage
- [ ] `https://www.tpcglobal.io` redirects to apex
- [ ] `http://tpcglobal.io` redirects to HTTPS
- [ ] No browser security warnings
- [ ] Auth flow works with new domain
- [ ] Static assets load correctly

## 🔧 **Cloudflare Pages Domain Connection**

1. Go to Cloudflare Pages → Your Project
2. Custom domains → Add custom domain
3. Add: `tpcglobal.io`
4. Add: `www.tpcglobal.io`
5. Wait for SSL certificate (5-10 min)

## 🎯 **Production URLs**

- **Main site:** `https://tpcglobal.io`
- **Auth:** `https://tpcglobal.io/id/login`
- **Dashboard:** `https://tpcglobal.io/id/dashboard`
- **Buy TPC:** `https://tpcglobal.io/id/buytpc`

---

**📌 Save this guide for reference during setup!**
