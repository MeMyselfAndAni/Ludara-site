// A Perfect Day — Ludara / Nashville
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-86.7879, 36.1500];  // ⚠️ [longitude, latitude] — between Downtown and Gulch
const MAP_ZOOM          = 13;
const OFFLINE_CENTER    = { lat: 36.1500, lng: -86.7879 };
const GUIDE_CITY        = 'Nashville';
const BLOGGER_NAME      = 'Ludara';
const GUIDE_TIMEZONE    = 'America/Chicago';    // Central Time
const TIME_FORMAT       = '12h';               // Display hours in AM/PM for US guides

// ─── Category colours ─────────────────────────────────────────────────────────
// Nashville palette: Tennessee brick, Southern gold, Music Row purple, forest green
const CC = {
  'landmark': '#ff2a00',   // Tennessee brick
  'food':     '#d4902a',   // Southern gold
  'cafe':     '#5a8f68',   // Cumberland green
  'pub':      '#6b5b9a',   // Music Row purple
  'market':   '#b07040',   // Worn leather brown
  'nature':   '#3d8a5e',   // Deep forest
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'landmark': 'Landmarks',
  'food':     'Restaurants',
  'cafe':     'Coffee & Brunch',
  'pub':      'Bars & Music',
  'market':   'Markets',
  'nature':   'Parks & Nature',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'downtown':   '#ff2a00',   // Brick orange — honky-tonk warmth
  'germantown': '#5a8a6e',   // Victorian green — historic streets
  'gulch':      '#6b5b9a',   // Deep purple — polished and creative
  'east':       '#d4883a',   // Amber — independent East Nashville energy
  '12south':    '#4a90b8',   // Cool blue — boutique and curated
  'midtown':    '#7a9e5e',   // Sage — campus greenery and parks
  'parks':      '#3d7a50',   // Forest green — nature and greater Nashville
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'downtown':   'Downtown',
  'germantown': 'Germantown',
  'gulch':      'The Gulch',
  'east':       'East Nashville',
  '12south':    '12 South',
  'midtown':    'Midtown',
  'parks':      'Parks & Day Trips',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'downtown':   { lat: 36.1600, lng: -86.7779 },
  'germantown': { lat: 36.1715, lng: -86.7836 },
  'gulch':      { lat: 36.1525, lng: -86.7872 },
  'east':       { lat: 36.1820, lng: -86.7570 },
  '12south':    { lat: 36.1250, lng: -86.7875 },
  'midtown':    { lat: 36.1350, lng: -86.8060 },
  'parks':      { lat: 36.0900, lng: -86.8600 },
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
