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
const BLOGGER_NAME      = 'A Perfect Story Map';
const GUIDE_TIMEZONE    = 'Asia/Jerusalem';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'friedland': '#3a6ea5',   // horizon blue — Friedland, mother's side (Bobruisk)
  'kliot':     '#6b8e4e',   // olive green — Kliot, father's side (Drissa → Vitebsk → Tambov)
  'lando':     '#2f8f8f',   // teal — Lando & Schechter, husband's side (Odessa, Moscow)
  'war':       '#a4402f',   // deep crimson — war & evacuation, 1941–1945
  'israel':    '#c9a227',   // gold — the aliyah and the new life
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'friedland': 'פרידלנד — צד אמא · Фридланды',
  'kliot':     'קליוט — צד אבא · Клиоты',
  'lando':     'לנדו ושכטר · Ландо и Шехтеры',
  'war':       'מלחמה ופינוי · Война и эвакуация',
  'israel':    'ישראל · Израиль',
};

// ─── Region colours ────────────────────────────────────────────────────────────
const NBHD_COLORS = {
  'belarus':   '#3a6ea5',
  'russia':    '#6b8e4e',
  'east':      '#a4402f',
  'ukraine':   '#2f8f8f',
  'israel':    '#c9a227',
};

// ─── Region display labels ─────────────────────────────────────────────────────
const NBHD_LABELS = {
  'belarus':   'בלארוס וליטא · Беларусь и Литва',
  'russia':    'רוסיה · Россия',
  'east':      'אוראל ואסיה · Урал и Азия',
  'ukraine':   'אוקראינה · Украина',
  'israel':    'ישראל · Израиль',
};

// ─── Region approximate centres ───────────────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'belarus':   { lat: 54.50, lng: 28.50 },
  'russia':    { lat: 54.50, lng: 39.50 },
  'east':      { lat: 52.00, lng: 80.00 },
  'ukraine':   { lat: 48.50, lng: 32.50 },
  'israel':    { lat: 31.83, lng: 35.00 },
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
