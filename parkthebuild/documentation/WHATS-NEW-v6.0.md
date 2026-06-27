# What's New in Version 6.0
## CHNSC Nail Salon Business Tools - December 15, 2025

### 🌟 Major New Features

#### 💰 Dynamic California Minimum Wage System
The most significant update in v6.0 brings comprehensive, locality-specific minimum wage data integration:

**California Minimum Wage Database**
- **2025 & 2026 Data**: Pre-loaded with minimum wage rates for 40+ California cities and counties
- **Searchable Dropdown**: Easy-to-use locality selector with real-time search
- **Small Employer Rates**: Special rates for businesses with 25 or fewer employees
- **Automatic Updates**: W2 hourly wage automatically updates based on selected minimum wage
- **Data Source**: UC Berkeley Labor Center - California City and County Minimum Wages

**Key Features:**
- Year selection (2025, 2026, and beyond)
- Locality-specific rates (San Francisco, Los Angeles, Oakland, San Jose, and 36+ more)
- Small employer rate checkbox for eligible businesses
- Display toggle to show/hide small employer rates in dropdown
- Real-time minimum wage display ($XX/hour)

#### 📤 Minimum Wage Data Management Tools
Users can now manage and update minimum wage data directly in the application:

**Download Feature:**
- Export current minwage.json file
- Contains all locality data and rates
- Standard JSON format for easy editing

**Upload Feature:**
- Import custom minimum wage data
- Add new years (e.g., 2027, 2028)
- Update rates for existing localities
- Add new cities and counties
- Validation ensures proper data structure

**Reset Feature:**
- Restore original built-in data
- Clear custom uploads
- One-click reset functionality

**Data Persistence:**
- Custom data saved in browser localStorage
- Survives page refreshes
- Persists until manually reset

#### 🎯 Smart Wage Integration
**Automatic W2 Hourly Wage Update:**
- W2 employee wage automatically syncs with selected minimum wage
- Real-time updates across all calculations
- Ensures compliance with local minimum wage laws
- Applies to both W2 vs 1099 Model and Break-Even Analysis

**Calculation Impact:**
- Employee cost calculations use locality-specific rates
- Break-even analysis reflects actual minimum wage requirements
- Budget planning based on current legal requirements
- Accurate labor cost projections

#### 📁 Enhanced UI Organization
**Collapsible Minimum Wage Section:**
- New collapsible section for minimum wage selection
- Integrated with expand/collapse all functionality
- Cleaner interface, less scrolling
- Professional presentation matching other sections

**User Experience:**
- Click section header to expand/collapse
- Arrow indicator (▼/▶) shows section state
- Included in "Expand All" and "Collapse All" buttons
- Consistent with application design patterns

### 🔧 Technical Improvements

#### Data Architecture
- **minwage.json**: Structured JSON database with year-based organization
- **localStorage Integration**: Custom data persistence across sessions
- **State Management**: React hooks for dynamic data loading
- **MinWageUploader Component**: Reusable upload/download component

#### Code Quality
- **No Warnings**: Clean production build with zero ESLint warnings
- **Optimized Bundle**: Maintained efficient bundle size (~96 KB gzipped)
- **Type Safety**: Proper data validation for uploaded files
- **Error Handling**: Graceful handling of invalid data uploads

### 📋 Previous Features (v5.0)

#### 🌐 Complete Vietnamese Language Support
- **Full Interface Translation**: Every button, label, form field, and message available in Vietnamese
- **Financial Terminology**: Accurate translation of tax terms, employment classifications, and business concepts
- **Legal Disclaimers**: Proper translation of compliance notices and legal text
- **Save/Load Dialogs**: Complete translation of data management interfaces

#### 🎨 Professional Social Media Icons
- **Instagram**: Professional camera logo with hover effects
- **Facebook**: Official "f" logo design
- **X (Twitter)**: Updated X logo following rebrand
- **SVG Format**: Crisp display at all resolutions

### 🎯 How to Use New Features

#### Setting Up Minimum Wage
1. Navigate to **W2 vs 1099 Employment Model**
2. Find the **Minimum Wage Selection** section at the top
3. Select your year (2025 or 2026)
4. Search and select your city/county from the dropdown
5. If applicable, check "Use Small Employer Rate"
6. Watch as W2 Hourly Wage updates automatically

#### Managing Minimum Wage Data
1. Expand **Min Wage Data Tools** in the Minimum Wage section
2. Click **Download Current Data** to get minwage.json
3. Edit the file to add 2027 rates or new localities:
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
4. Click **Upload** and select your modified file
5. New data immediately available in dropdowns

#### Showing Small Employer Rates
1. Check **"Show Small Employer rates in dropdown"**
2. Dropdown now displays: "$X/hour | Small: $Y/hour"
3. See which localities have small employer rates
4. Makes it easy to compare rates at a glance

### 🌍 California Minimum Wage Coverage

**Included Localities (40+ cities/counties):**
- Alameda
- Belmont
- Berkeley
- Burlingame
- Cupertino
- Daly City
- East Palo Alto
- El Cerrito
- Emeryville
- Foster City
- Fremont
- Half Moon Bay
- Hayward (with small employer rate)
- Los Altos
- Los Angeles City
- Los Angeles County
- Malibu
- Menlo Park
- Milpitas
- Mountain View
- Novato (with small employer rate)
- Oakland
- Palo Alto
- Pasadena
- Petaluma
- Redwood City
- Richmond
- San Carlos
- San Diego
- San Francisco
- San Jose
- San Mateo City
- San Mateo County
- Santa Clara
- Santa Monica
- Santa Rosa
- Sonoma (with small employer rate)
- South San Francisco
- Sunnyvale
- West Hollywood
- **Plus**: California State Minimum

### 📱 Mobile & Desktop Compatibility

All new features fully responsive:
- **Mobile**: Touch-friendly dropdowns and checkboxes
- **Tablet**: Optimized layouts for medium screens
- **Desktop**: Full-featured interface
- **Progressive Web App**: Install as app on mobile devices

### 🔄 Migration from v5.0

**Seamless Upgrade:**
- All saved data from v5.0 works in v6.0
- No manual data migration needed
- Existing W2 vs 1099 scenarios preserved
- New minimum wage features optional

**Automatic Benefits:**
- Hardcoded $20 CA minimum wage replaced with dynamic selection
- More accurate calculations for different localities
- Future-proof with custom data upload capability

### 🎉 Impact Summary

#### For Nail Salon Owners
- **Compliance**: Ensure you're paying correct minimum wage for your location
- **Planning**: Budget with accurate locality-specific labor costs
- **Comparison**: Compare costs across different California cities
- **Future Planning**: Upload projected future minimum wages for long-term planning

#### For Accountants & Consultants
- **Professional Tool**: Provide clients with accurate, location-based calculations
- **Time Savings**: No more manual minimum wage lookups
- **Credibility**: Use official UC Berkeley Labor Center data
- **Customization**: Upload client-specific wage scenarios

#### For Organizations
- **Scalability**: Easy to update data for new years
- **Flexibility**: Support multiple locations with different minimum wages
- **Education**: Help members understand local wage requirements
- **Maintenance**: Community can contribute updated wage data

### 🔮 Foundation for Future

#### Planned Enhancements
- Additional California localities as new ordinances pass
- Historical data (2023, 2024) for trend analysis
- Automatic data updates from Berkeley Labor Center
- Multi-state support (Oregon, Washington, etc.)
- Living wage calculations
- Cost of living adjustments

#### Extensibility
- **Translation Ready**: New minimum wage features support Vietnamese translation
- **API Ready**: Structure supports future API integration
- **Data Driven**: Easy to expand to other types of economic data
- **Community Driven**: Open to user-contributed data updates

### 📊 Technical Specifications

#### New Files
- `src/data/minwage.json` - Minimum wage database
- `src/components/common/MinWageUploader.js` - Upload/download component

#### Updated Components
- `NailSalonW2vs1099Model.js` - Integrated minimum wage selection
- `NailSalonBreakEvenModel.js` - Uses minimum wage from W2vs1099 data

#### Bundle Impact
- **Size**: +1.32 KB gzipped (negligible impact)
- **Performance**: No measurable performance impact
- **Load Time**: Same fast loading

### 🏆 Quality Assurance

- ✅ Zero build warnings
- ✅ Zero runtime errors
- ✅ Clean ESLint output
- ✅ Mobile responsive verified
- ✅ Data validation implemented
- ✅ localStorage persistence tested
- ✅ Upload/download functionality verified
- ✅ Small employer rate logic validated

---

**Version 6.0 represents a major advancement in providing accurate, locality-specific labor cost calculations for California nail salon businesses, while maintaining the professional quality and bilingual support established in v5.0.**

*Built with ❤️ by volunteer developers at Bankers without Borders for the California Healthy Nail Salon Collaborative*

*Special thanks to UC Berkeley Labor Center for providing comprehensive California minimum wage data.*
