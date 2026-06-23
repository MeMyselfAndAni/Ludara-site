// A Perfect Day — Tel Aviv, for The Drisco Hotel
// map.js — guide-specific config
// v1 — June 2026: sample for The Drisco Hotel (Relais & Châteaux)
//
// Seven categories: Stay · Dining · Café · Bar · Culture · Shop · Wellness
// Six areas: colony, oldjaffa, fleamarket, nevetzedek, florentin, jaffaport
//
// ⚠️  Keys in NBHD_* objects, neighbourhood bubbles in index.html,
//      and the nbhd field in data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [34.7625, 32.0560];   // [longitude, latitude] — Jaffa / American-German Colony
const MAP_ZOOM          = 14.2;
const OFFLINE_CENTER    = { lat: 32.0560, lng: 34.7625 };
const GUIDE_CITY        = 'Tel Aviv';
const BLOGGER_NAME      = 'A Perfect Day';
const GUIDE_TIMEZONE    = 'Asia/Jerusalem';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'stay':     '#1a3a5c',   // deep navy — The Drisco
  'dining':   '#c0492a',   // terracotta — restaurants
  'cafe':     '#c98a2b',   // warm amber — cafés and bakeries
  'bar':      '#8b5080',   // plum — bars and wine bars
  'culture':  '#4a7ab0',   // blue — galleries and cinema
  'shop':     '#5a8060',   // olive — design and markets
  'wellness': '#2f8f7f',   // teal — wellness and spa
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'stay':     'The Drisco',
  'dining':   'Dining',
  'cafe':     'Café & Bakery',
  'bar':      'Bar & Wine',
  'culture':  'Art & Culture',
  'shop':     'Design & Shops',
  'wellness': 'Wellness',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'colony':     '#1a3a5c',
  'oldjaffa':   '#c0492a',
  'fleamarket': '#c98a2b',
  'nevetzedek': '#5a8060',
  'florentin':  '#8b5080',
  'jaffaport':  '#3a8ab0',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'colony':     'The Colony',
  'oldjaffa':   'Old Jaffa',
  'fleamarket': 'Flea Market',
  'nevetzedek': 'Neve Tzedek',
  'florentin':  'Florentin',
  'jaffaport':  'Jaffa Port',
};

// ─── Neighbourhood approximate centres ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'colony':     { lat: 32.0590, lng: 34.7618 },
  'oldjaffa':   { lat: 32.0538, lng: 34.7556 },
  'fleamarket': { lat: 32.0542, lng: 34.7588 },
  'nevetzedek': { lat: 32.0623, lng: 34.7672 },
  'florentin':  { lat: 32.0572, lng: 34.7685 },
  'jaffaport':  { lat: 32.0500, lng: 34.7508 },
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
