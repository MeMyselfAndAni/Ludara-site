// A Perfect Day — Holy Land with Maria
// map.js — guide-specific config
// v2 — May 2026: Maria Lando's personal Holy Land collection (place count from data.js)
//
// 14 categories: Mary · Jesus · King David · Herod · Egyptian · Roman ·
//                Christianity · Old Testament · Ottoman · Crusaders ·
//                Israeli · Architecture · Eat · Wineries
//
// 8 regions: Jerusalem · Galilee · Golan · Coastal · Dead Sea ·
//            Negev · Judean Hills · Jordan Valley
//
// ⚠️  Keys in NBHD_* objects, neighbourhood bubbles in index.html,
//      and the nbhd field in data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [35.2163, 31.7767];   // [longitude, latitude] — Jerusalem
const MAP_ZOOM          = 7.8;
const OFFLINE_CENTER    = { lat: 31.7767, lng: 35.2163 };
const GUIDE_CITY        = 'Holy Land';
const BLOGGER_NAME      = 'Maria';
const GUIDE_TIMEZONE    = 'Asia/Jerusalem';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'jesus':         '#c04a2a',   // deep red — Jesus sites
  'king_david':    '#d4a043',   // royal gold — King David sites
  'herod':         '#8b5c2a',   // stone brown — Herodian period
  'roman':         '#708090',   // Roman stone — Roman period
  'christianity':  '#4a7ab0',   // Byzantine blue — Christian sites (general)
  'old_testament': '#6b8e4e',   // ancient olive — Old Testament sites
  'ottoman':       '#c04a60',   // Ottoman crimson — Ottoman period
  'crusaders':     '#607060',   // crusader iron — Crusader period
  'israeli':       '#3a8060',   // modern teal — modern Israeli sites
  'architecture':  '#5a5a80',   // stone blue-grey — notable architecture
  'eat':           '#8b5080',   // deep plum — restaurants and food
  'cafe':          '#8b6914',   // coffee brown — cafes and coffee houses
  'street_food':   '#c05a20',   // warm orange — street food
  'wineries':      '#6a2a50',   // wine burgundy — wineries
  'nature':        '#2e8b57',   // forest green — nature and outdoors
  'unesco':        '#1a7fa0',   // UNESCO teal
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'jesus':         'Jesus',
  'king_david':    'King David',
  'herod':         'Herod',
  'roman':         'Roman',
  'christianity':  'Christianity',
  'old_testament': 'Old Testament',
  'ottoman':       'Ottoman',
  'crusaders':     'Crusaders',
  'israeli':       'Israeli',
  'architecture':  'Architecture',
  'eat':           'Good Eats',
  'cafe':          'Cafe',
  'street_food':   'Street Food',
  'wineries':      'Wineries',
  'nature':        'Nature',
  'unesco':        'UNESCO',
};

// ─── Region colours ───────────────────────────────────────────────────────────
const NBHD_COLORS = {
  'jerusalem':    '#c04a2a',   // Jerusalem red
  'galilee':      '#4a8060',   // Galilee green
  'golan':        '#5a7040',   // Golan olive
  'coastal':      '#3a8ab0',   // Mediterranean blue
  'dead_sea':     '#b08020',   // Dead Sea gold
  'negev':        '#c0803a',   // Negev sand
  'judean_hills': '#8b5c2a',   // Judean earth
  'jordan_valley':'#4a7080',   // Jordan slate
};

// ─── Region display labels ────────────────────────────────────────────────────
const NBHD_LABELS = {
  'jerusalem':    'Jerusalem',
  'galilee':      'Galilee',
  'golan':        'Golan',
  'coastal':      'Coastal',
  'dead_sea':     'Dead Sea',
  'negev':        'Negev',
  'judean_hills': 'Judean Hills',
  'jordan_valley':'Jordan Valley',
};

// ─── Region approximate centres (for map fly-to) ─────────────────────────────
const NBHD_APPROX_CENTERS = {
  'jerusalem':    { lat: 31.7767, lng: 35.2163 },
  'galilee':      { lat: 32.8950, lng: 35.5000 },
  'golan':        { lat: 33.0500, lng: 35.8000 },
  'coastal':      { lat: 32.0800, lng: 34.8000 },
  'dead_sea':     { lat: 31.5000, lng: 35.4800 },
  'negev':        { lat: 30.6000, lng: 34.8000 },
  'judean_hills': { lat: 31.6500, lng: 35.0500 },
  'jordan_valley':{ lat: 32.0000, lng: 35.5500 },
};

// ─── Region assignment by coordinates ────────────────────────────────────────
// Used by the Takeout parser to auto-assign nbhd to each place.
// Bounding boxes are approximate — adjust after reviewing actual place distribution.
function assignRegion(lat, lng) {
  // Jerusalem area
  if (lat >= 31.65 && lat <= 31.90 && lng >= 35.10 && lng <= 35.35) return 'jerusalem';
  // Judean Hills (surrounding Jerusalem, including Bethlehem, Hebron direction)
  if (lat >= 31.30 && lat <= 31.85 && lng >= 34.90 && lng <= 35.15) return 'judean_hills';
  // Dead Sea + Jericho corridor
  if (lat >= 31.20 && lat <= 32.00 && lng >= 35.35 && lng <= 35.65) return 'dead_sea';
  // Jordan Valley (north of Dead Sea)
  if (lat >= 32.00 && lat <= 32.60 && lng >= 35.40 && lng <= 35.65) return 'jordan_valley';
  // Galilee (north, including Nazareth, Tiberias, Sea of Galilee)
  if (lat >= 32.50 && lat <= 33.30 && lng >= 35.10 && lng <= 35.70) return 'galilee';
  // Golan Heights
  if (lat >= 32.80 && lat <= 33.40 && lng >= 35.65 && lng <= 36.00) return 'golan';
  // Coastal Plain (Tel Aviv, Haifa, Caesarea, Acre)
  if (lng >= 34.50 && lng <= 35.10) return 'coastal';
  // Negev (south)
  if (lat < 31.30) return 'negev';
  // Default fallback
  return 'jerusalem';
}

// ─── Neighbourhood circles — country-scale override ──────────────────────────
// map-core.js caps places at 5 km from the approximate centre (fine for a city-
// island like Venice, fatal for Israeli regions that span 50–300 km).
// This override is loaded after map-core.js and replaces its buildNbhdCircles.

// Per-region radius bounds (metres) — reflect actual geographic extent of each region.
// Min ensures small datasets still show a meaningful circle; max prevents outlier places
// from inflating a circle beyond the region's real boundaries.
const NBHD_MIN_RADIUS = {
  'jerusalem':    35000,   // Jerusalem metro area
  'galilee':      55000,   // Lower + Upper Galilee
  'golan':        25000,   // Golan Heights
  'coastal':      80000,   // Tel Aviv–Haifa coastal strip
  'dead_sea':     45000,   // Dead Sea corridor
  'negev':        80000,   // Negev Desert
  'judean_hills': 35000,   // Judean foothills + West Bank ridge
  'jordan_valley':50000,   // Jordan Valley
};
const NBHD_MAX_RADIUS = {
  'jerusalem':    55000,
  'galilee':      70000,
  'golan':        40000,
  'coastal':     100000,
  'dead_sea':     60000,
  'negev':       100000,
  'judean_hills': 45000,
  'jordan_valley':60000,
};

function buildNbhdCircles() {
  const circles = [];
  for (const [nbhd, color] of Object.entries(NBHD_COLORS)) {
    const approxCenter = NBHD_APPROX_CENTERS[nbhd];
    const ps = PLACES.filter(p => p.nbhd === nbhd);

    if (ps.length === 0) {
      circles.push({ id: nbhd, lat: approxCenter.lat, lng: approxCenter.lng,
                     radius: NBHD_MIN_RADIUS[nbhd] || 20000, color });
    } else {
      const clat = ps.reduce((s, p) => s + p.lat, 0) / ps.length;
      const clng = ps.reduce((s, p) => s + p.lng, 0) / ps.length;
      const maxDist = Math.max(...ps.map(p => _haversineM({ lat: clat, lng: clng }, p)));
      const raw    = maxDist * 1.25;
      const minR   = NBHD_MIN_RADIUS[nbhd] || 20000;
      const maxR   = NBHD_MAX_RADIUS[nbhd] || 100000;
      const radius = Math.min(Math.max(raw, minR), maxR);
      circles.push({ id: nbhd, lat: clat, lng: clng, radius, color });
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

  map.on('error', function(e) {
    var msg = e.error ? e.error.message : JSON.stringify(e);
    if (msg && (msg.includes('Failed to fetch') || msg.includes('fetch') ||
                msg.includes('NetworkError') || msg.includes('Load failed'))) {
      console.warn('Map tile fetch failed (transient):', msg);
      return;
    }
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:50%;left:5%;right:5%;transform:translateY(-50%);background:#900;color:#fff;padding:15px;border-radius:8px;z-index:999999;font-size:12px;font-family:monospace;cursor:pointer;';
    d.textContent = 'Map error: ' + msg + ' (tap to dismiss)';
    d.onclick = function() { d.remove(); };
    document.body.appendChild(d);
    setTimeout(function() { if (d.parentNode) d.remove(); }, 8000);
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
