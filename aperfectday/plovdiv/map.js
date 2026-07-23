// A Perfect Day — Ludara / Plovdiv (Hotel Evmolpia)
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [24.7503, 42.1470];  // [longitude, latitude] — Old Town / Kapana / Main St
const MAP_ZOOM          = 15;
const OFFLINE_CENTER    = { lat: 42.1470, lng: 24.7503 };
const GUIDE_CITY        = 'Plovdiv';
const BLOGGER_NAME      = 'Hotel Evmolpia';
const GUIDE_TIMEZONE    = 'Europe/Sofia';
const TIME_FORMAT       = '24h';
const DISTANCE_UNITS    = 'metric';

// ─── Category colours ─────────────────────────────────────────────
const CC = {
  'attraction': '#B07D3F',
  'dining':     '#A23A2E',
  'cafe':       '#5F8A5A',
  'bar':        '#6A4A78',
  'craft':      '#C8862E',
};
// ─── Category labels ──────────────────────────────────────────────
const CL = {
  'attraction': 'Sights & Landmarks',
  'dining':     'Dining',
  'cafe':       'Cafés',
  'bar':        'Bars & Wine',
  'craft':      'Craft & Shops',
};
// ─── Neighbourhood colours ────────────────────────────────────────
const NBHD_COLORS = {
  'oldtown': '#B07D3F',
  'kapana':  '#C8862E',
  'center':  '#6A4A78',
  'daytrip': '#5F8A5A',
};
// ─── Neighbourhood display labels ─────────────────────────────────
const NBHD_LABELS = {
  'oldtown': 'Old Town',
  'kapana':  'Kapana',
  'center':  'Main Street',
  'daytrip': 'Day Trips',
};
// ─── Neighbourhood approximate centers ────────────────────────────
const NBHD_APPROX_CENTERS = {
  'oldtown': { lat: 42.1493, lng: 24.7522 },
  'kapana':  { lat: 42.1502, lng: 24.7495 },
  'center':  { lat: 42.1447, lng: 24.7503 },
  'daytrip': { lat: 41.9645, lng: 24.8614 },
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

  map.on('error', function(e) {
    // Don't reload — tile errors are normal offline; map recovers when connectivity returns
    console.warn('Map tile error (offline?):', e && e.error ? e.error.message : '');
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
// ⚠️ DO NOT call initMap() here — index.html fires it via window.addEventListener('load', initMap)

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').catch(function(err) {
      console.warn('Service worker registration failed:', err);
    });
  });
}
