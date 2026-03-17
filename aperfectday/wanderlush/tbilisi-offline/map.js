// ── MAP INIT (Leaflet + OpenStreetMap) ────────────────────────
function initMap() {
  map = L.map('map', {
    center: [41.6918, 44.8100],
    zoom: 14,
    zoomControl: false,
  });

  L.control.zoom({ position: 'centerright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  PLACES.forEach(p => addMarker(p));
  renderList();

  (function syncPlaceCount() {
    const n = PLACES.length;
    document.querySelectorAll('.place-count-all').forEach(el => el.textContent = n);
    ['list-badge','desktop-list-count'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = n;
    });
    const title = document.getElementById('sheet-title');
    if (title && title.textContent.includes('Places')) title.textContent = n + ' Places';
  })();

  setTimeout(preloadAllPhotos, 1500);
  document.getElementById('loading').style.display = 'none';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('SW registered — offline ready'))
      .catch(err => console.warn('SW failed:', err));
  }
}

// ── NEIGHBOURHOOD CIRCLES ─────────────────────────────────────
const NBHD_CIRCLES = [
  { id:'old-town',   lat:41.6895, lng:44.8095, radius:1497, color:'#e8724a' },
  { id:'sololaki',   lat:41.6918, lng:44.8042, radius:287,  color:'#9080a8' },
  { id:'avlabari',   lat:41.6913, lng:44.8163, radius:804,  color:'#6090c8' },
  { id:'vera',       lat:41.6985, lng:44.7955, radius:418,  color:'#f0c060' },
  { id:'chugureti',  lat:41.6880, lng:44.7990, radius:315,  color:'#6b9e6e' },
  { id:'mtatsminda', lat:41.6938, lng:44.7971, radius:1253, color:'#c08060' },
  { id:'vake',       lat:41.7050, lng:44.7730, radius:1622, color:'#50906a' },
];
let activeNbhdCircle = null;

function showNbhdCircle(nbhdId) {
  clearNbhdCircle();
  if (!nbhdId) return;
  const n = NBHD_CIRCLES.find(x => x.id === nbhdId);
  if (!n || !map) return;
  activeNbhdCircle = L.circle([n.lat, n.lng], {
    radius: n.radius, color: n.color, fillColor: n.color,
    fillOpacity: 0.10, opacity: 0.55, weight: 2, interactive: false,
  }).addTo(map);
}

function clearNbhdCircle() {
  if (activeNbhdCircle) { map.removeLayer(activeNbhdCircle); activeNbhdCircle = null; }
}

function showNbhdCircleAnimated(nbhdId) {
  clearNbhdCircle();
  const n = NBHD_CIRCLES.find(x => x.id === nbhdId);
  if (!n || !map) return;
  const full = n.radius;
  activeNbhdCircle = L.circle([n.lat, n.lng], {
    radius: full * 0.05, color: n.color, fillColor: n.color,
    fillOpacity: 0.0, opacity: 0.0, weight: 2.5, interactive: false,
  }).addTo(map);
  let step = 0;
  const steps = 24, dur = 900;
  const iv = setInterval(() => {
    step++;
    const ease = 1 - Math.pow(1 - step/steps, 3);
    if (!activeNbhdCircle) { clearInterval(iv); return; }
    activeNbhdCircle.setRadius(full * (0.05 + 0.95 * ease));
    activeNbhdCircle.setStyle({ fillOpacity: 0.10 * ease, opacity: 0.55 * ease });
    if (step >= steps) {
      clearInterval(iv);
      setTimeout(() => {
        if (!activeNbhdCircle) return;
        activeNbhdCircle.setRadius(full * 1.07);
        activeNbhdCircle.setStyle({ opacity: 0.75 });
        setTimeout(() => {
          if (!activeNbhdCircle) return;
          activeNbhdCircle.setRadius(full);
          activeNbhdCircle.setStyle({ opacity: 0.55, fillOpacity: 0.10 });
        }, 380);
      }, 40);
    }
  }, dur / steps);
}

// ── MARKERS ───────────────────────────────────────────────────
function makeIcon(p, active) {
  const color = CC[p.cat] || '#888';
  const emoji = p.emoji || '📍';
  if (active) {
    const s = 58;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><defs><radialGradient id="ag${p.id}" cx="35%" cy="28%" r="70%"><stop offset="0%" stop-color="#ffe566"/><stop offset="60%" stop-color="#f5b800"/><stop offset="100%" stop-color="#c48a00"/></radialGradient><filter id="af${p.id}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.55)"/></filter></defs><circle cx="${s/2}" cy="${s/2}" r="${s/2-2}" fill="white" filter="url(#af${p.id})"/><circle cx="${s/2}" cy="${s/2}" r="${s/2-5}" fill="url(#ag${p.id})" stroke="white" stroke-width="2"/><text x="50%" y="54%" font-size="22" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
    return L.divIcon({ html: svg, className: 'lci', iconSize: [s,s], iconAnchor: [s/2,s/2] });
  }
  const s = 46;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><defs><radialGradient id="g${p.id}" cx="33%" cy="27%" r="72%"><stop offset="0%" stop-color="rgba(255,255,255,0.72)"/><stop offset="45%" stop-color="rgba(255,255,255,0.08)"/><stop offset="100%" stop-color="rgba(0,0,0,0.22)"/></radialGradient><filter id="sh${p.id}" x="-35%" y="-35%" width="170%" height="170%"><feDropShadow dx="0" dy="2.5" stdDeviation="3.5" flood-color="rgba(0,0,0,0.5)"/></filter></defs><circle cx="${s/2}" cy="${s/2}" r="${s/2-1}" fill="white" filter="url(#sh${p.id})"/><circle cx="${s/2}" cy="${s/2}" r="${s/2-3.5}" fill="${color}" stroke="white" stroke-width="2"/><circle cx="${s/2}" cy="${s/2}" r="${s/2-3.5}" fill="url(#g${p.id})"/><text x="50%" y="54%" font-size="18" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
  return L.divIcon({ html: svg, className: 'lci', iconSize: [s,s], iconAnchor: [s/2,s/2] });
}

function addMarker(p) {
  const marker = L.marker([p.lat, p.lng], { icon: makeIcon(p, false), title: p.name, zIndexOffset: 10 });
  // Shims for Google Maps API compatibility
  marker.setVisible = function(v) {
    if (v) { if (!map.hasLayer(this)) this.addTo(map); }
    else   { if  (map.hasLayer(this)) map.removeLayer(this); }
  };
  marker.setMap = function(m) {
    if (m === null) { if (map.hasLayer(this)) map.removeLayer(this); }
    else            { if (!map.hasLayer(this)) this.addTo(m); }
  };
  marker.on('click', () => openDetail(p.id));
  marker.addTo(map);
  markers[p.id] = marker;
}

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

  const lat = 41.6918, lng = 44.8100;
  const tiles = [];
  const pads  = { 12:2, 13:3, 14:5, 15:6, 16:7, 17:8 };
  for (const [z, pad] of Object.entries(pads)) {
    const zoom = parseInt(z);
    const c = latLngToTile(lat, lng, zoom);
    for (let dx = -pad; dx <= pad; dx++) {
      for (let dy = -pad; dy <= pad; dy++) {
        const sub = ['a','b','c'][Math.abs(c.x+dx) % 3];
        tiles.push(`https://${sub}.tile.openstreetmap.org/${zoom}/${c.x+dx}/${c.y+dy}.png`);
      }
    }
  }

  let done = 0;
  const total = tiles.length;
  for (let i = 0; i < tiles.length; i += 8) {
    await Promise.allSettled(tiles.slice(i, i+8).map(u => fetch(u)));
    done = Math.min(i + 8, total);
    if (btn) btn.textContent = `⏳ ${Math.round(done/total*100)}%`;
  }

  // Cache place images too
  const base = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  await Promise.allSettled(PLACES.map(p => fetch(base + 'place-' + p.id + '.jpg')));

  if (btn) {
    btn.textContent = '✅ Offline ready!';
    btn.style.background = '#2a7a4a';
  }
}
