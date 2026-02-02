# SEO Google Search Console (GSC) Checklist

## 🎯 Domain Verification

### Method 1: DNS TXT (Recommended)
1. Login to Google Search Console
2. Add property: `https://tpcglobal.io`
3. Choose "DNS record" verification method
4. Add TXT record to domain DNS provider:
   ```
   Type: TXT
   Name: @
   Value: google-site-verification=YOUR_VERIFICATION_CODE
   ```
5. Wait for DNS propagation (5-10 minutes)
6. Click "Verify" in GSC

### Method 2: HTML File Upload
1. Download HTML verification file from GSC
2. Upload to: `public/googleXXXXXXXXXXXX.html`
3. Deploy and verify in GSC

### Method 3: HTML Meta Tag
1. Copy meta tag from GSC
2. Add to `index.html` in `<head>` section
3. Deploy and verify

## 🗺️ Sitemap Submission

1. In GSC, go to "Sitemaps" section
2. Submit: `https://tpcglobal.io/sitemap.xml`
3. Wait for processing (usually few minutes)
4. Check submitted URL count: should be 15 URLs

## 🔍 URL Inspection Testing

1. Use "URL Inspection" tool in GSC
2. Test key pages:
   - `https://tpcglobal.io/id/`
   - `https://tpcglobal.io/id/buytpc`
   - `https://tpcglobal.io/id/transparansi`
3. Check:
   - Indexing status
   - Canonical URL
   - Meta tags detected
   - OG tags working

## ✅ Post-Deploy Checklist

### 1. File Accessibility
- [ ] `https://tpcglobal.io/robots.txt` - Should return 200
- [ ] `https://tpcglobal.io/sitemap.xml` - Should return 200
- [ ] `https://tpcglobal.io/og.png` - Should return 200

### 2. Meta Tags Verification
- [ ] **Facebook Sharing Debugger**: `https://developers.facebook.com/tools/debug/`
  - Test: `https://tpcglobal.io/id/buytpc`
  - Check: OG title, description, image
- [ ] **X (Twitter) Card Validator**: `https://cards-dev.twitter.com/validator`
  - Test: `https://tpcglobal.io/id/`
  - Check: Card type, title, description, image

### 3. Canonical URLs
- [ ] View source of key pages
- [ ] Check `<link rel="canonical" href="...">` present
- [ ] Verify canonical matches page URL

### 4. Robots.txt Testing
- [ ] Google Robots Testing Tool
- [ ] Test: `/id/` (should be allowed)
- [ ] Test: `/id/admin` (should be disallowed)

## ⚠️ SPA Considerations

- Google handles SPA crawling well with React Helmet
- Meta tags are dynamically injected per route
- Ensure server returns 200 for all client-side routes
- Consider pre-rendering for better SEO if needed

## 📊 Monitoring

1. **Performance Report**: Monitor Core Web Vitals
2. **Index Coverage**: Track indexed pages count
3. **Search Analytics**: Monitor impressions and clicks
4. **Mobile Usability**: Ensure mobile-friendly

## 🚨 Common Issues

- **Duplicate Content**: Ensure canonical tags are correct
- **Missing Meta**: Check Helmet injection is working
- **Blocked Resources**: Verify robots.txt allows assets
- **Slow Loading**: Optimize images and scripts

## 📞 Support

- Google Search Console Help Center
- Google Webmaster Guidelines
- Search for "React Helmet SEO best practices"

---

**Last Updated**: 2026-02-02
**Domain**: tpcglobal.io
**Locale**: id-ID (Indonesian)
