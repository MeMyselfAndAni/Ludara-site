// A Perfect Day — Ludara / Ramat HaSharon
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [34.8395, 32.1466];   // lng, lat
const MAP_ZOOM          = 14;
const OFFLINE_CENTER    = { lat: 32.1466, lng: 34.8395 };
const GUIDE_CITY        = 'Ramat HaSharon';
const BLOGGER_NAME      = 'Ludara';

// ─── Category colours ────────────────────────────────────────────────────────
const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'pub':      '#8b6bb1',
  'market':   '#c08060',
  'nature':   '#50906a',
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'landmark': 'Landmarks',
  'food':     'Restaurants',
  'cafe':     'Cafés',
  'pub':      'Bars',
  'market':   'Markets',
  'nature':   'Parks & Nature',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'nbhd-sokolov': '#e8724a',
  'nbhd-ahuza':   '#d4a043',
  'nbhd-glilot':  '#6b9e6e',
  'nbhd-park':    '#50906a',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'nbhd-sokolov': 'Sokolov & Center',
  'nbhd-ahuza':   'Ahuza',
  'nbhd-glilot':  'Glilot & South',
  'nbhd-park':    'Parks & North',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'nbhd-sokolov': { lat: 32.145617, lng: 34.839814 },
  'nbhd-ahuza':   { lat: 32.1560,   lng: 34.8460   },
  'nbhd-glilot':  { lat: 32.1300,   lng: 34.8320   },
  'nbhd-park':    { lat: 32.139039, lng: 34.845795  },
};

// ─── Map init ────────────────────────────────────────────────────────────────
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
      document.getElementById('loading').style.display = 'none';
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try { map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name']]); } catch(e) {}
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
      if (el) { el.style.display = 'flex'; el.innerHTML = '<div style="color:red;padding:20px;font-size:12px;font-family:monospace;">ERROR: ' + err.message + '</div>'; }
      console.error('Map load error:', err);
    }
  });
}
// ⚠️ DO NOT call initMap() here
