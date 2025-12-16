# Quick Deployment Guide - Version 6.0
## CHNSC Nail Salon Business Tools

### 🆕 What's New in v6.0
- **Dynamic California Minimum Wage System** - 40+ localities with 2025/2026 data
- **Data Management Tools** - Download, edit, and upload custom minimum wage data
- **Automatic W2 Wage Updates** - Syncs with selected locality minimum wage
- **Small Employer Rate Support** - For businesses with ≤25 employees

### 🚀 Instant Deployment Options

#### Option 1: Local Use (Easiest)
1. **Extract** the zip file to any folder
2. **Double-click** `CHNSC_StartPage.html`
3. **Ready!** Application opens in your default browser
4. **Optional:** Pre-configure minimum wage data for your organization

#### Option 2: Cloud Deployment (Recommended)
**Netlify (Free & Simple):**
1. Go to [netlify.com](https://netlify.com)
2. Drag the entire folder to Netlify dashboard
3. **Live!** Automatic HTTPS and global CDN

**Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Drag folder or connect Git repository
3. **Deployed!** Instant global deployment

#### Option 3: Web Server
**Requirements:**
- Any web server (Apache, Nginx, IIS)
- Static file serving capability
- HTTPS recommended

**Steps:**
1. Upload entire folder to web root
2. Point domain to `CHNSC_StartPage.html`
3. Enable compression for better performance
4. Verify localStorage is not blocked

### 📁 What's in the Package

```
nail-salon-business-tools-v6.0-dec15-2025/
├── CHNSC_StartPage.html        # Main application
├── static/                     # Optimized app files (~96 KB)
│   ├── js/                    # JavaScript bundles
│   └── css/                   # Stylesheets
├── documentation/              # v6.0 documentation
│   ├── USER-INSTRUCTIONS.html
│   ├── TECHNICAL-DEPLOYMENT-v6.0.html
│   ├── README-v6.0.md
│   ├── WHATS-NEW-v6.0.md
│   └── DEPLOYMENT-SUMMARY-v6.0.md
├── manifest.json              # PWA configuration
├── service-worker.js          # Offline support
├── robots.txt                 # Search engine directives
└── favicon.ico                # Application icon
```

### 💰 Minimum Wage Data

**Pre-loaded Data:**
- 40+ California cities and counties
- 2025 and 2026 minimum wage rates
- Small employer rates where applicable
- Source: UC Berkeley Labor Center

**Custom Data:**
- Users can download minwage.json
- Edit to add 2027+ data or new localities
- Upload custom data via browser interface
- Data persists in browser localStorage

**JSON Structure:**
```json
{
  "data": {
    "2027": [
      {
        "city": "San Francisco",
        "effectiveDate": "2027-01-01",
        "minimumWage": 19.50,
        "smallEmployerRate": null,
        "notes": ""
      }
    ]
  }
}
```

### ✅ Deployment Checklist

**Before Going Live:**
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify mobile responsiveness
- [ ] Test language switching (English ↔ Vietnamese)
- [ ] Test minimum wage selection feature
- [ ] Verify W2 wage auto-updates work
- [ ] Test minimum wage data download/upload
- [ ] Confirm save/load functionality works
- [ ] Test CSV export features
- [ ] Enable HTTPS if using custom domain
- [ ] Configure compression (gzip/brotli)
- [ ] Ensure localStorage is not blocked

**New v6.0 Features to Test:**
- [ ] Minimum wage dropdown searchability
- [ ] Small employer rate checkbox
- [ ] Data upload/download tools
- [ ] Collapsible minimum wage section
- [ ] Locality-specific calculations

### 🌐 Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Android Chrome 90+)

**Storage Requirements:**
- localStorage enabled (for custom minimum wage data)
- ~5 MB storage recommended for optimal performance
- Cookies not required

### 📱 Mobile Deployment

**iOS/iPhone/iPad:**
1. Save folder to Files app
2. Tap `CHNSC_StartPage.html`
3. Add to Home Screen via Share button
4. Works offline as Progressive Web App

**Android:**
1. Download folder to device storage
2. Open with Chrome or default browser
3. Add to Home Screen via menu
4. Install as PWA for best experience

### 🔒 Security Considerations

**Recommended Settings:**
- Always use HTTPS in production
- Enable security headers
- Configure proper MIME types
- Set up CSP headers if needed
- Ensure localStorage is not accessible to unauthorized users

**Basic Security Headers:**
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self' 'unsafe-inline'
```

**Note on Data Privacy:**
- Minimum wage data stored in browser localStorage
- No external API calls or data transmission
- User data stays on their device
- Custom minimum wage data is user-managed

### ⚡ Performance Optimization

**Essential Settings:**
- Enable gzip/brotli compression
- Cache static assets (CSS/JS) for 1 year
- Don't cache HTML files
- Use CDN for global distribution

**Compression Configuration (Nginx):**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;
gzip_comp_level 6;
```

**Apache .htaccess:**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### 🔄 Upgrading from v5.0

**Backward Compatibility:**
- All v5.0 saved data works in v6.0
- No data migration required
- New minimum wage features are additive
- Existing workflows unchanged

**Update Steps:**
1. Back up existing deployment (optional)
2. Replace files with v6.0 package
3. Update documentation links
4. Test minimum wage features
5. Notify users of new capabilities

### 🎯 Organization-Specific Deployment

**For Multi-Location Organizations:**
1. Pre-configure minimum wage data for your locations
2. Create organization-specific deployment package
3. Distribute to members with custom minwage.json
4. Provide update instructions for 2027+ data

**Custom Data Distribution:**
1. Create minwage.json with your localities
2. Host file for download
3. Users upload via Min Wage Data Tools
4. Data persists until they reset

### 📞 Support

**California Healthy Nail Salon Collaborative:**
- Email: info@cahealthynailsalons.org
- Phone: (510) 643-4523
- Website: www.cahealthynailsalons.org

**Technical Issues:**
- Include version number (6.0)
- Specify browser and OS
- Describe steps to reproduce issue
- Include screenshot if relevant

### 📊 Analytics (Optional)

**If adding analytics:**
- Respect user privacy
- Comply with GDPR/CCPA
- Provide opt-out mechanism
- Don't track sensitive business data

**Suggested Metrics:**
- Page views
- Feature usage (which tools used)
- Language preferences
- Geographic distribution (aggregate only)

### 🌟 Success Metrics

**Monitor These KPIs:**
- User adoption rate
- Tool usage frequency
- Language distribution
- Mobile vs desktop usage
- Save/load feature usage
- Minimum wage feature adoption

---

**Version 6.0 provides accurate, locality-specific business planning with comprehensive California minimum wage data. Deploy with confidence!**

*Built with ❤️ by volunteer developers at Bankers without Borders for the California Healthy Nail Salon Collaborative*
