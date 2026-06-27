# CHNSC Nail Salon Business Tools v6.0
## Complete Release Package - December 15, 2025

### 🎯 What's New in Version 6.0

**Major Features:**
- ✅ **Dynamic California Minimum Wage System** - Locality-specific minimum wage database with 40+ cities
- ✅ **Minimum Wage Data Management** - Download, edit, and upload custom minimum wage data
- ✅ **Automatic W2 Wage Updates** - W2 hourly wage automatically syncs with selected minimum wage
- ✅ **Small Employer Rate Support** - Special rates for businesses with 25 or fewer employees
- ✅ **Collapsible UI Sections** - Enhanced organization with collapsible minimum wage section
- ✅ **UC Berkeley Labor Center Data** - Official 2025 & 2026 California minimum wage data

**Previous Features (v5.0):**
- ✅ **Complete Vietnamese Translation Support** - All interface elements, forms, and messages
- ✅ **Professional Social Media Icons** - Replaced emojis with official SVG logos
- ✅ **Enhanced Save/Load UI** - Fully translated with improved user experience

### 📦 Package Contents

```
nail-salon-business-tools-v6.0-dec15-2025/
├── CHNSC_StartPage.html                     # Main application entry point
├── static/                                  # Optimized application assets
│   ├── js/                                 # JavaScript bundles (~96 KB gzipped)
│   └── css/                                # Stylesheets
├── documentation/
│   ├── USER-INSTRUCTIONS.html              # Complete user guide with v6.0 features
│   ├── TECHNICAL-DEPLOYMENT-v6.0.html      # Technical deployment guide
│   ├── README-v6.0.md                      # This file
│   ├── WHATS-NEW-v6.0.md                   # Detailed changelog
│   └── DEPLOYMENT-SUMMARY-v6.0.md          # Quick deployment guide
├── manifest.json                            # PWA configuration
├── service-worker.js                        # Offline support
├── robots.txt                               # Search engine directives
└── favicon.ico                              # Application icon
```

### 🚀 Quick Start

**For End Users:**
1. Extract the zip file to your computer
2. Double-click `CHNSC_StartPage.html` to open in your browser
3. Select your language (English/Vietnamese) from the top-right menu
4. **NEW:** Choose your California locality in the Minimum Wage Selection section
5. Start using the business planning tools with accurate local minimum wage data

**For IT Professionals:**
1. Upload the entire folder to your web server
2. Point your domain to `CHNSC_StartPage.html`
3. Enable HTTPS and compression for best performance
4. See `documentation/TECHNICAL-DEPLOYMENT-v6.0.html` for detailed setup
5. **Optional:** Pre-configure minimum wage data for your organization's locations

### 💰 New Minimum Wage Features

**California Minimum Wage Database:**
- 40+ California cities and counties
- 2025 and 2026 data pre-loaded
- Small employer rates (for businesses with ≤25 employees)
- Searchable dropdown with real-time filtering
- Data source: UC Berkeley Labor Center

**Data Management:**
- **Download**: Export current minwage.json file
- **Edit**: Add 2027+ data or new localities
- **Upload**: Import your custom minimum wage data
- **Reset**: Restore original built-in data
- **Persistence**: Custom data saved in browser

**Automatic Integration:**
- W2 hourly wage updates based on selected locality
- Break-even analysis uses location-specific rates
- Budget planning reflects actual minimum wage requirements
- All calculations automatically adjust

### 🌐 Language Support

Complete bilingual support for:
- 🇺🇸 **English** - Full interface translation
- 🇻🇳 **Tiếng Việt** - Complete Vietnamese translation including financial terms, legal disclaimers, and business terminology
- **NEW:** Minimum wage features support both languages

### 💼 Business Tools Included

1. **⚖️ W2 vs 1099 Employment Model Analysis**
   - Compare four employment models for nail technicians
   - **NEW:** Locality-specific minimum wage integration
   - California labor law compliance
   - Tax calculation and cost analysis
   - Small employer rate support

2. **📈 Strategic Break-Even Analysis**
   - Multi-scenario business planning
   - **NEW:** Uses minimum wage from W2vs1099 model
   - Operational efficiency tracking
   - Pricing strategy recommendations

3. **💰 Comprehensive Budget Planning Tool**
   - Complete financial planning suite
   - Revenue and expense tracking
   - **NEW:** Accurate labor costs by locality
   - Break-even calculations

### 🔧 Technical Specifications

- **Framework:** React.js v18.2.0
- **Build:** Optimized production bundle (~96 KB gzipped)
- **Compatibility:** All modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Mobile:** Fully responsive, works on iOS and Android
- **Offline:** Progressive Web App with offline capabilities
- **Storage:** Local storage for data persistence and custom minimum wage data
- **Export:** CSV export functionality
- **Data Format:** JSON-based minimum wage database

### 📱 Deployment Options

**Easy Options:**
- **Local Use:** Just open the HTML file (works offline!)
- **Netlify:** Drag and drop deployment (free tier available)
- **Vercel:** Simple static hosting with automatic HTTPS
- **GitHub Pages:** Free hosting for public repositories

**Advanced Options:**
- **Apache/Nginx:** Traditional web servers
- **AWS S3 + CloudFront:** Scalable cloud hosting
- **Google Cloud Platform:** App Engine or Cloud Storage
- **Microsoft Azure:** Static Web Apps or Blob Storage
- **Custom Servers:** Any HTTP server with static file support

### 🎯 Use Cases for v6.0

**Nail Salon Owners:**
- Ensure compliance with local minimum wage laws
- Budget accurately for different California locations
- Plan expansion to cities with different minimum wages
- Compare labor costs across potential business locations

**Accountants & Business Consultants:**
- Provide clients with location-specific analysis
- No manual minimum wage lookups required
- Professional credibility with official UC Berkeley data
- Support clients in multiple California cities

**Associations & Training Organizations:**
- Educate members about local wage requirements
- Provide tools for multiple member locations
- Keep data current with easy upload feature
- Support statewide initiatives

### 🌍 California Coverage

**Major Cities Included:**
- San Francisco ($18.67/hr)
- Oakland ($16.50/hr)
- Los Angeles City & County
- San Jose ($17.55/hr)
- San Diego ($16.85/hr)
- Berkeley ($18.67/hr)
- **...and 30+ more localities**

**Small Employer Rates Available:**
- Hayward
- Novato
- Sonoma
- *Additional localities as regulations are enacted*

### 📞 Support Information

**California Healthy Nail Salon Collaborative (CHNSC)**
- **Email:** info@cahealthynailsalons.org
- **Phone:** (510) 643-4523
- **Website:** www.cahealthynailsalons.org

**Technical Support:**
- Include version number (6.0) when contacting support
- Provide browser and operating system details
- For minimum wage data questions, reference locality name and year
- Built by volunteer developers at Bankers without Borders

### 🔄 Upgrading from v5.0

**Data Migration:**
- All saved W2 vs 1099 scenarios automatically work in v6.0
- No manual data migration required
- New minimum wage features are optional
- Existing calculations continue to work

**New Benefits:**
- Replace hardcoded CA minimum wage with locality-specific rates
- More accurate labor cost projections
- Compliance with local ordinances
- Future-proof with data upload capability

### 📊 Bundle Size Impact

**v6.0 vs v5.0:**
- Main bundle: 96.94 KB (gzipped) - only +1.32 KB increase
- New minwage.json: ~15 KB uncompressed
- MinWageUploader component: Minimal size impact
- **Total Impact:** Negligible for end users

### 🏆 Quality Metrics

- ✅ **Zero Build Warnings** - Clean production build
- ✅ **Zero Runtime Errors** - Thoroughly tested
- ✅ **Mobile Verified** - Tested on iOS and Android
- ✅ **Cross-Browser** - Works on all modern browsers
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **Performance** - Lighthouse score maintained
- ✅ **Data Validation** - Invalid uploads handled gracefully

### 🎓 Documentation

**For Users:**
- `USER-INSTRUCTIONS.html` - Complete guide with screenshots
- `WHATS-NEW-v6.0.md` - Detailed feature descriptions
- In-app tooltips and help text

**For Developers/IT:**
- `TECHNICAL-DEPLOYMENT-v6.0.html` - Server configuration and deployment
- `DEPLOYMENT-SUMMARY-v6.0.md` - Quick reference guide
- Inline code documentation

**For Data Managers:**
- JSON schema documentation in TECHNICAL-DEPLOYMENT
- Sample minwage.json structure
- Validation rules and requirements

### 🔮 Roadmap

**Planned for v6.x Updates:**
- Additional California localities as ordinances pass
- 2027 minimum wage data (when available)
- Historical data (2023-2024) for trend analysis
- Minimum wage effective date warnings

**Future Considerations:**
- Multi-state support (Oregon, Washington, Nevada)
- Living wage calculations
- Automatic data updates via API
- Cost of living adjustments
- Industry-specific wage comparisons

### 📜 License & Attribution

**Data Sources:**
- Minimum wage data: UC Berkeley Labor Center
- Last updated: December 2, 2025
- Source: https://laborcenter.berkeley.edu/inventory-of-us-city-and-county-minimum-wage-ordinances/

**Application:**
- Built with React.js (MIT License)
- Developed by volunteer developers
- Sponsored by Bankers without Borders
- For California Healthy Nail Salon Collaborative

### 🙏 Acknowledgments

- **UC Berkeley Labor Center** - For comprehensive minimum wage data
- **Bankers without Borders** - Volunteer development support
- **Wells Fargo Global Fellows** - Development team
- **CHNSC Leadership** - Requirements and testing
- **Nail Salon Community** - Feedback and real-world testing

---

**Version 6.0 represents a significant advancement in providing accurate, locality-specific business planning tools for California nail salons. The new minimum wage features ensure compliance and accurate financial planning while maintaining the professional quality and bilingual support that made v5.0 successful.**

**🎯 Download, deploy, and start planning with confidence!**
