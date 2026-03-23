// A Perfect Day — Drizzle & Dip / Cape Town
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [18.4241, -33.9249];  // ⚠️ [longitude, latitude]
const MAP_ZOOM          = 11;
const OFFLINE_CENTER    = { lat: -33.9249, lng: 18.4241 };
const GUIDE_CITY        = 'Cape Town';
const BLOGGER_NAME      = 'Sam';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'market':   '#c08060',
  'nature':   '#4a90d9',
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'landmark': 'Fine Dining',
  'food':     'Restaurants',
  'cafe':     'Bars & Cafés',
  'market':   'Markets & Delis',
  'nature':   'Wine Estates',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'city':          '#e8724a',
  'peninsula':     '#4ab8a0',
  'stellenbosch':  '#d4a043',
  'franschhoek':   '#7b68c8',
  'west-coast':    '#4a90d9',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'city':          'City & Sea Point',
  'peninsula':     'Southern Peninsula',
  'stellenbosch':  'Stellenbosch',
  'franschhoek':   'Franschhoek & Paarl',
  'west-coast':    'West Coast',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'city':          { lat: -33.9220, lng: 18.4150 },
  'peninsula':     { lat: -34.0600, lng: 18.4100 },
  'stellenbosch':  { lat: -33.9350, lng: 18.8600 },
  'franschhoek':   { lat: -33.9100, lng: 19.1000 },
  'west-coast':    { lat: -32.9850, lng: 17.8870 },
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
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:50%;left:5%;right:5%;transform:translateY(-50%);background:#900;color:#fff;padding:15px;border-radius:8px;z-index:999999;font-size:12px;font-family:monospace;';
    d.textContent = 'Map error: ' + (e.error ? e.error.message : JSON.stringify(e));
    document.body.appendChild(d);
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
