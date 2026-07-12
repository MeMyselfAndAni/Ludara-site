// A Perfect Story Map — Screen Maps
// map.js — Bridgerton in Bath — guide-specific config
// v1 — July 2026: UNLISTED CONCEPT DEMO / bespoke sample for Visit West.
// Not affiliated with Netflix, Shondaland or the production. Scene references
// are described in our own words; no script is reproduced.
//
// Three categories: The Ton & Society · Great Houses · Regency Streets & Shops
// Three regions: crescent, centre, pulteney
//
// ⚠️  Keys in NBHD_* objects, region bubbles in index.html,
//      and the nbhd field in data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-2.3610, 51.3835];   // [longitude, latitude] — central Bath
const MAP_ZOOM          = 14;
const OFFLINE_CENTER    = { lat: 51.3835, lng: -2.3610 };
const GUIDE_CITY        = 'Bath';
const BLOGGER_NAME      = 'A Perfect Story Map';
const GUIDE_TIMEZONE    = 'Europe/London';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'ton':    '#d4a043',   // amber gold — the balls and the season
  'home':   '#c04a2a',   // burnt orange — the great houses
  'street': '#3a8ab0',   // horizon blue — Regency streets and shops
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'ton':    'Glamour & Society',
  'home':   'Grand Houses & Buildings',
  'street': 'Streets & Squares',
};

// ─── Region colours ────────────────────────────────────────────────────────────
const NBHD_COLORS = {
  'crescent': '#d4a043',
  'centre':   '#c04a2a',
  'pulteney': '#3a8ab0',
  'bristol':  '#6a5acd',
};

// ─── Region display labels ─────────────────────────────────────────────────────
const NBHD_LABELS = {
  'crescent': 'Royal Crescent',
  'centre':   'Georgian Centre',
  'pulteney': 'Great Pulteney',
  'bristol':  'Bristol · Rivals',
};

// ─── Region approximate centres ───────────────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'crescent': { lat: 51.3868, lng: -2.3708 },
  'centre':   { lat: 51.3826, lng: -2.3602 },
  'pulteney': { lat: 51.3855, lng: -2.3534 },
  'bristol':  { lat: 51.4540, lng: -2.5940 },
};

// ─── Region minimum circle radius (metres) ────────────────────────────────────
// Bath's locations sit within a compact walkable core; Bristol is a separate city.
const NBHD_MIN_RADIUS = {
  'crescent': 250,
  'centre':   450,
  'pulteney': 350,
  'bristol':  900,
};

function buildNbhdCircles() {
  const circles = [];
  for (const [nbhd, color] of Object.entries(NBHD_COLORS)) {
    const approxCenter = NBHD_APPROX_CENTERS[nbhd];
    const ps = PLACES.filter(p => p.nbhd === nbhd);
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

      // Open showing the whole Bridgerton trail across central Bath.
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
