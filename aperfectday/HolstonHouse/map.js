// A Perfect Day — Ludara / Nashville
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-86.7879, 36.1500];  // ⚠️ [longitude, latitude] — between Downtown and Gulch
const MAP_ZOOM          = 13;
const OFFLINE_CENTER    = { lat: 36.1500, lng: -86.7879 };
const GUIDE_CITY        = 'Nashville';
const BLOGGER_NAME      = 'Ludara';
const GUIDE_TIMEZONE    = 'America/Chicago';    // Central Time
const TIME_FORMAT       = '12h';               // Display hours in AM/PM for US guides
const DISTANCE_UNITS    = 'imperial';         // Use feet/miles for US guides

// ─── Category colours ─────────────────────────────────────────────────────────
// Nashville palette — updated May 2026 to match staff category system
const CC = {
  'breakfast':  '#E87C3E',   // Warm orange-gold — morning warmth
  'lunch':      '#5A9E74',   // Fresh green — midday energy
  'dinner':     '#8B1A2F',   // Deep burgundy — evening dining
  'bbq':        '#C4520A',   // Burnt sienna — smoke and fire
  'bar':        '#6B3FA0',   // Deep purple — Music Row nights
  'music':      '#1A5FAB',   // Nashville blue — stage lights
  'attraction': '#CC2F2F',   // Tennessee brick — landmarks
  'shopping':   '#2E8B8B',   // Warm teal — boutique and curated
  'boots':      '#8B5E3C',   // Saddle brown — western leather
  'parks':      '#3D7A50',   // Forest green — nature and greater Nashville
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'breakfast':  'Breakfast & Brunch',
  'lunch':      'Lunch',
  'dinner':     'Dinner',
  'bbq':        'BBQ',
  'bar':        'Bars & Honky Tonks',
  'music':      'Music Venues',
  'attraction': 'Attractions',
  'shopping':   'Shopping',
  'boots':      'Boot Shops',
  'parks':      'Parks',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'downtown':   '#ff2a00',   // Brick orange — honky-tonk warmth
  'germantown': '#5a8a6e',   // Victorian green — historic streets
  'gulch':      '#6b5b9a',   // Deep purple — polished and creative
  'east':       '#d4883a',   // Amber — independent East Nashville energy
  '12south':    '#4a90b8',   // Cool blue — boutique and curated
  'midtown':    '#7a9e5e',   // Sage — campus greenery and parks
  'parks':      '#3d7a50',   // Forest green — nature and greater Nashville
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'downtown':   'Downtown',
  'germantown': 'Germantown',
  'gulch':      'The Gulch',
  'east':       'East Nashville',
  '12south':    '12 South',
  'midtown':    'Midtown',
  'parks':      'Parks & Day Trips',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'downtown':   { lat: 36.1600, lng: -86.7779 },
  'germantown': { lat: 36.1715, lng: -86.7836 },
  'gulch':      { lat: 36.1525, lng: -86.7872 },
  'east':       { lat: 36.1820, lng: -86.7570 },
  '12south':    { lat: 36.1250, lng: -86.7875 },
  'midtown':    { lat: 36.1350, lng: -86.8060 },
  'parks':      { lat: 36.0900, lng: -86.8600 },
};

// ─── Map initialisation ───────────────────────────────────────────────────────
function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    attributionControl: false,
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

  map.on('error', function(e) {
    // Don't reload — tile errors are normal offline; map recovers when connectivity returns
    console.warn('Map tile error (offline?):', e && e.error ? e.error.message : '');
  });

  map.on('load', () => {
    try {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';

      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce', ['get', 'name:en'], ['get', 'name'],
            ]);
          } catch(e) {}
        }
      });

      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();
      if (map.getSource('trip-route')) {
        map.getSource('trip-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
      }

      PLACES.forEach(p => addMarker(p));
      if (typeof applyFilters   === 'function') applyFilters();
      if (typeof renderList     === 'function') renderList();
      if (typeof initFavourites === 'function') initFavourites();
      if (typeof alignNbhdBar   === 'function') alignNbhdBar();

    } catch (err) {
      const el = document.getElementById('loading');
      if (el) {
        el.style.display = 'flex';
        el.innerHTML = '<div style="color:red;padding:20px;font-size:12px;font-family:monospace;">ERROR: ' + err.message + '</div>';
      }
      console.error('Map load error:', err);
    }
  });
}
// ⚠️ DO NOT call initMap() here — index.html fires it via window.addEventListener('load', initMap)

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').catch(function(err) {
      console.warn('Service worker registration failed:', err);
    });
  });
}
