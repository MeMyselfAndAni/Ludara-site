// A Perfect Day — Nomadic Matt / Bangkok
// map.js — guide-specific config
// Only this file + index.html + data.js + images/ live permanently in the guide folder.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [100.5018, 13.7480];   // [lng, lat] — central Bangkok
const MAP_ZOOM          = 13;
const OFFLINE_CENTER    = { lat: 13.7480, lng: 100.5018 };
const GUIDE_CITY        = 'Bangkok';
const BLOGGER_NAME      = 'Matt';

// ─── Neighbourhood palette ──────────────────────────────────────────────────
// ─── Category colours (used by map-core.js makeIconHTML) ────────────────────
const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'church':   '#6090c8',
  'market':   '#c08060',
  'soviet':   '#9080a8',
  'nature':   '#50906a',
};

const NBHD_COLORS = {
  'old-city':   '#e8724a',   // warm terracotta — historic temples & palaces
  'chinatown':  '#d4a043',   // golden amber — lanterns & noodle steam
  'silom':      '#4a90d9',   // sky blue — modern parks & culture
  'sukhumvit':  '#7b68c8',   // indigo — shopping & skytrain energy
  'riverside':  '#4ab8a0',   // teal — the Chao Phraya
  'thonglor':   '#c8687b',   // rose — fashionable nightlife district
};

// ─── Display labels ─────────────────────────────────────────────────────────
const NBHD_LABELS = {
  'old-city':   'Old City',
  'chinatown':  'Chinatown',
  'silom':      'Silom & Siam',
  'sukhumvit':  'Sukhumvit',
  'riverside':  'Riverside',
  'thonglor':   'Thong Lo',
};

// ─── Approximate geographic centers (used for circle + pan) ─────────────────
const NBHD_APPROX_CENTERS = {
  'old-city':   { lat: 13.7510, lng: 100.4927 },
  'chinatown':  { lat: 13.7401, lng: 100.5097 },
  'silom':      { lat: 13.7310, lng: 100.5290 },
  'sukhumvit':  { lat: 13.7380, lng: 100.5620 },
  'riverside':  { lat: 13.7230, lng: 100.5140 },
  'thonglor':   { lat: 13.7228, lng: 100.5847 },
};

// ─── Map initialisation ──────────────────────────────────────────────────────
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

      // Force English map labels
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', 'name:en'],
              ['get', 'name'],
            ]);
          } catch (e) { /* some layers reject this — safe to ignore */ }
        }
      });

      // Build neighbourhood circles + init shared sources
      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();

      // Clear any stale route data
      if (map.getSource('trip-route')) {
        map.getSource('trip-route').setData({ type: 'FeatureCollection', features: [] });
      }

      // Drop all markers + wire up shared UI
      PLACES.forEach(p => addMarker(p));
      if (typeof applyFilters   === 'function') applyFilters();
      if (typeof renderList     === 'function') renderList();
      if (typeof initFavourites === 'function') initFavourites();
      if (typeof alignNbhdBar   === 'function') alignNbhdBar();

    } catch(err) {
      const el = document.getElementById('loading');
      if(el){ el.style.display='flex'; el.innerHTML='<div style="color:red;padding:20px;font-size:12px;font-family:monospace;">ERROR: '+err.message+'</div>'; }
    }
  });
}
