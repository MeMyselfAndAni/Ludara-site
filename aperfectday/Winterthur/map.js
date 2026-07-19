// A Perfect Day — Winterthur Museum, Garden & Library (Delaware)
// map.js — guide-specific config.
// Interactive visitor map of the estate: the house & galleries, the naturalistic
// garden, Enchanted Woods and visitor services. English demo build.
//
// ⚠️  Keys in NBHD_* objects, the zone bubbles in index.html, and the
//      nbhd field in data.js MUST ALL match exactly (core / east / park).

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-75.60030, 39.80760];   // [longitude, latitude] — house + garden (Google-Maps anchored)
const MAP_ZOOM          = 15.4;
const OFFLINE_CENTER    = { lat: 39.80760, lng: -75.60030 };
const GUIDE_CITY        = 'Winterthur';
const BLOGGER_NAME      = 'A Perfect Day';
const GUIDE_TIMEZONE    = 'America/New_York';
const DISTANCE_UNITS    = 'imperial';
const TIME_FORMAT       = '12h';   // display hours as 10 AM–5 PM (data stored 24h for the Open-now logic)

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'pavilion': '#7a5230',   // brown — house & galleries (indoor)
  'hall':     '#c8761b',   // amber — family (Enchanted Woods)
  'heritage': '#b1892b',   // gold  — tram tour
  'outdoor':  '#3f7d4e',   // green — the garden
  'service':  '#3a6ea5',   // blue  — café, museum store
  'restroom': '#5b7b8a',   // slate — restrooms
};

// ─── Category labels (overwritten by i18n) ────────────────────────────────────
const CL = {
  'pavilion': 'House & Galleries',
  'hall':     'Family',
  'heritage': 'Tram Tour',
  'outdoor':  'Gardens',
  'service':  'Eat & Shop',
};

// ─── Zone ("neighbourhood") colours ───────────────────────────────────────────
const NBHD_COLORS = {
  'core': '#7a5230',
  'east': '#3f7d4e',
  'park': '#3a6ea5',
};

// ─── Zone display labels (overwritten by i18n) ────────────────────────────────
const NBHD_LABELS = {
  'core': 'Museum & House',
  'east': 'The Garden',
  'park': 'Visitor Center',
};

// ─── Zone approximate centres ─────────────────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'core': { lat: 39.80783, lng: -75.60174 },
  'east': { lat: 39.80720, lng: -75.59830 },
  'park': { lat: 39.80900, lng: -75.60390 },
};

// ─── Basemap label language — English estate/place names ──────────────────────
function setBasemapLang(lang) {
  if (typeof map === 'undefined' || !map || !map.getStyle) return;
  var expr = ['coalesce', ['get', 'name:en'], ['get', 'name']];
  try {
    var layers = map.getStyle().layers || [];
    layers.forEach(function (layer) {
      if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
        try { map.setLayoutProperty(layer.id, 'text-field', expr); } catch (e) {}
      }
    });
  } catch (e) {}
}

// ─── Map initialisation ───────────────────────────────────────────────────────
function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    minZoom: 12,
    maxZoom: 19,
    attributionControl: false,
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

  map.on('error', function() {
    // Silent reload — client sees nothing, transient errors self-heal
    setTimeout(function() { location.reload(); }, 2000);
  });

  map.on('load', () => {
    try {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';

      if (typeof setBasemapLang === 'function') setBasemapLang('en');
      if (typeof applyLang === 'function' && typeof getLang === 'function') applyLang(getLang());
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
// ⚠️ DO NOT call initMap() here
