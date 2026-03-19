// A Perfect Day — Adventurous Kate / Prague
// map.js — guide-specific config
// DO NOT call initMap() here — index.html fires it via window.addEventListener('load', initMap)

const MAPTILER_KEY   = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER     = [14.4208, 50.0870];   // [lng, lat] — Old Town Square
const MAP_ZOOM       = 13;
const OFFLINE_CENTER = { lat: 50.0870, lng: 14.4208 };
const GUIDE_CITY     = 'Prague';
const BLOGGER_NAME   = 'Kate';

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

// Category labels — used by ui-filter.js renderList
const CL = {
  'landmark': 'Landmark',
  'food':     'Restaurant',
  'cafe':     'Bar & Café',
  'church':   'Church',
  'market':   'Market',
  'soviet':   'Communist Era',
  'nature':   'Nature',
};

// Neighbourhood colours (animated circles on map)
const NBHD_COLORS = {
  'old-town':    '#e8724a',   // terracotta — medieval heart
  'mala-strana': '#6090c8',   // blue — castle & river
  'new-town':    '#9080a8',   // purple — modern Prague
  'vinohrady':   '#f0c060',   // gold — leafy & chic
  'karlin':      '#6b9e6e',   // green — Kate's neighbourhood
  'letna':       '#4ab8a0',   // teal — parks & views
};

// Neighbourhood display labels
const NBHD_LABELS = {
  'old-town':    'Old Town',
  'mala-strana': 'Malá Strana',
  'new-town':    'New Town',
  'vinohrady':   'Vinohrady',
  'karlin':      'Karlín',
  'letna':       'Letná & Beyond',
};

// Neighbourhood approximate centers (used for circle size + map pan)
const NBHD_APPROX_CENTERS = {
  'old-town':    { lat: 50.0875, lng: 14.4213 },
  'mala-strana': { lat: 50.0860, lng: 14.4020 },
  'new-town':    { lat: 50.0780, lng: 14.4280 },
  'vinohrady':   { lat: 50.0750, lng: 14.4420 },
  'karlin':      { lat: 50.0930, lng: 14.4530 },
  'letna':       { lat: 50.0990, lng: 14.4150 },
};

// Map init — DO NOT call initMap() here
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
