// A Perfect Day — The Curious Mexican / Mexico City
// map.js — guide-specific config
// Only this file + index.html + data.js + images/ live permanently in the guide folder.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-99.1332, 19.4326];   // [lng, lat] — central Mexico City
const MAP_ZOOM          = 12;
const OFFLINE_CENTER    = { lat: 19.4326, lng: -99.1332 };
const GUIDE_CITY        = 'Mexico City';
const BLOGGER_NAME      = 'Anais';

// ─── Category colours (used by map-core.js makeIconHTML) ─────────────────────
// MUST be present in every guide's map.js. Keys must match cat values in data.js.
const CC = {
  'landmark': '#c8522a',   // terracotta — pre-Hispanic, colonial stone
  'food':     '#e8b840',   // marigold/cempasúchil — the colour of Día de Muertos
  'cafe':     '#7c56bc',   // purple/morado — mezcal culture
  'church':   '#4a78c4',   // blue — colonial churches
  'market':   '#c8487a',   // magenta — Mexico's vibrant market culture
  'soviet':   '#9080a8',   // not used for CDMX
  'nature':   '#3a8c5e',   // verde mexicano
};

// ─── Category labels (used by map-core.js for filter UI) ─────────────────────
const CL = {
  'landmark': 'Landmarks',
  'food':     'Restaurants',
  'cafe':     'Bars & Mezcal',
  'church':   'Churches',
  'market':   'Markets',
  'soviet':   'Soviet',
  'nature':   'Parks',
};

// ─── Neighbourhood palette ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'centro':   '#c8522a',   // terracotta — historic adobe and stone
  'roma':     '#3a8c5e',   // verde — tree-lined avenues
  'condesa':  '#e8b840',   // marigold/golden — Art Deco glamour
  'polanco':  '#4a78c4',   // azul — sophistication
  'coyoacan': '#c8487a',   // magenta — Frida, colour, bohemia
  'juarez':   '#7c56bc',   // morado — creative, night life
};

// ─── Display labels ───────────────────────────────────────────────────────────
const NBHD_LABELS = {
  'centro':   'Centro Histórico',
  'roma':     'Roma Norte',
  'condesa':  'Condesa',
  'polanco':  'Polanco & Chapultepec',
  'coyoacan': 'Coyoacán',
  'juarez':   'Juárez & San Rafael',
};

// ─── Approximate geographic centers (used for circle + pan) ──────────────────
const NBHD_APPROX_CENTERS = {
  'centro':   { lat: 19.4335, lng: -99.1370 },
  'roma':     { lat: 19.4162, lng: -99.1672 },
  'condesa':  { lat: 19.4145, lng: -99.1755 },
  'polanco':  { lat: 19.4240, lng: -99.1920 },
  'coyoacan': { lat: 19.3520, lng: -99.1620 },
  'juarez':   { lat: 19.4260, lng: -99.1550 },
};

// ─── Map initialisation ───────────────────────────────────────────────────────
// ⚠️ DO NOT call initMap() here — index.html fires it via window.addEventListener('load', initMap)
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

      // Force English map labels
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce',
              ['get', 'name:en'],
              ['get', 'name'],
            ]);
          } catch (e) { /* some layers reject this — safe to ignore */ }
        }
      });

      // Build neighbourhood circles + init shared sources
      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();

      // Clear any stale route data
      if (map.getSource('trip-route')) {
        map.getSource('trip-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
      }

      // Drop all markers + wire up shared UI
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
// ⚠️ DO NOT add initMap() call here — index.html fires it via window.addEventListener('load', initMap)
