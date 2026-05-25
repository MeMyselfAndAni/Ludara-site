// A Perfect Day — Venice
// map-venice.js — guide-specific config
// v1 — May 2026: House-curated demo for Ca' Sagredo Hotel
//
// Six categories: Art & History · Bacaro · Dining · Artisan · Wander · Islands
// Nine sestieri/areas: cannaregio, san_polo, castello, dorsoduro,
//                       santa_croce, san_marco, murano, burano, torcello
//
// ⚠️  Keys in NBHD_* objects, neighbourhood bubbles in index-venice.html,
//      and the nbhd field in venice_data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [12.3215, 45.4408];   // [longitude, latitude] — centre of Venice main island
const MAP_ZOOM          = 13.5;
const OFFLINE_CENTER    = { lat: 45.4408, lng: 12.3215 };
const GUIDE_CITY        = 'Venice';
const BLOGGER_NAME      = 'A Perfect Day';
const GUIDE_TIMEZONE    = 'Europe/Rome';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'art':     '#c04a2a',   // Venetian terracotta — churches, palazzi, galleries
  'bacaro':  '#d4a043',   // amber gold — wine bars and cicchetti
  'dining':  '#8b5080',   // deep plum — restaurants
  'artisan': '#5a8060',   // olive green — craft and bookshops
  'wander':  '#5a6a80',   // stone blue-grey — squares, streets, markets
  'island':  '#3a8ab0',   // lagoon blue — Murano, Burano, Torcello
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'art':     'Art & History',
  'bacaro':  'Bacaro',
  'dining':  'Dining',
  'artisan': 'Artisan',
  'wander':  'Wander',
  'island':  'Islands',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'cannaregio': '#c04a2a',
  'san_polo':   '#d4a043',
  'castello':   '#4a7ab0',
  'dorsoduro':  '#7a5090',
  'santa_croce':'#5a8060',
  'san_marco':  '#b07040',
  'murano':     '#3a9ab0',
  'burano':     '#e05090',
  'torcello':   '#806090',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'cannaregio': 'Cannaregio',
  'san_polo':   'San Polo',
  'castello':   'Castello',
  'dorsoduro':  'Dorsoduro',
  'santa_croce':'Santa Croce',
  'san_marco':  'San Marco',
  'murano':     'Murano',
  'burano':     'Burano',
  'torcello':   'Torcello',
};

// ─── Neighbourhood approximate centres ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'cannaregio':  { lat: 45.4450, lng: 12.3280 },
  'san_polo':    { lat: 45.4378, lng: 12.3320 },
  'castello':    { lat: 45.4360, lng: 12.3480 },
  'dorsoduro':   { lat: 45.4305, lng: 12.3260 },
  'santa_croce': { lat: 45.4400, lng: 12.3200 },
  'san_marco':   { lat: 45.4340, lng: 12.3360 },
  'murano':      { lat: 45.4568, lng: 12.3540 },
  'burano':      { lat: 45.4849, lng: 12.4172 },
  'torcello':    { lat: 45.4978, lng: 12.4170 },
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

  map.on('error', function() {
    // Silent reload — client sees nothing, transient errors self-heal
    setTimeout(function() { location.reload(); }, 2000);
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
// ⚠️ DO NOT call initMap() here
