// ── MAP CORE — shared across all guides (do not edit) ────────
// Guide-specific config (MAPTILER_KEY, MAP_CENTER etc) is in map.js


// ── NEIGHBOURHOOD CIRCLES — dynamically calculated from place data ─


function _haversineM(a, b) {
  const R = 6371000, dLat=(b.lat-a.lat)*Math.PI/180, dLng=(b.lng-a.lng)*Math.PI/180;
  const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}

function buildNbhdCircles() {
  const circles = [];
  for (const [nbhd, color] of Object.entries(NBHD_COLORS)) {
    const approxCenter = NBHD_APPROX_CENTERS[nbhd];
    // Get places in this neighbourhood, filter outliers > 3km from approx center
    const ps = PLACES.filter(p => p.nbhd === nbhd &&
      _haversineM(approxCenter, p) < 5000);  // 5km to include outliers like Chronicles of Georgia

    if (ps.length === 0) {
      // No valid places — tiny 40m dot to show neighbourhood exists but is empty
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
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
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

// makeIcon shim — returns an object with enough API for ui-card.js
function makeIcon(p, active) {
  return { html: makeIconHTML(p, active), active };
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
    this.getElement().innerHTML = iconObj.html;
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

// fitBounds shim — accept array of {lat,lng} objects
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

  const lat = OFFLINE_CENTER.lat, lng = OFFLINE_CENTER.lng;
  const tiles = [];

  // Cache MapTiler vector tiles for city area
  const pads = { 10:1, 11:2, 12:3, 13:4, 14:6, 15:7, 16:8 };
  for (const [z, pad] of Object.entries(pads)) {
    const zoom = parseInt(z);
    const c = latLngToTile(lat, lng, zoom);
    for (let dx = -pad; dx <= pad; dx++) {
      for (let dy = -pad; dy <= pad; dy++) {
        tiles.push(`https://api.maptiler.com/tiles/v3/${zoom}/${c.x+dx}/${c.y+dy}.pbf?key=${MAPTILER_KEY}`);
      }
    }
  }

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

// ── PAN TO NEIGHBOURHOOD — called from ui-stories.js ─────────
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
