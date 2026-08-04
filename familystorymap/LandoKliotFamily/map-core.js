// ── GLOBAL STATE ─────────────────────────────────────────────
let markers = {};
let AID = null;      // active place ID
let AF  = 'all';     // active category filter
let ANF = 'all';     // active neighbourhood filter

// ── MAP CORE: shared across all guides (do not edit) ────────
// Guide-specific config (MAPTILER_KEY, MAP_CENTER etc) is in map.js



// ── MAP SOURCES + LAYERS INIT ─────────────────────────────────
// Called from map.js after map.on('load')
function initMapSources() {
  // Neighbourhood circle
  if(!map.getSource('nbhd-circle')){
    map.addSource('nbhd-circle', { type:'geojson', data:{ type:'FeatureCollection', features:[] } });
    map.addLayer({ id:'nbhd-fill', type:'fill', source:'nbhd-circle',
      paint:{ 'fill-color':['get','color'], 'fill-opacity':0 } });
    map.addLayer({ id:'nbhd-line', type:'line', source:'nbhd-circle',
      paint:{ 'line-color':['get','color'], 'line-width':2.5, 'line-opacity':0 } });
  }
  // Trip route
  if(!map.getSource('trip-route')){
    map.addSource('trip-route', { type:'geojson', data:{ type:'Feature', geometry:{ type:'LineString', coordinates:[] } } });
    map.addLayer({ id:'trip-route-line', type:'line', source:'trip-route',
      paint:{ 'line-color':'#e00040', 'line-width':4, 'line-opacity':0.85 } });
  }
}

// ── NEIGHBOURHOOD CIRCLES: dynamically calculated from place data ─


function _haversineM(a, b) {
  const R = 6371000, dLat=(b.lat-a.lat)*Math.PI/180, dLng=(b.lng-a.lng)*Math.PI/180;
  const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}

/* ── JOURNEY DISTANCE ────────────────────────────────────────────────────────
   How far the family actually went. Sums the straight line distance between
   consecutive stops in the order they happened, so every figure it produces is
   a floor and never an exaggeration: the roads, the rivers and the rail lines
   were all longer than the great circle between two points.

   Computed from each map's own coordinates at render time, so a new family map
   reports its own number the day it ships and nothing is ever hardcoded. */
function journeyKm(places){
  if(!places || places.length < 2) return 0;
  var m = 0;
  for(var i = 1; i < places.length; i++){
    var a = places[i-1], b = places[i];
    if(!a || !b || typeof a.lat !== 'number' || typeof b.lat !== 'number') continue;
    m += _haversineM(a, b);
  }
  return m / 1000;
}

/* 11227 -> '11,227 ק״מ' for a Hebrew reader, '11,227 km' for an English one.
   Anything under 100 keeps one decimal so a single short leg cannot round away
   to nothing. Respects DISTANCE_UNITS, so a US guide would read in miles. */
function fmtKm(km){
  if(!km) return '';
  var imperial = (typeof DISTANCE_UNITS !== 'undefined' && DISTANCE_UNITS === 'imperial');
  var v = imperial ? km * 0.621371 : km;
  var n = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
  var unit = imperial
    ? ' mi'
    : (typeof L3 === 'function' ? L3(' ק״מ', ' км', ' km') : ' km');
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + unit;
}

/* The whole family journey: story path order when the family declares one,
   otherwise the order the places are listed in. */
function familyJourneyKm(){
  if(typeof PLACES === 'undefined') return 0;
  var seq = (typeof STORY_PATH_IDS !== 'undefined' && STORY_PATH_IDS && STORY_PATH_IDS.length)
    ? STORY_PATH_IDS.map(function(id){
        return PLACES.find(function(p){ return p.id === id; });
      }).filter(Boolean)
    : PLACES.slice();
  return journeyKm(seq);
}

if (typeof window !== 'undefined') {
  window.journeyKm       = journeyKm;
  window.fmtKm           = fmtKm;
  window.familyJourneyKm = familyJourneyKm;
}

// ── DISTANCE FORMATTING: Imperial vs Metric ─────────────────────────────────
// DISTANCE_UNITS is defined per guide in map.js: 'imperial' (US) or 'metric' (default)
function formatDistance(meters) {
  if (typeof DISTANCE_UNITS !== 'undefined' && DISTANCE_UNITS === 'imperial') {
    // Imperial: feet for short distances, miles for long
    const feet = meters * 3.28084;
    if (feet < 5280) {
      return Math.round(feet) + ' ft';
    } else {
      const miles = feet / 5280;
      return miles.toFixed(1) + ' mi';
    }
  } else {
    // Metric: meters for short distances, kilometers for long
    if (meters < 1000) {
      return Math.round(meters) + ' m';
    } else {
      return (meters / 1000).toFixed(1) + ' km';
    }
  }
}

function formatDistanceValue(meters) {
  // Returns just the number part for calculations/display
  if (typeof DISTANCE_UNITS !== 'undefined' && DISTANCE_UNITS === 'imperial') {
    const feet = meters * 3.28084;
    if (feet < 5280) {
      return Math.round(feet);
    } else {
      return (feet / 5280).toFixed(1);
    }
  } else {
    if (meters < 1000) {
      return Math.round(meters);
    } else {
      return (meters / 1000).toFixed(1);
    }
  }
}

function formatDistanceUnit() {
  // Returns just the unit label
  if (typeof DISTANCE_UNITS !== 'undefined' && DISTANCE_UNITS === 'imperial') {
    return 'mi'; // Could be ft or mi, but for trip summaries we usually show miles
  } else {
    return 'km';
  }
}

function buildNbhdCircles() {
  const circles = [];
  for (const [nbhd, color] of Object.entries(NBHD_COLORS)) {
    const approxCenter = NBHD_APPROX_CENTERS[nbhd];
    // Get places in this neighbourhood, filter outliers > 3km from approx center
    const ps = PLACES.filter(p => p.nbhd === nbhd &&
      _haversineM(approxCenter, p) < 5000);  // 5km to include outliers like Chronicles of Georgia

    if (ps.length === 0) {
      // No valid places, so a tiny 40m dot to show neighbourhood exists but is empty
      circles.push({ id:nbhd, lat:approxCenter.lat, lng:approxCenter.lng, radius:40, color });
    } else {
      // Centroid of valid places
      const clat = ps.reduce((s,p)=>s+p.lat,0)/ps.length;
      const clng = ps.reduce((s,p)=>s+p.lng,0)/ps.length;
      // Radius = max distance from centroid to any place + 20% padding, min 80m
      const maxDist = Math.max(...ps.map(p => _haversineM({lat:clat,lng:clng}, p)));
      const radius = Math.max(maxDist * 1.20, 80);
      circles.push({ id:nbhd, lat:clat, lng:clng, radius, color });
    }
  }
  return circles;
}

// Built after PLACES is loaded
let NBHD_CIRCLES = [];
let activeNbhdCircle = null;
let _nbhdAnimInterval = null;

// Create a GeoJSON circle polygon from a center point and radius in metres
function makeCircleGeoJSON(lat, lng, radiusM, color, opacity) {
  const points = 64;
  const coords = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = (radiusM / 111320) / Math.cos(lat * Math.PI / 180);
    const dy = radiusM / 110540;
    coords.push([lng + dx * Math.cos(angle), lat + dy * Math.sin(angle)]);
  }
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: { color, opacity },
      geometry: { type: 'Polygon', coordinates: [coords] }
    }]
  };
}

function showNbhdCircle(nbhdId) {
  clearNbhdCircle();
  if (!nbhdId || !map.getSource('nbhd-circle')) return;
  const n = NBHD_CIRCLES.find(x => x.id === nbhdId);
  if (!n) return;
  activeNbhdCircle = n;
  map.getSource('nbhd-circle').setData(makeCircleGeoJSON(n.lat, n.lng, n.radius, n.color, 0.10));
  map.setPaintProperty('nbhd-fill', 'fill-opacity', 0.10);
  map.setPaintProperty('nbhd-line', 'line-opacity', 0.55);
}

function clearNbhdCircle() {
  if (_nbhdAnimInterval) { clearInterval(_nbhdAnimInterval); _nbhdAnimInterval = null; }
  activeNbhdCircle = null;
  if (map.getSource('nbhd-circle')) {
    map.getSource('nbhd-circle').setData({ type: 'FeatureCollection', features: [] });
  }
}

function showNbhdCircleAnimated(nbhdId) {
  clearNbhdCircle();
  const n = NBHD_CIRCLES.find(x => x.id === nbhdId);
  if (!n || !map.getSource('nbhd-circle')) return;
  activeNbhdCircle = n;

  let step = 0;
  const steps = 24, dur = 900;
  map.getSource('nbhd-circle').setData(makeCircleGeoJSON(n.lat, n.lng, n.radius * 0.05, n.color));
  map.setPaintProperty('nbhd-fill', 'fill-opacity', 0);
  map.setPaintProperty('nbhd-line', 'line-opacity', 0);

  _nbhdAnimInterval = setInterval(() => {
    step++;
    const ease = 1 - Math.pow(1 - step / steps, 3);
    const r = n.radius * (0.05 + 0.95 * ease);
    map.getSource('nbhd-circle').setData(makeCircleGeoJSON(n.lat, n.lng, r, n.color));
    map.setPaintProperty('nbhd-fill', 'fill-opacity', 0.10 * ease);
    map.setPaintProperty('nbhd-line', 'line-opacity', 0.55 * ease);
    if (step >= steps) {
      clearInterval(_nbhdAnimInterval);
      _nbhdAnimInterval = null;
      // Gentle pulse
      setTimeout(() => {
        if (!activeNbhdCircle) return;
        map.getSource('nbhd-circle').setData(makeCircleGeoJSON(n.lat, n.lng, n.radius * 1.07, n.color));
        map.setPaintProperty('nbhd-line', 'line-opacity', 0.75);
        setTimeout(() => {
          if (!activeNbhdCircle) return;
          map.getSource('nbhd-circle').setData(makeCircleGeoJSON(n.lat, n.lng, n.radius, n.color));
          map.setPaintProperty('nbhd-line', 'line-opacity', 0.55);
        }, 380);
      }, 40);
    }
  }, dur / steps);
}

// ── MARKERS ───────────────────────────────────────────────────
function makeIconHTML(p, active) {
  const color = CC[p.cat] || '#888';
  const emoji = p.emoji || '📍';
  if (active) {
    const s = 58;
    // The pulsing halo is drawn INSIDE this svg, sharing the pin's own centre
    // (${s/2}, ${s/2}). It used to be a ::before/::after on the marker <div>, centred on
    // that element's box, and any difference between the box and the pin, however
    // small, showed up as an off-centre ring. overflow:visible lets the halo paint
    // outside the 58x58 viewBox without changing the marker's layout size.
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style="overflow:visible">
      <circle class="mgl-halo"   cx="${s/2}" cy="${s/2}" r="18"/>
      <circle class="mgl-halo b" cx="${s/2}" cy="${s/2}" r="18"/>
      <defs>
        <radialGradient id="ag${p.id}" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stop-color="#ffe566"/>
          <stop offset="60%" stop-color="#f5b800"/>
          <stop offset="100%" stop-color="#c48a00"/>
        </radialGradient>
        <filter id="af${p.id}" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.55)"/>
        </filter>
      </defs>
      <circle cx="${s/2}" cy="${s/2}" r="${s/2-2}" fill="white" filter="url(#af${p.id})"/>
      <circle cx="${s/2}" cy="${s/2}" r="${s/2-5}" fill="url(#ag${p.id})" stroke="white" stroke-width="2"/>
      <text x="50%" y="54%" font-size="22" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`;
  }
  const s = 46;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <defs>
      <radialGradient id="g${p.id}" cx="33%" cy="27%" r="72%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.72)"/>
        <stop offset="45%" stop-color="rgba(255,255,255,0.08)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.22)"/>
      </radialGradient>
      <filter id="sh${p.id}" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" flood-color="rgba(0,0,0,0.5)"/>
      </filter>
    </defs>
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-1}" fill="white" filter="url(#sh${p.id})"/>
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-3.5}" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-3.5}" fill="url(#g${p.id})"/>
    <text x="50%" y="54%" font-size="18" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
}

// makeIcon shim: returns an object with enough API for ui-card.js
function makeIcon(p, active) {
  return { html: makeIconHTML(p, active), active };
}

// Centre a place in the VISIBLE part of the map.
// map.panTo() puts it in the geometric centre of the viewport, which on desktop is
// underneath the place card, and on a phone is behind the bottom sheet. So the card
// described a city you could not see. Offset by half the card, and pull the zoom in
// far enough that a country-scale view actually shows where the place is.
function focusPlace(p, opts) {
  if (!map || !p) return;
  opts = opts || {};
  const card = document.getElementById('place-card');
  const open = card && card.classList.contains('open');
  let offset = [0, 0];
  if (open) {
    const r = card.getBoundingClientRect();
    const wide = window.innerWidth >= 768;
    // A left-hand panel: shift the map right by half its width.
    // A bottom sheet: shift up by half its height.
    if (wide) offset = [Math.round(r.width / 2), 0];
    else      offset = [0, -Math.round(Math.min(r.height, window.innerHeight * 0.5) / 2)];
  }
  const z = map.getZoom();
  map.easeTo({
    center: [p.lng, p.lat],
    zoom: opts.keepZoom ? z : Math.max(z, 6),
    offset: offset,
    duration: 700,
  });
}

function addMarker(p) {
  const el = document.createElement('div');
  el.className = 'mgl-marker';
  el.style.cursor = 'pointer';
  el.innerHTML = makeIconHTML(p, false);

  const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
    .setLngLat([p.lng, p.lat])
    .addTo(map);

  // Store place reference for icon updates
  marker._place = p;
  marker._visible = true;

  // Compatibility shims for existing ui-card.js and ui-filter.js
  marker.setVisible = function(v) {
    this._visible = v;
    this.getElement().style.display = v ? '' : 'none';
  };
  marker.setMap = function(m) {
    if (m === null) this.remove();
    else this.addTo(m);
  };
  marker.setIcon = function(iconObj) {
    var el = this.getElement();
    el.innerHTML = iconObj.html;
    // The active pin gets a pulsing ring (see .mgl-marker.is-active in styles.css),
    // so it is obvious which pin the open card is describing.
    el.classList.toggle('is-active', !!(iconObj && iconObj.active));
  };
  marker.setZIndex = function(z) {
    this.getElement().style.zIndex = z;
  };
  marker.setOpacity = function(o) {
    this.getElement().style.opacity = o;
  };

  el.addEventListener('click', () => openDetail(p.id));
  markers[p.id] = marker;
}

// ── MAP COMPATIBILITY SHIMS ───────────────────────────────────
// Allow panTo({lat,lng}) as well as [lng,lat]
const _mlPanTo = maplibregl.Map.prototype.panTo;
maplibregl.Map.prototype.panTo = function(center, options) {
  if (center && !Array.isArray(center) && 'lat' in center) {
    center = [center.lng, center.lat];
  }
  return _mlPanTo.call(this, center, options);
};

// fitBounds shim: accept an array of {lat,lng} objects
const _mlFitBounds = maplibregl.Map.prototype.fitBounds;
maplibregl.Map.prototype.fitBounds = function(bounds, options) {
  // If passed as Leaflet-style LatLngBounds or array of latlng objects
  if (bounds && bounds._southWest) {
    // Leaflet LatLngBounds
    bounds = [[bounds._southWest.lng, bounds._southWest.lat],
              [bounds._northEast.lng, bounds._northEast.lat]];
  }
  return _mlFitBounds.call(this, bounds, options);
};

// ── OFFLINE SAVE ──────────────────────────────────────────────
function latLngToTile(lat, lng, z) {
  return {
    x: Math.floor((lng + 180) / 360 * Math.pow(2, z)),
    y: Math.floor((1 - Math.log(Math.tan(lat * Math.PI/180) + 1/Math.cos(lat * Math.PI/180)) / Math.PI) / 2 * Math.pow(2, z))
  };
}

async function saveForOffline() {
  const btn = document.getElementById('offline-save-btn');
  if (!navigator.onLine) { alert('Connect to WiFi first to save the map for offline use.'); return; }
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Saving...'; }

  // ── Which tiles to save ────────────────────────────────────────────────────
  // This used to be the city-guide logic: zoom 10 to 16, in one square around a
  // single centre. That is right for a walkable city and wrong for a family map.
  // FAMILY.map.center on these maps is a point in open country between the
  // places, and the map opens at zoom 4 spanning whole countries, so it fetched
  // 847 street-level tiles of terrain the reader never sees. Every one of those
  // is a billable MapTiler request.
  //
  // Instead: the whole journey at the zooms the map actually opens at, then a
  // small ring around each real place for when the reader taps a pin. A Set
  // dedupes the overlap where places sit close together.
  const _seen = new Set();
  const _tileUrl = (z, x, y) =>
    `https://api.maptiler.com/tiles/v3/${z}/${x}/${y}.pbf?key=${MAPTILER_KEY}`;
  const _add = (z, x, y) => { if (x >= 0 && y >= 0) _seen.add(z + '/' + x + '/' + y); };

  const _places = (typeof PLACES !== 'undefined' && PLACES.length)
    ? PLACES.filter(p => typeof p.lat === 'number' && typeof p.lng === 'number')
    : [{ lat: OFFLINE_CENTER.lat, lng: OFFLINE_CENTER.lng }];

  // 1. Overview: the whole family journey, at the zooms the map opens at.
  let _mnLa = 90, _mxLa = -90, _mnLn = 180, _mxLn = -180;
  _places.forEach(p => {
    _mnLa = Math.min(_mnLa, p.lat); _mxLa = Math.max(_mxLa, p.lat);
    _mnLn = Math.min(_mnLn, p.lng); _mxLn = Math.max(_mxLn, p.lng);
  });
  for (let z = 3; z <= 5; z++) {
    const a = latLngToTile(_mxLa, _mnLn, z), b = latLngToTile(_mnLa, _mxLn, z);
    for (let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); x++) {
      for (let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); y++) _add(z, x, y);
    }
  }

  // 2. Each real place, closer in. Zoom 8 keeps one ring of surrounding country
  //    so the town is not stranded on a single tile; 10 and 12 are the tile the
  //    place itself sits on, which is what focusPlace() lands on.
  const _rings = { 8: 1, 10: 0, 12: 0 };
  _places.forEach(p => {
    for (const [z, pad] of Object.entries(_rings)) {
      const zoom = parseInt(z), c = latLngToTile(p.lat, p.lng, zoom);
      for (let dx = -pad; dx <= pad; dx++) {
        for (let dy = -pad; dy <= pad; dy++) _add(zoom, c.x + dx, c.y + dy);
      }
    }
  });

  const tiles = Array.from(_seen).map(k => {
    const [z, x, y] = k.split('/');
    return _tileUrl(z, x, y);
  });

  // Also cache style JSON and fonts
  const extras = [
    `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    `https://api.maptiler.com/maps/streets-v2/sprite.json?key=${MAPTILER_KEY}`,
    `https://api.maptiler.com/maps/streets-v2/sprite.png?key=${MAPTILER_KEY}`,
    `https://api.maptiler.com/maps/streets-v2/sprite@2x.json?key=${MAPTILER_KEY}`,
    `https://api.maptiler.com/maps/streets-v2/sprite@2x.png?key=${MAPTILER_KEY}`,
  ];
  await Promise.allSettled(extras.map(u => fetch(u)));

  let done = 0;
  const total = tiles.length;
  for (let i = 0; i < tiles.length; i += 8) {
    await Promise.allSettled(tiles.slice(i, i+8).map(u => fetch(u)));
    done = Math.min(i + 8, total);
    if (btn) btn.textContent = `⏳ ${Math.round(done/total*100)}%`;
  }

  // Cache place images
  const base = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  await Promise.allSettled(PLACES.map(p => fetch(base + 'place-' + p.id + '.jpg')));

  if (btn) {
    btn.textContent = '✅ Offline ready!';
    btn.style.background = '#2a7a4a';
  }
}

// ── PAN TO NEIGHBOURHOOD: called from ui-stories.js ─────────
function panToNbhd(lng, lat, zoom) {
  if (!map) return;
  try {
    map.stop();
    map.setCenter([lng, lat]);
    map.setZoom(zoom);
  } catch(e) {
    console.warn('panToNbhd failed:', e);
  }
}

// ── MAP AUTO-REFRESH & ERROR HANDLING ────────────────────────
// Prevents "Failed to fetch" errors after long periods of inactivity

function refreshMapTiles() {
  if (!map || !map.getStyle) return;
  
  try {
    console.log('🗺️ Refreshing map tiles...');
    
    // Get current style and reload it to refresh tiles
    const currentStyle = map.getStyle();
    if (currentStyle && currentStyle.sources) {
      // Trigger a style refresh by setting the same style
      map.setStyle(currentStyle);
    }
  } catch (error) {
    console.warn('Map refresh failed:', error);
    // Fallback: reload page if map refresh fails
    setTimeout(() => {
      console.log('🔄 Map refresh failed, reloading page...');
      location.reload();
    }, 2000);
  }
}

// Auto-refresh when user returns to tab after long absence
let lastActiveTime = Date.now();
let refreshTimeout = null;

function handleVisibilityChange() {
  if (document.hidden) {
    // Tab became hidden - record the time
    lastActiveTime = Date.now();
  } else {
    // Tab became visible - check how long it was hidden
    const hiddenDuration = Date.now() - lastActiveTime;
    
    // If hidden for more than 30 minutes, refresh map tiles
    if (hiddenDuration > 30 * 60 * 1000) { // 30 minutes
      console.log('🗺️ Tab was hidden for', Math.round(hiddenDuration / 60000), 'minutes, refreshing map');
      setTimeout(refreshMapTiles, 500); // Small delay to ensure tab is fully active
    }
  }
}

// Listen for visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// Also refresh on window focus (backup)
window.addEventListener('focus', function() {
  const hiddenDuration = Date.now() - lastActiveTime;
  if (hiddenDuration > 30 * 60 * 1000) {
    setTimeout(refreshMapTiles, 500);
  }
});

// Handle map errors gracefully
function handleMapError(error) {
  console.warn('Map error detected:', error);
  
  // Clear any existing refresh timeout
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }
  
  // Try to refresh tiles first
  refreshTimeout = setTimeout(() => {
    console.log('🔄 Attempting to refresh map due to error...');
    refreshMapTiles();
    
    // If refresh doesn't work, reload page after additional delay
    setTimeout(() => {
      if (map && map.loaded && !map.loaded()) {
        console.log('🔄 Map still not working, reloading page...');
        location.reload();
      }
    }, 5000);
  }, 1000);
}

// Add error handler when map is initialized
function addMapErrorHandling() {
  if (map && map.on) {
    map.on('error', handleMapError);
    console.log('✅ Map auto-refresh and error handling initialized');
  }
}

// Auto-initialize error handling when map becomes available
let mapCheckInterval = setInterval(() => {
  if (typeof map !== 'undefined' && map && map.on) {
    addMapErrorHandling();
    clearInterval(mapCheckInterval);
  }
}, 500);

// ── APD ANALYTICS ──────────────────────────────
// Fires a labelled GA4 event via the site's existing gtag. Guarded no-op if gtag absent.
function apdTrack(name, params){
  try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch(e){}
}

// ── Map labels in the reader's language ──────────────────────────────────────
// MapTiler's vector tiles already carry name:he, name:ru and name:en on every
// label, so this is a rendering switch and costs no extra tile requests. Each
// symbol layer's text-field is repointed at the chosen language, falling back to
// the Latin name and then to the local one where a translation is missing (many
// small Belarusian and Uzbek towns have no Hebrew name, for instance).
// setStyle() would have done this too, but it discards every source and layer,
// taking the family path and the region circles with it.
function setMapLanguage(lang) {
  if (typeof map === 'undefined' || !map) return;
  // Per-language fallbacks, matching the MUZA guide. A Hebrew reader looking at
  // Belarus gets name:he where MapTiler has it, then a Latin transliteration,
  // which is far more readable than falling through to Cyrillic.
  var field;
  if (lang === 'he')      field = ['coalesce', ['get','name:he'], ['get','name:latin'], ['get','name']];
  else if (lang === 'ru') field = ['coalesce', ['get','name:ru'], ['get','name:en'], ['get','name']];
  else if (lang === 'ar') field = ['coalesce', ['get','name:ar'], ['get','name:en'], ['get','name']];
  else                    field = ['coalesce', ['get','name:en'], ['get','name:latin'], ['get','name']];
  var style;
  try { style = map.getStyle(); } catch (e) { return; }
  if (!style || !style.layers) return;
  style.layers.forEach(function (l) {
    if (l.type !== 'symbol') return;
    if (!l.layout || !l.layout['text-field']) return;
    try { map.setLayoutProperty(l.id, 'text-field', field); } catch (e) {}
  });
}
window.setMapLanguage = setMapLanguage;
