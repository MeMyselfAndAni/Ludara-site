// ── GUIDE CONFIG — Wander-Lush Tbilisi ───────────────────────
const MAPTILER_KEY   = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER     = [44.8100, 41.6918];
const MAP_ZOOM       = 14;
const OFFLINE_CENTER = { lat: 41.6918, lng: 44.8100 };
const GUIDE_CITY     = 'Tbilisi';
const BLOGGER_NAME   = 'Emily';
const GUIDE_TIMEZONE = 'Asia/Tbilisi';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'church':   '#6090c8',
  'market':   '#c08060',
  'soviet':   '#9080a8',
  'nature':   '#50906a',
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'landmark': 'Landmark',
  'food':     'Restaurant',
  'cafe':     'Café & Bar',
  'church':   'Church & Spiritual',
  'market':   'Market & Shopping',
  'soviet':   'Soviet Heritage',
  'nature':   'Nature & Views',
};

const NBHD_COLORS = {
  'old-town':   '#e8724a',
  'sololaki':   '#9080a8',
  'avlabari':   '#6090c8',
  'vera':       '#f0c060',
  'chugureti':  '#6b9e6e',
  'mtatsminda': '#c08060',
  'vake':       '#50906a',
};

const NBHD_LABELS = {
  'old-town':   'Old Town',
  'sololaki':   'Sololaki',
  'avlabari':   'Avlabari',
  'vera':       'Vera',
  'chugureti':  'Chugureti',
  'mtatsminda': 'Mtatsminda',
  'vake':       'Vake',
};

const NBHD_APPROX_CENTERS = {
  'old-town':   { lat:41.6895, lng:44.8095 },
  'sololaki':   { lat:41.6918, lng:44.8042 },
  'avlabari':   { lat:41.6913, lng:44.8163 },
  'vera':       { lat:41.6985, lng:44.7955 },
  'chugureti':  { lat:41.6887, lng:44.8020 },
  'mtatsminda': { lat:41.6938, lng:44.7971 },
  'vake':       { lat:41.7050, lng:44.7730 },
};

// ── MAP INIT ──────────────────────────────────────────────────
function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    attributionControl: false,
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

  // Visible error handler
  map.on('error', function(e) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:50%;left:5%;right:5%;transform:translateY(-50%);background:#900;color:#fff;padding:15px;border-radius:8px;z-index:999999;font-size:12px;font-family:monospace;';
    d.textContent = 'Map error: ' + (e.error ? e.error.message : JSON.stringify(e));
    document.body.appendChild(d);
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

  map.on('load', () => {
    try {
      // Dismiss spinner immediately
      const loadingEl = document.getElementById('loading');
      if(loadingEl) loadingEl.style.display = 'none';

      // Force English labels
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try { map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name']]); } catch(e) {}
        }
      });

      // Build neighbourhood circles
      NBHD_CIRCLES = buildNbhdCircles();

      // Init map sources and layers (circles, trip route)
      initMapSources();
      // Clear any stale route from previous session
      if(map.getSource('trip-route')) map.getSource('trip-route').setData({type:'Feature',geometry:{type:'LineString',coordinates:[]}});

      // Add markers + init UI
      PLACES.forEach(p => addMarker(p));
      if(typeof applyFilters==='function') applyFilters();
      if(typeof renderList==='function') renderList();
      if(typeof initFavourites==='function') initFavourites();
      if(typeof alignNbhdBar==='function') alignNbhdBar();

    } catch(err) {
      const el = document.getElementById('loading');
      if(el){ el.style.display='flex'; el.innerHTML='<div style="color:red;padding:20px;font-size:12px;font-family:monospace;">ERROR: '+err.message+'</div>'; }
    }
  });
}
