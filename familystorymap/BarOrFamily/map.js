// A Perfect Story Map — Family Edition
// map.js — SHARED ENGINE FILE. Identical in every family map.
//
// Everything family-specific lives in family.js, which must load BEFORE this file.
// If you find yourself typing a family name, a branch key or a region name in
// here, it belongs in family.js instead — that is exactly how a previous family's
// names used to survive into a new map.
//
// ⚠️  FAMILY.regions[].key, the region bubbles in index.html, and the `nbhd`
//     field in data.js MUST ALL match exactly. _tools/check-map.js verifies this.

const MAPTILER_KEY   = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER     = FAMILY.map.center;              // [lng, lat]
const MAP_ZOOM       = FAMILY.map.zoom;
const OFFLINE_CENTER = { lat: FAMILY.map.center[1], lng: FAMILY.map.center[0] };
const GUIDE_CITY     = 'Family Journey';
const BLOGGER_NAME   = 'Family Story Map';
const GUIDE_TIMEZONE = FAMILY.map.timezone;

// ─── Story threads: colours and labels, in the order family.js lists them ─────
const CC = {}, CL = {}, THREAD_TINT = {};
FAMILY.threads.forEach(function(t){ CC[t.key] = t.color; CL[t.key] = t.label; THREAD_TINT[t.key] = t.tint; });

// ─── Regions ──────────────────────────────────────────────────────────────────
const NBHD_COLORS = {}, NBHD_LABELS = {}, NBHD_APPROX_CENTERS = {}, NBHD_MIN_RADIUS = {};
FAMILY.regions.forEach(function(r){
  NBHD_COLORS[r.key]         = r.color;
  NBHD_LABELS[r.key]         = r.label;
  NBHD_APPROX_CENTERS[r.key] = r.center;
  // Country-sized regions: without a minimum, a region holding a single place
  // would be drawn at the city-guide default of 80 m and be invisible.
  NBHD_MIN_RADIUS[r.key]     = r.minRadius || 120000;
});

// ─── Region circle override ───────────────────────────────────────────────────
// map-core's buildNbhdCircles() is tuned for city-sized districts; these regions
// span whole countries. Use ALL places per region with a large minimum radius.
function buildNbhdCircles() {
  const circles = [];
  for (const [nbhd, color] of Object.entries(NBHD_COLORS)) {
    const approxCenter = NBHD_APPROX_CENTERS[nbhd];
    const ps = PLACES.filter(p => p.nbhd === nbhd);   // no outlier cut — regions are large by design
    const minR = NBHD_MIN_RADIUS[nbhd] || 80;

    if (ps.length === 0) {
      circles.push({ id:nbhd, lat:approxCenter.lat, lng:approxCenter.lng, radius:minR, color });
    } else {
      const clat = ps.reduce((s,p)=>s+p.lat,0)/ps.length;
      const clng = ps.reduce((s,p)=>s+p.lng,0)/ps.length;
      const maxDist = Math.max(...ps.map(p => _haversineM({lat:clat,lng:clng}, p)));
      const radius = Math.max(maxDist * 1.20, minR);
      circles.push({ id:nbhd, lat:clat, lng:clng, radius, color });
    }
  }
  return circles;
}

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

      // Open showing the WHOLE journey — Belarus to the Urals to Israel on one
      // screen (Chita stretches it east; the Family Path then refits to the path).
      const storyBounds = new maplibregl.LngLatBounds();
      PLACES.forEach(p => storyBounds.extend([p.lng, p.lat]));
      const _isMobile = window.innerWidth < 768;
      map.fitBounds(storyBounds, {
        padding: _isMobile
          ? { top: 140, bottom: 190, left: 40,  right: 40 }
          : { top: 190, bottom: 230, left: 120, right: 120 },
        duration: 0,
      });

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
// ⚠️ DO NOT call initMap() here
