// A Perfect Story Map — Book Maps
// map.js — The Book of Longings (Sue Monk Kidd, 2020) — guide-specific config
// v1 — July 2026: UNLISTED CONCEPT DEMO for publisher pitches.
// Not affiliated with the author or publisher. Scene references are
// described in our own words; no text from the novel is reproduced.
//
// Five story threads (categories): Ana's Galilee · Her Book of Longings ·
//   Exile in Alexandria · Jesus & the Ministry · Passover & the Passion
// Three regions: galilee, judea, egypt
//
// ⚠️  Keys in NBHD_* objects, region bubbles in index.html,
//      and the nbhd field in data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [32.5000, 31.9000];   // [longitude, latitude] — eastern Mediterranean, between Egypt and Galilee
const MAP_ZOOM          = 6;
const OFFLINE_CENTER    = { lat: 31.9000, lng: 32.5000 };
const GUIDE_CITY        = 'Galilee';
const BLOGGER_NAME      = 'A Perfect Story Map';
const GUIDE_TIMEZONE    = 'Asia/Jerusalem';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'home':     '#6b8e4e',   // olive green — Ana's Galilee, Sepphoris and Nazareth
  'voice':    '#c9a227',   // gold — her scrolls, the incantation bowl, the Therapeutae
  'exile':    '#2f8f8f',   // teal — Alexandria and Egypt
  'ministry': '#3a6ea5',   // horizon blue — the Sea of Galilee and the Jordan
  'passion':  '#a4402f',   // deep crimson — Passover and the Passion in Jerusalem
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'home':     "Ana's Galilee",
  'voice':    'Her Book of Longings',
  'exile':    'Exile in Alexandria',
  'ministry': 'Jesus & the Ministry',
  'passion':  'Passover & the Passion',
};

// ─── Region colours ────────────────────────────────────────────────────────────
const NBHD_COLORS = {
  'galilee':   '#6b8e4e',
  'judea':     '#c2a24a',
  'egypt':     '#2f8f8f',
};

// ─── Region display labels ─────────────────────────────────────────────────────
const NBHD_LABELS = {
  'galilee':   'Galilee',
  'judea':     'Judea',
  'egypt':     'Egypt',
};

// ─── Region approximate centres ───────────────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'galilee':   { lat: 32.75, lng: 35.36 },
  'judea':     { lat: 31.79, lng: 35.31 },
  'egypt':     { lat: 31.17, lng: 29.88 },
};

// ─── Region circle override ───────────────────────────────────────────────────
// map-core's buildNbhdCircles() is tuned for Venice-sized districts: it drops
// places more than 5km from the region centre, which would break these wide,
// country-scale regions. This override (map.js loads after map-core.js, so this
// declaration wins) uses ALL places in a region and gives each a readable
// minimum radius, since the regions span tens of kilometres by design.
const NBHD_MIN_RADIUS = {
  'galilee':   10000,    // Sepphoris/Nazareth cluster out to the Sea of Galilee
  'judea':     6000,     // Jerusalem cluster out to the Jordan near Jericho
  'egypt':     6000,     // Alexandria down to Lake Mareotis
};

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

      // Open showing the WHOLE story — Galilee to Egypt to Jerusalem on one screen.
      // (The zoom-out that shows the shape of the novel is the demo's first impression.)
      // Padding must clear the overlays: filter pills at the top, region bubble
      // bar at the bottom — otherwise the outermost markers hide behind them.
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
