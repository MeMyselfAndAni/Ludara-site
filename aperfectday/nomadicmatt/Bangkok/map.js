// A Perfect Day — Nomadic Matt / Bangkok
// map.js — guide-specific config

const MAPTILER_KEY   = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER     = [100.5018, 13.7480];   // [lng, lat]
const MAP_ZOOM       = 13;
const OFFLINE_CENTER = { lat: 13.7480, lng: 100.5018 };
const GUIDE_CITY     = 'Bangkok';
const BLOGGER_NAME   = 'Matt';

// Category colours — used by map-core.js to colour emoji pins
const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'church':   '#6090c8',
  'market':   '#c08060',
  'soviet':   '#9080a8',
  'nature':   '#50906a',
};

// Category labels — used by ui-filter.js to show human-readable names in the list
const CL = {
  'landmark': 'Landmark',
  'food':     'Restaurant',
  'cafe':     'Bar & Café',
  'church':   'Temple',
  'market':   'Market',
  'soviet':   'Soviet',
  'nature':   'Nature',
};

// Neighbourhood colours (animated circles on map)
const NBHD_COLORS = {
  'old-city':   '#e8724a',
  'chinatown':  '#d4a043',
  'silom':      '#4a90d9',
  'sukhumvit':  '#7b68c8',
  'riverside':  '#4ab8a0',
  'thonglor':   '#c8687b',
};

// Neighbourhood display labels
const NBHD_LABELS = {
  'old-city':   'Old City',
  'chinatown':  'Chinatown',
  'silom':      'Silom & Siam',
  'sukhumvit':  'Sukhumvit',
  'riverside':  'Riverside',
  'thonglor':   'Thong Lo',
};

// Neighbourhood approximate centers (used for circle size + map pan)
const NBHD_APPROX_CENTERS = {
  'old-city':   { lat: 13.7510, lng: 100.4927 },
  'chinatown':  { lat: 13.7401, lng: 100.5097 },
  'silom':      { lat: 13.7310, lng: 100.5290 },
  'sukhumvit':  { lat: 13.7380, lng: 100.5620 },
  'riverside':  { lat: 13.7230, lng: 100.5140 },
  'thonglor':   { lat: 13.7228, lng: 100.5847 },
};

// Map init — DO NOT call initMap() here. index.html fires it via window.addEventListener('load', initMap)
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
      if(loadingEl) loadingEl.style.display = 'none';

      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try { map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name']]); } catch(e) {}
        }
      });

      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();
      if(map.getSource('trip-route')) map.getSource('trip-route').setData({type:'Feature',geometry:{type:'LineString',coordinates:[]}});

      PLACES.forEach(p => addMarker(p));
      if(typeof applyFilters==='function')   applyFilters();
      if(typeof renderList==='function')     renderList();
      if(typeof initFavourites==='function') initFavourites();
      if(typeof alignNbhdBar==='function')   alignNbhdBar();

    } catch(err) {
      const el = document.getElementById('loading');
      if(el){ el.style.display='flex'; el.innerHTML='<div style="color:red;padding:20px;font-size:12px;font-family:monospace;">ERROR: '+err.message+'</div>'; }
    }
  });
}
