// A Perfect Story Map — Book Maps
// map.js — Shantaram (Gregory David Roberts, 2003) — guide-specific config
// v1 — July 2026: UNLISTED CONCEPT DEMO for publisher pitches.
// Not affiliated with the author or publisher. Scene references are
// described in our own words; no text from the novel is reproduced.
//
// Four categories: Lin's Bombay · Friends & Lovers · Underworld & Prison · The Long Journeys
// Four regions: colaba, city, maha, afghan
//
// ⚠️  Keys in NBHD_* objects, region bubbles in index.html,
//      and the nbhd field in data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [72.8280, 18.9400];   // [longitude, latitude] — South Bombay
const MAP_ZOOM          = 12;
const OFFLINE_CENTER    = { lat: 18.9400, lng: 72.8280 };
const GUIDE_CITY        = 'Bombay';
const BLOGGER_NAME      = 'A Perfect Story Map';
const GUIDE_TIMEZONE    = 'Asia/Kolkata';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'life':    '#c04a2a',   // burnt orange — Lin's daily Bombay
  'bond':    '#d4a043',   // amber gold — friends, lovers, Leopold's
  'dark':    '#5a6a80',   // stone grey-blue — underworld and prison
  'journey': '#3a8ab0',   // horizon blue — the village and the war
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'life':    "Lin's Bombay",
  'bond':    'Friends & Lovers',
  'dark':    'Underworld & Prison',
  'journey': 'The Long Journeys',
};

// ─── Region colours ────────────────────────────────────────────────────────────
const NBHD_COLORS = {
  'colaba': '#c04a2a',
  'city':   '#d4a043',
  'maha':   '#5a8060',
  'afghan': '#5a6a80',
};

// ─── Region display labels ─────────────────────────────────────────────────────
const NBHD_LABELS = {
  'colaba': 'Colaba',
  'city':   'Greater Bombay',
  'maha':   'Maharashtra',
  'afghan': 'Afghanistan',
};

// ─── Region approximate centres ───────────────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'colaba': { lat: 18.9190, lng: 72.8280 },
  'city':   { lat: 18.9900, lng: 72.8300 },
  'maha':   { lat: 17.9000, lng: 74.5000 },
  'afghan': { lat: 31.6200, lng: 65.7100 },
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
