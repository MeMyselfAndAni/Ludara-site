// ── GUIDE CONFIG — Wander-Lush Tbilisi ───────────────────────
const MAPTILER_KEY   = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER     = [44.8100, 41.6918];
const MAP_ZOOM       = 14;
const OFFLINE_CENTER = { lat: 41.6918, lng: 44.8100 };

const GUIDE_CITY     = 'Tbilisi';
const BLOGGER_NAME   = 'Emily';

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
  'chugureti':  { lat:41.6887, lng:44.9920 },
  'mtatsminda': { lat:41.6938, lng:44.7971 },
  'vake':       { lat:41.7050, lng:44.7730 },
};

function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    attributionControl: false,
  });

  // Compact attribution bottom-right
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

  // Navigation control (zoom buttons)
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

  map.on('load', () => {
    // Force English labels on all label layers
    map.getStyle().layers.forEach(layer => {
      if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
        try {
          map.setLayoutProperty(layer.id, 'text-field', [
            'coalesce', ['get', 'name:en'], ['get', 'name']
          ]);
        } catch(e) {}
      }
    });

    // Add neighbourhood circle source (empty initially)
    map.addSource('nbhd-circle', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    map.addLayer({
      id: 'nbhd-fill',
      type: 'fill',
      source: 'nbhd-circle',
      paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.10 }
    });
    map.addLayer({
      id: 'nbhd-line',
      type: 'line',
      source: 'nbhd-circle',
      paint: { 'line-color': ['get', 'color'], 'line-opacity': 0.55, 'line-width': 2 }
    });

    // Build neighbourhood circles from actual place data
    NBHD_CIRCLES = buildNbhdCircles();

    // Clear any leftover trip route
    if(!map.getSource('trip-route')){
      map.addSource('trip-route', { type:'geojson', data:{type:'Feature',geometry:{type:'LineString',coordinates:[]}} });
      map.addLayer({ id:'trip-route-line', type:'line', source:'trip-route',
        paint:{'line-color':'#e00040','line-width':3,'line-opacity':0.65,'line-dasharray':[2,2]} });
    }

    // Add markers after style loads
    PLACES.forEach(p => addMarker(p));
    renderList();

    (function syncPlaceCount() {
      const n = PLACES.length;
      document.querySelectorAll('.place-count-all').forEach(el => el.textContent = n);
      ['list-badge','desktop-list-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = n;
      });
      const title = document.getElementById('sheet-title');
      if (title && title.textContent.includes('Places')) title.textContent = n + ' Places';
    })();

    setTimeout(preloadAllPhotos, 1500);
    document.getElementById('loading').style.display = 'none';
  });

  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('SW registered — offline ready'))
      .catch(err => console.warn('SW failed:', err));
  }
}
