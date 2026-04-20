# UNIVERSAL INDEX.HTML TEMPLATE INSTRUCTIONS

## Template File: index-TEMPLATE.html

This template contains placeholders that should be replaced for each city deployment.

## Placeholders to Replace:

### {{CITY_NAME}}
Replace with the city name (e.g., "Cape Town", "Nashville", "New Orleans")
- Used in: title, headers, loading text

### {{CITY_DESCRIPTION}} 
Replace with city-specific description for splash screen
- Examples:
  - Nashville: "from Michelin-starred dining and legendary honky-tonks to songwriter listening rooms and wilderness trails"
  - Cape Town: "from world-class wineries and Table Mountain trails to vibrant neighborhoods and coastal dining"
  - New Orleans: "from jazz clubs and Creole cuisine to historic French Quarter walks and bayou adventures"

## Deployment Process:

1. **Copy template**: `index-TEMPLATE.html` → `index.html`
2. **Replace placeholders**: 
   - Find & Replace `{{CITY_NAME}}` with actual city name
   - Find & Replace `{{CITY_DESCRIPTION}}` with city-specific description
3. **Ensure other files are city-specific**:
   - `map.js` (with city center, map key, etc.)
   - `data.js` (with city places and neighborhoods)
4. **Deploy with updated core files**:
   - `ui-favourites.js` (universal, with all fixes)
   - `ui-pdf.js` (universal, with image preloading)
   - `map-core.js` (universal, with auto-refresh)

## Example Usage:

### Nashville:
```
{{CITY_NAME}} → Nashville
{{CITY_DESCRIPTION}} → from Michelin-starred dining and legendary honky-tonks to songwriter listening rooms and wilderness trails
```

### Cape Town:
```
{{CITY_NAME}} → Cape Town  
{{CITY_DESCRIPTION}} → from world-class wineries and Table Mountain trails to vibrant neighborhoods and coastal dining
```

This template ensures consistent fixes and features across all cities while allowing easy customization.
