// A Perfect Story Map: Family Edition
// map.js: SHARED ENGINE FILE. Identical in every family map.
//
// Everything family-specific lives in family.js, which must load BEFORE this file.
// If you find yourself typing a family name, a branch key or a region name in
// here, it belongs in family.js instead. That is exactly how a previous family's
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
    const ps = PLACES.filter(p => p.nbhd === nbhd);   // no outlier cut, regions are large by design
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

// ─── Right-to-left place names ────────────────────────────────────────────────
// MapLibre cannot shape or order Hebrew and Arabic base-map labels without this
// plugin; without it the tile labels render with their letters reversed
// (מונגוליה came out as הילוגנומ). Same call, same guard and same lazy flag that
// already fixed this on the MUZA guide.
function _enableRTLMapText() {
  try {
    if (typeof maplibregl.getRTLTextPluginStatus !== 'function' ||
        maplibregl.getRTLTextPluginStatus() === 'unavailable') {
      maplibregl.setRTLTextPlugin(
        'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
        null,
        true   // lazy: load when RTL text is first needed
      );
    }
  } catch (e) {}
}

// ─── Map initialisation ───────────────────────────────────────────────────────
function initMap() {
  _enableRTLMapText();
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
    // Silent reload: client sees nothing, transient errors self-heal
    setTimeout(function() { location.reload(); }, 2000);
  });

  /* Hebrew was arriving to a spinner, and only Hebrew. The RTL text plugin is
     registered lazily, and MapLibre holds the 'load' event until that plugin has
     been fetched from unpkg and every symbol layer re-laid out. English and
     Russian never ask for the plugin, so 'load' fires at once. Measured on the
     live map: in Hebrew it had still not fired twenty seconds after entering,
     and everything below lives inside it. The loading overlay stayed up, the
     place pins were never added, and the family path was drawn underneath a
     screen nobody could see through.

     So do not wait on 'load' alone. Run once, on whichever of 'load' or 'idle'
     arrives first, and only once the STYLE is ready, which is the thing this
     setup actually needs. The plugin can take as long as it likes; it only
     affects how base-map labels are shaped, not whether the map works. */
  var _setupDone = false;
  var _mapSetup = function () {
    if (_setupDone) return;
    if (!(typeof map.isStyleLoaded === 'function' && map.isStyleLoaded())) return;
    _setupDone = true;
    try {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';

      // Every label used to be pinned to name:en here, so the map stayed in
      // English however the reader had set the page. setMapLanguage() in
      // map-core.js does the same job for whichever language is active, and
      // lang.js calls it again on every switch.
      setMapLanguage((typeof LANG !== 'undefined' && LANG) || 'en');

      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();
      if (map.getSource('trip-route')) {
        map.getSource('trip-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
      }

      PLACES.forEach(p => addMarker(p));

      // Open showing the WHOLE journey: Belarus to the Urals to Israel on one
      // screen (Chita stretches it east; the Family Path then refits to the path).
      /* Open on the JOURNEY, not on every place. Chita sits far to the east and
         is not on the family line, so fitting all 26 pushed the opening view out
         to Morocco and Mongolia. Fall back to all places for a map that has not
         declared a story path yet. */
      const storyBounds = new maplibregl.LngLatBounds();
      const _openOn = (typeof STORY_PATH_IDS !== 'undefined' && STORY_PATH_IDS && STORY_PATH_IDS.length)
        ? STORY_PATH_IDS.map(id => PLACES.find(p => p.id === id)).filter(Boolean)
        : PLACES;
      (_openOn.length ? _openOn : PLACES).forEach(p => storyBounds.extend([p.lng, p.lat]));
      const _isMobile = window.innerWidth < 768;
      map.fitBounds(storyBounds, {
        padding: _isMobile
          ? { top: 120, bottom: 150, left: 24, right: 24 }
          : { top: 150, bottom: 170, left: 60, right: 60 },
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
  };
  map.on('load', _mapSetup);
  map.on('idle', _mapSetup);   // fires long before the RTL plugin resolves
}
// ⚠️ DO NOT call initMap() here
