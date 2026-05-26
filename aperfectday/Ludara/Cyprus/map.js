// A Perfect Day — Cyprus
// map.js — guide-specific config
// v1 — May 2026: Demo for Elysium Hotel, Paphos
//
// Four categories: Dining · Churches & Monasteries · Heritage · Nature & Trails
// Four regions: paphos (coast & city), akamas (wild northwest),
//               troodos (mountain heart), lefkara (village heritage)
//
// ⚠️  Keys in NBHD_* objects, neighbourhood bubbles in index.html,
//      and the nbhd field in data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [32.75, 34.88];    // [longitude, latitude] — western Cyprus
const MAP_ZOOM          = 10.2;
const OFFLINE_CENTER    = { lat: 34.88, lng: 32.75 };
const GUIDE_CITY        = 'Cyprus';
const BLOGGER_NAME      = 'A Perfect Day';
const GUIDE_TIMEZONE    = 'Asia/Nicosia';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'dining':   '#c04020',   // Cypriot terracotta — restaurants and tavernas
  'church':   '#b8902a',   // Byzantine gold — churches and monasteries
  'heritage': '#2a5a8a',   // Aegean blue — archaeological and UNESCO sites
  'hike':     '#4a7a50',   // Mediterranean sage — nature, trails, gorges
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'dining':   'Restaurants',
  'church':   'Churches & Monasteries',
  'heritage': 'Heritage & Villages',
  'hike':     'Nature & Trails',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'paphos':   '#2a5a8a',   // Aegean sea blue
  'akamas':   '#4a7a50',   // wild forest green
  'troodos':  '#7a5090',   // mountain lavender
  'lefkara':  '#b8902a',   // golden village ochre
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'paphos':   'Paphos',
  'akamas':   'Akamas',
  'troodos':  'Troodos',
  'lefkara':  'Lefkara & Villages',
};

// ─── Neighbourhood approximate centres ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'paphos':   { lat: 34.78,  lng: 32.42 },
  'akamas':   { lat: 35.00,  lng: 32.35 },
  'troodos':  { lat: 34.93,  lng: 32.85 },
  'lefkara':  { lat: 34.87,  lng: 33.20 },
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
