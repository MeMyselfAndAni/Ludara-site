# Universal Template Deployment Guide

## 🎯 Purpose
This template system prevents the neighborhood mismatch issues that broke Cape Town deployment. Use this for all new city deployments.

## 📋 Files Included

### 1. `index-UNIVERSAL-TEMPLATE.html`
- Universal index.html with placeholders
- Contains ALL implemented fixes:
  - ✅ 3-hour driving logic integration
  - ✅ Universal distance functionality  
  - ✅ Image preloading for PDF
  - ✅ Google Maps ordering consistency
  - ✅ Neighborhood template system

### 2. `index-capetown-COMPLETE.html`
- Complete working Cape Town index
- Example of properly configured city deployment
- All fixes implemented and tested

## 🔧 How to Deploy New City

### Step 1: Copy Template
```bash
cp index-UNIVERSAL-TEMPLATE.html index-[CITYNAME].html
```

### Step 2: Replace Placeholders
Replace these placeholders with city-specific content:

- `{{CITY_NAME}}` → "Nashville", "Cape Town", "London", etc.
- `{{CITY_DESCRIPTION}}` → City-specific description for splash screen
- `{{NEIGHBORHOOD_BUBBLES}}` → City-specific neighborhood HTML (see Step 3)

### Step 3: Critical - Neighborhood Configuration

**⚠️ THIS IS WHERE CAPE TOWN BROKE ⚠️**

1. **Check data.js neighborhoods:**
   ```javascript
   // Find unique neighborhoods in data.js:
   [...new Set(PLACES.map(p => p.nbhd))]
   ```

2. **Check map.js neighborhood config:**
   ```javascript
   NBHD_COLORS = { 'city': '#color', 'peninsula': '#color', ... }
   NBHD_LABELS = { 'city': 'City & Sea Point', ... }
   ```

3. **Create matching HTML bubbles:**
   ```html
   <div class="nbhd-bubble" id="nbhd-city" role="button" onclick="selectNbhd('city', this)">
     <div class="nbhd-ring"><div class="nbhd-ring-inner">🏢</div></div>
     <span class="nbhd-label">City & Sea Point</span>
   </div>
   ```

4. **CRITICAL: IDs must match exactly:**
   - data.js: `nbhd: 'city'` 
   - HTML: `id="nbhd-city"`
   - JavaScript: `selectNbhd('city', this)`

### Step 4: Verify with Enhanced QA
Run the enhanced QA script to catch mismatches:
```bash
qa-verify-enhanced.bat
```

## 🚨 Common Mistakes to Avoid

### 1. Wrong Neighborhood IDs
**Cape Town Issue:** Had Nashville neighborhoods (downtown, gulch) but Cape Town data (city, peninsula)
**Solution:** Always match HTML IDs to data.js nbhd properties

### 2. Missing Neighborhood Labels  
**Issue:** Bubbles with wrong labels confuse users
**Solution:** Use NBHD_LABELS from map.js for bubble text

### 3. Copy-Paste Errors
**Issue:** Copying Nashville template to Cape Town without changing neighborhoods
**Solution:** Always verify neighborhood sections specifically

## 🛡️ QA Verification Checklist

Before going live, verify:

- [ ] **Data Match:** HTML neighborhood IDs match data.js nbhd properties
- [ ] **Config Match:** All HTML neighborhoods exist in NBHD_COLORS/NBHD_LABELS
- [ ] **No Orphans:** No neighborhoods in HTML that don't exist in data
- [ ] **No Nashville:** No `nbhd-downtown` or other wrong city neighborhoods
- [ ] **All Placeholders:** All {{PLACEHOLDER}} text replaced
- [ ] **QA Pass:** Enhanced QA script returns 0 errors

## 🔄 Example Neighborhood Configurations

### Nashville
```javascript
// data.js neighborhoods:
['downtown', 'germantown', 'gulch', 'east', '12south', 'midtown', 'parks']

// HTML bubbles:
<div class="nbhd-bubble" id="nbhd-downtown">Downtown</div>
<div class="nbhd-bubble" id="nbhd-germantown">Germantown</div>
```

### Cape Town  
```javascript
// data.js neighborhoods:
['city', 'peninsula', 'stellenbosch', 'franschhoek', 'west-coast']

// HTML bubbles:
<div class="nbhd-bubble" id="nbhd-city">City & Sea Point</div>
<div class="nbhd-bubble" id="nbhd-peninsula">Southern Peninsula</div>
```

### London (Future Example)
```javascript
// data.js neighborhoods:
['central', 'shoreditch', 'notting', 'greenwich', 'south']

// HTML bubbles:
<div class="nbhd-bubble" id="nbhd-central">Central London</div>
<div class="nbhd-bubble" id="nbhd-shoreditch">Shoreditch</div>
```

## 🎯 Universal Files (Same for All Cities)
These files are shared across all cities:
- `ui-favourites.js` (3-hour driving logic)
- `ui-pdf.js` (image preloading)
- `ui-filter.js` (filtering logic)
- `ui-stories.js` (neighborhood interaction)
- `map-core.js` (universal map functions)
- `universal-distance-functionality.js`

## 📁 City-Specific Files (Unique per City)
These files must be customized per city:
- `index.html` (THIS template - neighborhoods critical!)
- `data.js` (places with nbhd properties)
- `map.js` (NBHD_COLORS, NBHD_LABELS, city config)
- `photos.js` (city-specific images)

## 🆘 Troubleshooting

### "Only All button shows, no neighborhoods"
**Diagnosis:** Neighborhood ID mismatch
**Fix:** Check data.js nbhd properties vs HTML id attributes

### "Neighborhoods show but don't filter"
**Diagnosis:** JavaScript function issues
**Fix:** Check console for selectNbhd errors, verify ui-stories.js loaded

### "Wrong neighborhood names"
**Diagnosis:** Copied from wrong city
**Fix:** Replace HTML bubbles with city-specific ones

### "QA script reports errors"
**Diagnosis:** Configuration mismatch detected
**Fix:** Follow QA error messages, usually neighborhood ID issues

## 🎉 Success Checklist

When deployment works correctly:
- ✅ All city neighborhoods visible in bubble bar
- ✅ Clicking neighborhoods filters places correctly  
- ✅ Google Maps shows correct travel times/modes
- ✅ PDF generation includes correct neighborhoods
- ✅ Enhanced QA script reports 0 errors
- ✅ No console errors in browser

---

**Remember: The Cape Town issue took hours to debug because of neighborhood ID mismatches. This template system prevents that by making the critical points explicit and adding verification steps.**
