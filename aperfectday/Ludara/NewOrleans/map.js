// A Perfect Day — Ludara / New Orleans
// map.js — guide-specific config (rebuilt from data.js)

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-90.077, 29.9503];  // [longitude, latitude] — New Orleans centroid
const MAP_ZOOM          = 12;
const OFFLINE_CENTER    = { lat: 29.9503, lng: -90.077 };
const GUIDE_CITY        = 'New Orleans';
const BLOGGER_NAME      = 'Ludara';
const GUIDE_TIMEZONE    = 'America/Chicago';
const TIME_FORMAT       = '12h';
const DISTANCE_UNITS    = 'imperial';

const CC = {
  "landmark": "#ff2a00",
  "food": "#d4902a",
  "cafe": "#5a8f68",
  "pub": "#6b5b9a",
  "market": "#b07040",
  "nature": "#3d8a5e"
};

const CL = {
  "landmark": "Landmarks",
  "food": "Restaurants",
  "cafe": "Coffee & Brunch",
  "pub": "Bars & Music",
  "market": "Markets",
  "nature": "Parks & Nature"
};

const NBHD_COLORS = {
  "french-quarter": "#ff2a00",
  "marigny-bywater": "#d4902a",
  "treme": "#6b5b9a",
  "garden-district": "#5a8f68",
  "warehouse": "#4a90b8",
  "mid-city": "#b07040",
  "uptown": "#3d8a5e"
};

const NBHD_LABELS = {
  "french-quarter": "French Quarter",
  "marigny-bywater": "Marigny & Bywater",
  "treme": "Tremé",
  "garden-district": "Garden District",
  "warehouse": "Warehouse District",
  "mid-city": "Mid-City",
  "uptown": "Uptown"
};

const NBHD_APPROX_CENTERS = {
  "french-quarter": { lat: 29.9582, lng: -90.0656 },
  "marigny-bywater": { lat: 29.9617, lng: -90.0489 },
  "treme": { lat: 29.9659, lng: -90.0725 },
  "garden-district": { lat: 29.9347, lng: -90.0863 },
  "warehouse": { lat: 29.9437, lng: -90.0704 },
  "mid-city": { lat: 29.9817, lng: -90.0852 },
  "uptown": { lat: 29.9204, lng: -90.1092 }
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
// ⚠️ DO NOT call initMap() here — index.html fires it via window.addEventListener('load', initMap)
