// ── MAP INIT ──────────────────────────────────────────────────
// Guide-specific: update MAP_CENTER, MAP_ZOOM, and NBHD_CIRCLES

const MAP_CENTER = { lat: 0.0000, lng: 0.0000 }; // REPLACE with city centre
const MAP_ZOOM   = 14;                             // 13=city, 14=district, 15=neighbourhood

function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });
  placesService = new google.maps.places.PlacesService(map);
  PLACES.forEach(p => addMarker(p));
  renderList();

  const n = PLACES.length;
  document.querySelectorAll('.place-count-all').forEach(el => el.textContent = n);
  ['list-badge','list-badge-desktop','desktop-list-count'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = n;
  });
  const title = document.getElementById('sheet-title');
  if(title) title.textContent = n + ' Places';
}

// ── NEIGHBOURHOOD CIRCLES ─────────────────────────────────────
// Calculate radius to cover all places in each neighbourhood
// Use: haversine distance from centre to furthest place × 1.25 + 80m buffer
const NBHD_CIRCLES = [
  // { id:'neighbourhood-id', lat:0.000, lng:0.000, radius:600, label:'Name', color:'#e8724a' },
];

let activeNbhdCircle = null;

function showNbhdCircle(nbhdId){
  if(activeNbhdCircle){ activeNbhdCircle.setMap(null); activeNbhdCircle = null; }
  if(!nbhdId) return;
  const n = NBHD_CIRCLES.find(x => x.id === nbhdId);
  if(!n || !map) return;
  activeNbhdCircle = new google.maps.Circle({
    map, center:{lat:n.lat,lng:n.lng}, radius:n.radius,
    fillColor:n.color, fillOpacity:0.10,
    strokeColor:n.color, strokeOpacity:0.55, strokeWeight:2,
    clickable:false, zIndex:0,
  });
}

function clearNbhdCircle(){
  if(activeNbhdCircle){ activeNbhdCircle.setMap(null); activeNbhdCircle = null; }
}

function showNbhdCircleAnimated(nbhdId){
  if(activeNbhdCircle){ activeNbhdCircle.setMap(null); activeNbhdCircle = null; }
  const n = NBHD_CIRCLES.find(x => x.id === nbhdId);
  if(!n || !map) return;
  const fullRadius = n.radius;
  let step = 0; const steps = 30; const duration = 600;
  activeNbhdCircle = new google.maps.Circle({
    map, center:{lat:n.lat,lng:n.lng}, radius:fullRadius*0.05,
    fillColor:n.color, fillOpacity:0.0,
    strokeColor:n.color, strokeOpacity:0.0, strokeWeight:2.5,
    clickable:false, zIndex:0,
  });
  const interval = setInterval(() => {
    step++;
    const ease = 1 - Math.pow(1 - step/steps, 3);
    activeNbhdCircle.setRadius(fullRadius*(0.05+0.95*ease));
    activeNbhdCircle.setOptions({fillOpacity:0.12*ease, strokeOpacity:0.6*ease});
    if(step >= steps){
      clearInterval(interval);
      setTimeout(() => {
        if(!activeNbhdCircle) return;
        activeNbhdCircle.setRadius(fullRadius*1.08);
        activeNbhdCircle.setOptions({strokeOpacity:0.8});
        setTimeout(() => {
          if(!activeNbhdCircle) return;
          activeNbhdCircle.setRadius(fullRadius);
          activeNbhdCircle.setOptions({strokeOpacity:0.55, fillOpacity:0.10});
        }, 200);
      }, 50);
    }
  }, duration/steps);
}

// ── MARKERS ───────────────────────────────────────────────────
function makeIcon(p, active){
  const color = CC[p.cat] || '#888';
  const emoji = p.emoji || '📍';
  if(active){
    const s=58;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
      <defs><radialGradient id="ag" cx="35%" cy="28%" r="70%">
        <stop offset="0%" stop-color="#ffe566"/><stop offset="60%" stop-color="#f5b800"/><stop offset="100%" stop-color="#c48a00"/>
      </radialGradient>
      <filter id="ashadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.55)"/>
      </filter></defs>
      <circle cx="${s/2}" cy="${s/2}" r="${s/2-2}" fill="white" filter="url(#ashadow)"/>
      <circle cx="${s/2}" cy="${s/2}" r="${s/2-5}" fill="url(#ag)" stroke="white" stroke-width="2"/>
      <text x="50%" y="54%" font-size="22" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`;
    return { url:'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg),
             scaledSize:new google.maps.Size(s,s), anchor:new google.maps.Point(s/2,s/2) };
  }
  const s=46;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <defs><radialGradient id="g${p.id}" cx="33%" cy="27%" r="72%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.72)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.22)"/>
    </radialGradient>
    <filter id="sh${p.id}" x="-35%" y="-35%" width="170%" height="170%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" flood-color="rgba(0,0,0,0.5)"/>
    </filter></defs>
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-1}" fill="white" filter="url(#sh${p.id})"/>
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-3.5}" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-3.5}" fill="url(#g${p.id})"/>
    <text x="50%" y="54%" font-size="18" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
  return { url:'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg),
           scaledSize:new google.maps.Size(s,s), anchor:new google.maps.Point(s/2,s/2) };
}

function addMarker(p){
  const marker = new google.maps.Marker({
    position:{lat:p.lat,lng:p.lng}, map,
    icon:makeIcon(p,false), title:p.name,
    optimized:false, zIndex:10,
  });
  marker.addListener('click', ()=> openDetail(p.id));
  markers[p.id] = marker;
}
