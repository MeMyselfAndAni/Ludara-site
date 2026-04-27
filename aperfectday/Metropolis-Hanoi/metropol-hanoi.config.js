// ============================================================================
// METROPOL HANOI — Hotel Guide Config
// ============================================================================
// Fill in the values below, then run:
//   node onboard-guide.js configs/hotels/metropol-hanoi.config.js
//
// The script will create aperfectday/metropol-hanoi-qa/ with everything needed
// to deploy. You then edit data.js (places) and deploy via the generated .bat.
// ============================================================================

module.exports = {

  // ── IDENTITY ────────────────────────────────────────────────────────────
  // Branding mode: 'hotel' | 'blogger' | 'ludara'
  mode: 'hotel',

  // URL slug — used as the folder name and deploy URL
  // Result: aperfectday/metropol-hanoi-qa/  →  https://ludara.ai/aperfectday/metropol-hanoi-qa/
  hotelSlug: 'metropol',
  citySlug:  'hanoi',

  // ── BRAND ───────────────────────────────────────────────────────────────
  brand: {
    label:      'Metropol Hanoi',
    url:        'https://hanoi.sofitel-legend.com',
    color:      '#0a1f3d',           // primary brand colour (hex)
    colorName:  'navy',              // human name for comments only

    // Faint + glow auto-derived from `color` if left as null.
    // Override if your brand has specific alpha requirements.
    colorFaint: null,                // e.g. 'rgba(10,31,61,0.12)'
    colorGlow:  null,                // e.g. 'rgba(10,31,61,0.35)'

    byline:     'Curated by Metropol Hanoi',
    cardByline: '— Metropol Hanoi',
  },

  // ── GUIDE META ──────────────────────────────────────────────────────────
  guide: {
    title:       'A Perfect Day in Hanoi by Metropol',
    splashTitle: 'A Perfect Day in Hanoi',
    splashSub:   '50 curated places from your Metropol concierge',
    placeCount:  50,                 // promised number of places on splash
    headerBtnLabel: 'Book a Stay',
    headerBtnUrl:   'https://hanoi.sofitel-legend.com',
    footerLabel: 'metropolhanoi.com',
    footerUrl:   'https://hanoi.sofitel-legend.com',
  },

  // ── CITY ────────────────────────────────────────────────────────────────
  city: {
    name:           'Hanoi',
    mapCenter:      { lat: 21.0285, lng: 105.8542 },
    mapZoom:        13,
    distanceUnits:  'metric',        // 'metric' | 'imperial'
    timeFormat:     '24h',           // '24h' | '12h'
  },

  // ── NEIGHBOURHOODS ──────────────────────────────────────────────────────
  // The `id` must be of the form 'nbhd-<slug>'.
  // `color` shows as the ring colour around the neighbourhood bubble.
  // `lat/lng` is the approximate center (used to zoom/pan when selected).
  // `zoom` is how deep the map zooms when the neighbourhood is tapped.
  neighborhoods: [
    { id: 'nbhd-old-quarter',    label: 'Old Quarter',    emoji: '🏮', color: '#c8102e', lat: 21.034, lng: 105.850, zoom: 16 },
    { id: 'nbhd-french-quarter', label: 'French Quarter', emoji: '🥐', color: '#d4973f', lat: 21.023, lng: 105.853, zoom: 16 },
    { id: 'nbhd-tay-ho',         label: 'Tay Ho',         emoji: '🌸', color: '#6fa8dc', lat: 21.062, lng: 105.819, zoom: 15 },
    { id: 'nbhd-ba-dinh',        label: 'Ba Dinh',        emoji: '🏛️', color: '#a4c2a5', lat: 21.036, lng: 105.832, zoom: 15 },
    { id: 'nbhd-west-lake',      label: 'West Lake',      emoji: '🛶', color: '#e8a87c', lat: 21.050, lng: 105.830, zoom: 15 },
  ],

  // ── CATEGORIES ──────────────────────────────────────────────────────────
  // Pick which category pills appear on the filter bar for THIS city.
  // Valid IDs: landmark, food, cafe, market, pub, church, soviet, nature
  // Labels are overridable (e.g. in Hanoi "pub" reads better as "Bars & Nightlife").
  categories: [
    { id: 'landmark', label: 'Sights'              },
    { id: 'food',     label: 'Restaurants'         },
    { id: 'cafe',     label: 'Cafés'               },
    { id: 'market',   label: 'Markets & Street Food' },
    { id: 'pub',      label: 'Bars & Nightlife'    },
  ],

};
