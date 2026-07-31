// A Perfect Story Map — Family Edition
// map.js — familystorymap: the family memoir of Anna (FamilyMemories, Part 1)
// v1 — July 2026. A genealogy prototype: one family's places, 1890s → today.
//
// Five story threads (categories): Friedland (mother's side) · Kliot (father's
//   side) · Lando & Schechter (husband's side) · War & evacuation · Israel
// Five regions: belarus, russia, east, ukraine, israel
//
// ⚠️  Keys in NBHD_* objects, region bubbles in index.html,
//      and the nbhd field in data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [38.0000, 50.0000];   // [lng, lat] — between Belarus, Russia, Ukraine and Israel
const MAP_ZOOM          = 4;
const OFFLINE_CENTER    = { lat: 50.0000, lng: 38.0000 };
const GUIDE_CITY        = 'Family Journey';
const BLOGGER_NAME      = 'Family Story Map';
const GUIDE_TIMEZONE    = 'Asia/Jerusalem';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'narcyz':   '#3a6ea5',   // horizon blue — Chaya's family, Wolbrom
  'urbach':   '#6b8e4e',   // olive green — Natan's family, Sosnowiec
  'war':      '#a4402f',   // deep crimson — the war years and the wandering
  'israel':   '#c9a227',   // gold — the new life in Israel
  'memorial': '#5b4b6e',   // muted violet — the journeys back, and the memorials
  'baror':    '#2f8f8f',   // teal — Zehava's own family, the life that followed
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'narcyz':   'משפחת נֶרציס — צד אמא',
  'urbach':   'משפחת אורבך — צד אבא',
  'war':      'שנות המלחמה והנדודים',
  'israel':   'ישראל — הבית החדש',
  'memorial': 'מסעות החזרה והזיכרון',
  'baror':    'בר־אור — המשפחה שאחרי',
};

// ─── Region colours ────────────────────────────────────────────────────────────
const NBHD_COLORS = {
  'poland':     '#3a6ea5',
  'ukraine':    '#2f8f8f',
  'east':       '#a4402f',
  'uzbekistan': '#c07a2f',
  'europe':     '#6b8e4e',
  'israel':     '#c9a227',
  'memorial':   '#5b4b6e',
  'america':    '#2f8f8f',
};

// ─── Region display labels ─────────────────────────────────────────────────────
const NBHD_LABELS = {
  'poland':     'פולין',
  'ukraine':    'אוקראינה',
  'east':       'מזרחה — אורל וסיביר',
  'uzbekistan': 'אוזבקיסטן',
  'europe':     'גרמניה וצרפת',
  'israel':     'ישראל',
  'memorial':   'אתרי זיכרון',
  'america':    'ארצות הברית',
};

// ─── Region approximate centres ───────────────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'poland':     { lat: 50.20, lng: 19.60 },
  'ukraine':    { lat: 48.02, lng: 37.80 },
  'east':       { lat: 55.00, lng: 59.50 },
  'uzbekistan': { lat: 40.50, lng: 66.80 },
  'europe':     { lat: 48.50, lng:  8.50 },
  'israel':     { lat: 32.50, lng: 34.95 },
  'memorial':   { lat: 50.50, lng: 19.20 },
  'america':    { lat: 42.28, lng: -83.74 },
};

// ─── Region circle override ───────────────────────────────────────────────────
// map-core's buildNbhdCircles() is tuned for city-sized districts; these regions
// span whole countries. Use ALL places per region with a large minimum radius.
const NBHD_MIN_RADIUS = {
  'belarus':   120000,
  'russia':    150000,
  'east':      200000,
  'ukraine':   120000,
  'israel':    30000,
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
