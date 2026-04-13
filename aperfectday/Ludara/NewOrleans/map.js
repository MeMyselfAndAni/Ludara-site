// A Perfect Day — Ludara / New Orleans
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-90.0630, 29.9575];  // ⚠️ [longitude, latitude] — Jackson Square
const MAP_ZOOM          = 13;
const OFFLINE_CENTER    = { lat: 29.9575, lng: -90.0630 };
const GUIDE_CITY        = 'New Orleans';
const BLOGGER_NAME      = 'Ludara';
const GUIDE_TIMEZONE    = 'America/Chicago';    // Central Time

// ─── Category colours ─────────────────────────────────────────────────────────
// New Orleans palette: warm, vibrant, Creole-inspired
const CC = {
  'landmark': '#c8522a',   // deep Creole orange-red
  'food':     '#d4902a',   // Louisiana gold
  'cafe':     '#6b9e6e',   // bayou green — cafés & wine bars
  'pub':      '#8b6bb1',   // jazz purple — bars & music venues
  'church':   '#4a90d9',   // blue
  'market':   '#b06040',   // French Market brown
  'nature':   '#4a9a70',   // bayou green
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'landmark': 'Landmarks',
  'food':     'Restaurants',
  'cafe':     'Cafés & Wine',
  'pub':      'Bars & Music',
  'market':   'Shopping',
  'nature':   'Parks & Nature',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'french-quarter':   '#c8522a',
  'marigny-bywater':  '#7b68c8',
  'treme':            '#d4902a',
  'garden-district':  '#4a9a70',
  'warehouse':        '#4a90d9',
  'mid-city':         '#5a8a3a',
  'uptown':           '#b06040',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'french-quarter':   'French Quarter',
  'marigny-bywater':  'Marigny & Bywater',
  'treme':            'Tremé',
  'garden-district':  'Garden District',
  'warehouse':        'Warehouse District',
  'mid-city':         'Mid-City',
  'uptown':           'Uptown',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'french-quarter':  { lat: 29.9576, lng: -90.0651 },
  'marigny-bywater': { lat: 29.9598, lng: -90.0453 },
  'treme':           { lat: 29.9663, lng: -90.0740 },
  'garden-district': { lat: 29.9297, lng: -90.0930 },
  'warehouse':       { lat: 29.9449, lng: -90.0706 },
  'mid-city':        { lat: 29.9810, lng: -90.0840 },
  'uptown':          { lat: 29.9200, lng: -90.1080 },
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
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:50%;left:5%;right:5%;transform:translateY(-50%);background:#900;color:#fff;padding:15px;border-radius:8px;z-index:999999;font-size:12px;font-family:monospace;';
    d.textContent = 'Map error: ' + (e.error ? e.error.message : JSON.stringify(e));
    document.body.appendChild(d);
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
