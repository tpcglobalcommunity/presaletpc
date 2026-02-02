# Google Search Console (GSC) Action Guide

## 🎯 DOMAIN VERIFICATION

### Step 1: Add Property di GSC
1. Login ke [Google Search Console](https://search.google.com/search-console)
2. Klik "Add Property"
3. Pilih **Domain property** (RECOMMENDED)
   - Masukkan: `tpcglobal.io`
   - Lebih baik karena mencakup semua subdomain dan protocol

### Step 2: Verify via DNS TXT (Recommended)
1. Di GSC, pilih "DNS record" verification method
2. Copy TXT record yang diberikan Google
3. Tambahkan ke Cloudflare DNS:
   ```
   Type: TXT
   Name: @
   Value: google-site-verification=XXXXXXXXXXXXXXXXXXXXX
   TTL: Auto (default)
   ```
4. Klik "Verify" di GSC
5. Tunggu 5-10 menit untuk DNS propagation

### Step 3: Alternative Verification (Jika DNS sulit)

#### Option A: URL Prefix + HTML File
1. Pilih "URL prefix" property
2. Masukkan: `https://tpcglobal.io/`
3. Download HTML verification file
4. Upload ke `public/googleXXXXXXXXXXXX.html`
5. Deploy dan verify di GSC

#### Option B: URL Prefix + Meta Tag
1. Pilih "URL prefix" property
2. Copy meta tag dari GSC
3. Tambahkan ke `index.html` di `<head>`
4. Deploy dan verify di GSC

## 🗺️ SITEMAP SUBMISSION

### Setelah Verified:
1. Di GSC, go to "Sitemaps" section
2. Submit: `https://tpcglobal.io/sitemap.xml`
3. Tunggu processing (biasanya 1-5 menit)
4. Verify submitted URLs: harusnya 15 URLs

## 🔍 URL INSPECTION

### Test Key Pages:
1. Gunakan "URL Inspection" tool di GSC
2. Test URLs berikut:
   - `https://tpcglobal.io/id/` (Homepage)
   - `https://tpcglobal.io/id/buytpc` (Buy TPC)
   - `https://tpcglobal.io/id/transparansi` (Transparency)

### Yang harus dicek:
- ✅ Indexing status: "URL is on Google"
- ✅ Canonical URL: sesuai expected
- ✅ Meta tags detected: title, description
- ✅ OG tags working: image, title, description

## 📊 IMPORTANT METRICS

### Performance Report:
- **Total Impressions**: Jumlah tampilan di search
- **Average CTR**: Click-through rate percentage
- **Average Position**: Posisi rata-rata di search
- **Queries**: Keywords yang menghasilkan traffic

### Coverage Report:
- **Valid pages**: Pages yang di-index dengan benar
- **Excluded pages**: Pages yang di-exclude (normal)
- **Errors**: Pages yang tidak bisa di-index (fix ASAP)

## ⚠️ SPA CONSIDERATIONS

### React SPA Status:
- ✅ Google handles SPA crawling well
- ✅ Meta tags via react-helmet-async sudah terinject
- ✅ Server returns 200 untuk client-side routes
- ✅ Canonical URLs bekerja dengan baik

### Best Practices:
- Gunakan URL Inspection untuk test rendering
- Monitor JavaScript errors di GSC
- Pastikan tidak ada blocking resources

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: Pages not indexed
- **Solution**: Check robots.txt, ensure no noindex tags
- **Tool**: URL Inspection → Live Test

### Issue: Duplicate content
- **Solution**: Verify canonical tags
- **Tool**: Coverage Report → Duplicate without user-selected canonical

### Issue: Low CTR
- **Solution**: Improve meta titles/descriptions
- **Tool**: Performance Report → Pages

### Issue: Mobile usability
- **Solution**: Fix mobile-friendly issues
- **Tool**: Mobile Usability Report

## 📞 MONITORING SCHEDULE

### Weekly:
- Check Performance Report metrics
- Monitor new keywords/queries
- Review Coverage Report errors

### Monthly:
- Analyze search performance trends
- Update sitemap jika ada new pages
- Review mobile usability

### Quarterly:
- Deep dive into search analytics
- Plan content strategy based on queries
- Technical SEO audit

## 🛠️ USEFUL TOOLS

### Google Tools:
- Google Search Console
- PageSpeed Insights
- Mobile-Friendly Test
- Rich Results Test

### Third-party Tools:
- Screaming Frog (crawling)
- Ahrefs/SEMrush (keywords)
- Google Analytics (traffic correlation)

## 📋 QUICK START CHECKLIST

### Pre-Launch:
- [ ] Domain verified di GSC
- [ ] Sitemap submitted
- [ ] Key pages tested dengan URL Inspection
- [ ] No critical errors di Coverage Report

### Post-Launch:
- [ ] Monitor Performance Report daily (first week)
- [ ] Set up alerts untuk new errors
- [ ] Test mobile rendering
- [ ] Verify social sharing (Facebook Debugger, X Card Validator)

---

**Domain**: tpcglobal.io  
**Framework**: Vite + React SPA  
**SEO Setup**: react-helmet-async  
**Last Updated**: 2026-02-02

## 🎯 NEXT STEPS

1. **Verify Domain** di GSC (priority #1)
2. **Submit Sitemap** setelah verified
3. **Test Key Pages** dengan URL Inspection
4. **Monitor Performance** metrics
5. **Optimize** berdasarkan data yang didapat

**Note**: SEO adalah proses berkelanjutan. Monitor dan optimize secara regular!
