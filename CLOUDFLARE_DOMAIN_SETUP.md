# TPC Global - Cloudflare Domain Configuration Guide

## 🎯 **PHASE 1 - DOMAIN & DNS SETUP**

### **1. Add Domain to Cloudflare**
1. Log in to Cloudflare Dashboard
2. Go to "Add a site"
3. Enter: `tpcglobal.io`
4. Select FREE plan (sufficient for Pages)
5. Continue to DNS setup

### **2. Update Nameservers**
After adding domain, Cloudflare will show nameservers like:
- `dina.ns.cloudflare.com`
- `josh.ns.cloudflare.com`

**Action:** Update nameservers at your domain registrar (GoDaddy, Namecheap, etc.)

### **3. DNS Records Configuration**
In Cloudflare DNS settings for `tpcglobal.io`:

#### **A Records (Required):**
```
Type    Name        Content              TTL    Proxy
A       tpcglobal.io <your-server-ip>    Auto    Proxied (Orange)
A       www         <your-server-ip>    Auto    Proxied (Orange)
```

#### **CNAME Alternative (if using proxy):**
```
Type    Name        Content              TTL    Proxy
A       tpcglobal.io <your-server-ip>    Auto    Proxied (Orange)
CNAME   www         tpcglobal.io         Auto    Proxied (Orange)
```

---

## 🌐 **PHASE 2 - WWW TO NON-WWW REDIRECT (CRITICAL FOR AUTH)**

### **🚨 CRITICAL: Non-WWW Canonical Domain**
- **Primary Domain:** `https://tpcglobal.io` (canonical)
- **Redirect:** `https://www.tpcglobal.io` → `https://tpcglobal.io` (301)
- **Purpose:** Ensure Supabase auth cookies work correctly

### **🔧 Method 1: Page Rules (Recommended)**
1. Navigation: Rules → Page Rules
2. Create Page Rule:

**If the URL matches:**
```
www.tpcglobal.io/*
```

**Then the settings are:**
- **Forwarding URL:** 301 - Permanent Redirect
- **Destination URL:** `https://tpcglobal.io/$1`

### **🔧 Method 2: Redirect Rules (Modern)**
1. Navigation: Rules → Redirect Rules
2. Create Rule:

**When incoming requests match:**
- **Field:** Hostname
- **Operator:** equals
- **Value:** `www.tpcglobal.io`

**Then:**
- **Type:** Dynamic
- **Expression:** `concat("https://tpcglobal.io", http.request.uri.path)`

**Status Code:** 301

---

## 🔧 **PHASE 3 - SSL CERTIFICATE**

```
TYPE    NAME    TARGET                              PROXY   TTL
CNAME   @       your-project.pages.dev             ON      Auto
CNAME   www     tpcglobal.io                        ON      Auto
```

**Important:**
- ✅ Proxy status: **ORANGE CLOUD** (proxied)
- ❌ NO A records (don't expose IPs)
- ❌ NO AAAA records
- TTL: Auto (default)

### **4. Cloudflare Pages Domain Connection**
1. Go to Cloudflare Pages dashboard
2. Select your TPC Global project
3. Go to "Custom domains"
4. Add: `tpcglobal.io`
5. Add: `www.tpcglobal.io`
6. Wait for SSL certificate (usually 5-10 minutes)

---

## 🎯 **PHASE 2 - SSL & SECURITY**

### **SSL/TLS Configuration**
In Cloudflare SSL/TLS settings:

```
SSL/TLS Encryption Mode: Full (strict)
Minimum TLS Version: 1.2
Onion Routing: Off
 Opportunistic Encryption: On
TLS 1.3: On
```

### **Security Headers**
In "Transform Rules" → "Response Headers":

```
Rule Name: TPC Security Headers
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

## 🎯 **PHASE 3 - REDIRECTS & ROUTING**

### **Domain Redirects**
In "Rules" → "Redirect Rules":

```
Rule 1: www → apex
Source URL: www.tpcglobal.io/*
Target URL: https://tpcglobal.io/$1
Status: 301 (Permanent)
```

### **Language Redirects (Optional)**
```
Rule 2: Root to default language
Source URL: tpcglobal.io/
Target URL: https://tpcglobal.io/id/
Status: 302 (Temporary)
```

### **Page Rules (if needed)**
In "Rules" → "Page Rules":

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

## 🎯 **PHASE 4 - PERFORMANCE & CACHING**

### **Caching Configuration**
In "Caching" → "Configuration":

```
Browser Cache TTL: 4 hours
Development Mode: OFF
Cache Everything: OFF (for dynamic content)
```

### **Argo Smart Routing**
```
Network → Argo Smart Routing: ON (if available in plan)
```

### **Image Optimization**
```
Speed → Image Optimization: ON
```

---

## 🎯 **PHASE 5 - ANALYTICS & MONITORING**

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

## 🎯 **PHASE 6 - FIREWALL & PROTECTION**

### **Firewall Rules**
In "Security" → "WAF" → "Firewall Rules":

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

## 🎯 **PHASE 7 - ENVIRONMENT & DEPLOYMENT**

### **Environment Variables in Cloudflare Pages**
In Pages project settings:

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

## 🎯 **PHASE 8 - VERIFICATION CHECKLIST**

### **DNS Propagation**
```bash
# Check DNS propagation
dig tpcglobal.io CNAME
dig www.tpcglobal.io CNAME
```

### **SSL Certificate**
```bash
# Check SSL certificate
openssl s_client -connect tpcglobal.io:443
```

### **HTTPS Redirect Test**
```bash
# Test redirect
curl -I http://tpcglobal.io
# Should return 301 to https://tpcglobal.io
```

### **Functionality Tests**
- [ ] Homepage loads: `https://tpcglobal.io`
- [ ] www redirects: `https://www.tpcglobal.io`
- [ ] Language routes: `/en`, `/id`
- [ ] Auth flow works
- [ ] Static assets load
- [ ] No mixed content warnings

---

## 🎯 **PHASE 9 - TROUBLESHOOTING**

### **Common Issues & Solutions**

**SSL Certificate Pending**
- Wait 10-15 minutes after DNS propagation
- Check DNS records are correct
- Verify nameservers updated

**Too Many Redirects**
- Check Page Rules don't conflict
- Verify SSL/TLS mode is "Full (strict)"

**Auth Not Working**
- Check Supabase URL in environment variables
- Verify redirect URLs match new domain
- Update Supabase auth settings to allow `tpcglobal.io`

**Static Assets 404**
- Check build output directory is `dist`
- Verify asset paths in build are relative
- Check Pages custom domain configuration

---

## 🎯 **PHASE 10 - MAINTENANCE**

### **Regular Tasks**
- Monitor analytics and error rates
- Update SSL certificates (automatic with Cloudflare)
- Review firewall rules monthly
- Backup DNS settings

### **Monitoring**
- Set up Cloudflare alerts for high error rates
- Monitor Page Rules performance
- Track Core Web Vitals

---

## 🚀 **PRODUCTION READY**

After completing all phases:
- ✅ Custom domain connected
- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ Performance optimized
- ✅ Monitoring active
- ✅ Auth flow working

**TPC Global will be fully production-ready on `https://tpcglobal.io`!**
