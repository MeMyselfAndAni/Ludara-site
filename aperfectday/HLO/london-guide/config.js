// ── LUDARA GUIDE CONFIG ─────────────────────────────────────────
// This is the ONLY file you need to change per blogger / city.
// Everything else (map.js, ui-*.js, styles.css) reads from here.
// ────────────────────────────────────────────────────────────────

const GUIDE = {

  // ── Blogger ──────────────────────────────────────────────────
  blogger: {
    name:       'Hand Luggage Only',       // Brand name shown in header
    authors:    'Yaya & Lloyd',            // Human names shown in splash
    handle:     '@handluggageonly',        // Social handle
    url:        'https://handluggageonly.co.uk',
    blogLabel:  'Blog',                    // Label for the header button
    blogUrl:    'https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/',
    tagline:    'destination guides, insider tips, foodie spots & hidden gems',
    shortBio:   'London-based travel duo Yaya & Lloyd have been exploring the world together since 2014. Known for their infectious enthusiasm and obsessive attention to the best local food, hidden gems and visual storytelling.',
  },

  // ── City ─────────────────────────────────────────────────────
  city: {
    name:       'London',
    country:    'United Kingdom',
    flag:       '🇬🇧',
    mapCenter:  { lat: 51.5074, lng: -0.1200 },
    mapZoom:    12,
    loadingText:'Loading London…',
  },

  // ── Branding ─────────────────────────────────────────────────
  // These feed into CSS variables via JS on load — see styles.css
  colors: {
    bg:      '#f6f1e9',   // Warm parchment
    accent:  '#1c2b4a',   // HLO navy
    gold:    '#c4880a',   // Warm amber
    text:    '#0f1822',   // Near-black
    surface: '#ffffff',
  },

  // ── Paywall ──────────────────────────────────────────────────
  paywall: {
    freeCount:  8,         // How many places shown before paywall
    price:      '£12',
    cta:        'Unlock all <TOTAL> places →',
  },

  // ── Ludara branding (don't change) ───────────────────────────
  ludara: {
    productName: 'A Perfect Day',
    brandName:   'Ludara.AI',
    url:         'https://ludara.ai',
  },
};
