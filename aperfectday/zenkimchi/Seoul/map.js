// A Perfect Day — ZenKimchi / Seoul
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [126.9780, 37.5640];   // lng first, then lat — central Seoul
const MAP_ZOOM          = 12;
const OFFLINE_CENTER    = { lat: 37.5640, lng: 126.9780 };
const GUIDE_CITY        = 'Seoul';
const BLOGGER_NAME      = 'Joe';
// ⚠️ DO NOT add FAVS_KEY here — it lives in ui-favourites.js

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'food':     '#e8724a',
  'pub':      '#d4a043',
  'market':   '#6b9e6e',
  'cafe':     '#8b6bb1',
  'landmark': '#6090c8',
  'nature':   '#50906a',
  'church':   '#c08060',
  'soviet':   '#9080a8',
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'food':     'Restaurants',
  'pub':      'Chicken & Bars',
  'market':   'Markets & Street Food',
  'cafe':     'Cafés & Dessert',
  'landmark': 'Experiences',
  'nature':   'Nature',
  'church':   'Temples & Faith',
  'soviet':   'Soviet',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'nbhd-mapo':       '#e8724a',
  'nbhd-hongdae':    '#d4a043',
  'nbhd-jongno':     '#6b9e6e',
  'nbhd-euljiro':    '#8b6bb1',
  'nbhd-itaewon':    '#6090c8',
  'nbhd-gangnam':    '#c08060',
  'nbhd-noryangjin': '#50906a',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'nbhd-mapo':       'Mapo & Gongdeok',
  'nbhd-hongdae':    'Hongdae & Mangwon',
  'nbhd-jongno':     'Jongno & Insadong',
  'nbhd-euljiro':    'Euljiro & Myeongdong',
  'nbhd-itaewon':    'Itaewon & Yongsan',
  'nbhd-gangnam':    'Gangnam & Jamsil',
  'nbhd-noryangjin': 'Noryangjin & Yeouido',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'nbhd-mapo':       { lat: 37.5468, lng: 126.9515 },
  'nbhd-hongdae':    { lat: 37.5566, lng: 126.9235 },
  'nbhd-jongno':     { lat: 37.5745, lng: 126.9860 },
  'nbhd-euljiro':    { lat: 37.5640, lng: 126.9900 },
  'nbhd-itaewon':    { lat: 37.5345, lng: 126.9940 },
  'nbhd-gangnam':    { lat: 37.5100, lng: 127.0400 },
  'nbhd-noryangjin': { lat: 37.5145, lng: 126.9430 },
};

// ─── Map init — DO NOT call initMap() here ───────────────────────────────────
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
