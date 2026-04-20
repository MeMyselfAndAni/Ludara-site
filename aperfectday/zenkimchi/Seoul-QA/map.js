// A Perfect Day — ZenKimchi / Seoul
// map.js — guide-specific config
// Only this file + index.html + data.js + images/ live permanently in the guide folder.
//
// ⚠️  CHECKLIST before deploying:
//   [x] MAP_CENTER set to [lng, lat] of Seoul city centre (longitude FIRST)
//   [x] GUIDE_CITY and BLOGGER_NAME filled in
//   [x] CC and CL both present (both required — map-core.js will throw without them)
//   [x] NBHD_COLORS, NBHD_LABELS, NBHD_APPROX_CENTERS all have matching keys
//   [x] Neighbourhood keys here match data.js nbhd values AND index.html bubble IDs
//   [x] initMap() is NOT called at the bottom of this file
//   [x] FAVS_KEY is NOT declared here (it lives in ui-favourites.js)

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [126.9780, 37.5640];   // [longitude, latitude] — central Seoul
const MAP_ZOOM          = 12;
const OFFLINE_CENTER    = { lat: 37.5640, lng: 126.9780 };
const GUIDE_CITY        = 'Seoul';
const BLOGGER_NAME      = 'Joe';
const GUIDE_TIMEZONE    = 'Asia/Seoul';

// ─── Category colours ─────────────────────────────────────────────────────────
// ⚠️ REQUIRED — map-core.js throws "CC is not defined" without this
const CC = {
  'food':     '#e8724a',   // restaurants
  'pub':      '#d4a043',   // chicken hofs, bars
  'market':   '#6b9e6e',   // markets, street food
  'cafe':     '#8b6bb1',   // cafés, dessert
  'landmark': '#6090c8',   // unique experiences (spa, etc.)
  'church':   '#c08060',   // temples (unused but kept for map-core compatibility)
  'soviet':   '#9080a8',   // unused
  'nature':   '#50906a',   // unused
};

// ─── Category labels ──────────────────────────────────────────────────────────
// ⚠️ REQUIRED — map-core.js throws "CL is not defined" without this
const CL = {
  'food':     'Restaurants',
  'pub':      'Chicken & Bars',
  'market':   'Markets & Street Food',
  'cafe':     'Cafés',
  'landmark': 'Experiences',
  'church':   'Temples',
  'soviet':   'Soviet',
  'nature':   'Nature',
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

// ─── Map initialisation ───────────────────────────────────────────────────────
// ⚠️ DEFINE initMap() here but DO NOT CALL IT.
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
    var msg = e.error ? e.error.message : JSON.stringify(e);
    if (msg && (msg.includes('Failed to fetch') || msg.includes('fetch') ||
                msg.includes('NetworkError') || msg.includes('Load failed'))) {
      console.warn('Map tile fetch failed (transient):', msg);
      return;
    }
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:50%;left:5%;right:5%;transform:translateY(-50%);background:#900;color:#fff;padding:15px;border-radius:8px;z-index:999999;font-size:12px;font-family:monospace;cursor:pointer;';
    d.textContent = 'Map error: ' + msg + ' (tap to dismiss)';
    d.onclick = function() { d.remove(); };
    document.body.appendChild(d);
    setTimeout(function() { if (d.parentNode) d.remove(); }, 8000);
  });

  map.on('load', () => {
    try {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';

      // Force English labels on all map tiles
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce', ['get', 'name:en'], ['get', 'name'],
            ]);
          } catch(e) { /* safe to ignore */ }
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
