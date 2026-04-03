// A Perfect Day — [BLOGGER NAME] / [CITY]
// map.js — guide-specific config
// Only this file + index.html + data.js + images/ live permanently in the guide folder.
//
// ⚠️  CHECKLIST before deploying:
//   [ ] MAP_CENTER set to [lng, lat] of the city centre (longitude FIRST)
//   [ ] GUIDE_CITY and BLOGGER_NAME filled in
//   [ ] CC and CL both present (both required — map-core.js will throw without them)
//   [ ] NBHD_COLORS, NBHD_LABELS, NBHD_APPROX_CENTERS all have matching keys
//   [ ] Neighbourhood keys here match data.js nbhd values AND index.html bubble IDs
//         Keys are plain words (e.g. 'sokolov') — NO 'nbhd-' prefix in map.js or data.js
//   [ ] initMap() is NOT called at the bottom of this file
//   [ ] FAVS_KEY is NOT declared here (it lives in ui-favourites.js)

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [TODO_LNG, TODO_LAT];  // ⚠️ [longitude, latitude]
const MAP_ZOOM          = 13;
const OFFLINE_CENTER    = { lat: TODO_LAT, lng: TODO_LNG };
const GUIDE_CITY        = 'TODO City Name';
const BLOGGER_NAME      = 'TODO FirstName';

// ─── Category colours ─────────────────────────────────────────────────────────
// ⚠️ REQUIRED — map-core.js throws "CC is not defined" without this
// Customise colours to suit the city's character, or keep the defaults below.
const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'pub':      '#8b6bb1',   // bars, cocktail bars, wine bars
  'church':   '#6090c8',
  'market':   '#c08060',
  'soviet':   '#9080a8',
  'nature':   '#50906a',
};

// ─── Category labels ──────────────────────────────────────────────────────────
// ⚠️ REQUIRED — map-core.js throws "CL is not defined" without this
// Change the display labels to suit the city (e.g. 'Temples' instead of 'Churches')
const CL = {
  'landmark': 'Landmarks',
  'food':     'Restaurants',
  'cafe':     'Bars & Cafés',
  'pub':      'Bars',
  'church':   'Churches',
  'market':   'Markets',
  'soviet':   'Soviet',
  'nature':   'Nature',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
// Keys must exactly match: data.js nbhd values, index.html bubble IDs (minus 'nbhd-' prefix)
// Keys must be plain words — e.g. 'sokolov', 'old-town', 'waterfront'
// ⚠️  NO 'nbhd-' prefix in keys. The 'nbhd-' prefix belongs only on HTML element IDs.
const NBHD_COLORS = {
  'TODO-key-1': '#e8724a',
  'TODO-key-2': '#d4a043',
  'TODO-key-3': '#4a90d9',
  'TODO-key-4': '#7b68c8',
  'TODO-key-5': '#4ab8a0',
  'TODO-key-6': '#c8687b',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'TODO-key-1': 'TODO Display Name 1',
  'TODO-key-2': 'TODO Display Name 2',
  'TODO-key-3': 'TODO Display Name 3',
  'TODO-key-4': 'TODO Display Name 4',
  'TODO-key-5': 'TODO Display Name 5',
  'TODO-key-6': 'TODO Display Name 6',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
// Used to calculate circle radius and to pan the map when a neighbourhood is selected
const NBHD_APPROX_CENTERS = {
  'TODO-key-1': { lat: 0.0000, lng: 0.0000 },
  'TODO-key-2': { lat: 0.0000, lng: 0.0000 },
  'TODO-key-3': { lat: 0.0000, lng: 0.0000 },
  'TODO-key-4': { lat: 0.0000, lng: 0.0000 },
  'TODO-key-5': { lat: 0.0000, lng: 0.0000 },
  'TODO-key-6': { lat: 0.0000, lng: 0.0000 },
};

// ─── Map initialisation ───────────────────────────────────────────────────────
// ⚠️ DEFINE initMap() here but DO NOT CALL IT.
// index.html calls it via window.addEventListener('load', initMap) after all
// UI scripts have loaded. Calling it here breaks markers, list, and favourites.
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
