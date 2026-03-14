// ── MAP INIT ──────────────────────────────────────────────────
function initMap(){
  map = new google.maps.Map(document.getElementById('map'),{
    center:{lat:41.6918, lng:44.8100},
    zoom:14,
    mapTypeControl:false,
    streetViewControl:false,
    fullscreenControl:false,
    zoomControl:true,
    zoomControlOptions:{position:google.maps.ControlPosition.RIGHT_CENTER},
    gestureHandling:'greedy'
  });

  placesService = new google.maps.places.PlacesService(map);

  PLACES.forEach(p => addMarker(p));
  renderList();

  // On desktop, open list panel automatically
  if(window.innerWidth >= 768){
    openSheet();
  }

  document.getElementById('loading').style.display='none';
}

// ── NEIGHBOURHOOD CIRCLES ON MAP ──────────────────────────────
const NBHD_CIRCLES = [
  { id:'old-town',   lat:41.6895, lng:44.8100, radius:550,  label:'Old Town',   color:'#e8724a' },
  { id:'sololaki',   lat:41.6930, lng:44.8030, radius:420,  label:'Sololaki',   color:'#9080a8' },
  { id:'avlabari',   lat:41.6925, lng:44.8195, radius:480,  label:'Avlabari',   color:'#6090c8' },
  { id:'vera',       lat:41.6995, lng:44.7955, radius:500,  label:'Vera',       color:'#f0c060' },
  { id:'chugureti',  lat:41.6885, lng:44.7985, radius:480,  label:'Chugureti',  color:'#6b9e6e' },
  { id:'mtatsminda', lat:41.6945, lng:44.7950, radius:560,  label:'Mtatsminda', color:'#c08060' },
  { id:'vake',       lat:41.7045, lng:44.7715, radius:700,  label:'Vake',       color:'#50906a' },
];

let activeNbhdCircle = null;

function showNbhdCircle(nbhdId){
  // Remove previous circle
  if(activeNbhdCircle){ activeNbhdCircle.setMap(null); activeNbhdCircle = null; }
  if(!nbhdId) return;
  const n = NBHD_CIRCLES.find(x => x.id === nbhdId);
  if(!n || !map) return;
  activeNbhdCircle = new google.maps.Circle({
    map,
    center: {lat:n.lat, lng:n.lng},
    radius: n.radius,
    fillColor: n.color,
    fillOpacity: 0.10,
    strokeColor: n.color,
    strokeOpacity: 0.55,
    strokeWeight: 2,
    clickable: false,
    zIndex: 0,
  });
}

function clearNbhdCircle(){
  if(activeNbhdCircle){ activeNbhdCircle.setMap(null); activeNbhdCircle = null; }
}

// ── MARKERS ───────────────────────────────────────────────────
function makeIcon(p, active){
  const color = CC[p.cat] || '#888';
  const emoji = p.emoji || '📍';

  if(active){
    // Active: large gold pin with white ring and strong shadow
    const s = 58;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
      <defs>
        <radialGradient id="ag" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stop-color="#ffe566"/>
          <stop offset="60%" stop-color="#f5b800"/>
          <stop offset="100%" stop-color="#c48a00"/>
        </radialGradient>
        <filter id="ashadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.55)"/>
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
      </defs>
      <circle cx="${s/2}" cy="${s/2}" r="${s/2-2}" fill="white" filter="url(#ashadow)"/>
      <circle cx="${s/2}" cy="${s/2}" r="${s/2-5}" fill="url(#ag)" stroke="white" stroke-width="2"/>
      <text x="50%" y="54%" font-size="22" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    </svg>`;
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(s, s),
      anchor: new google.maps.Point(s/2, s/2),
    };
  }

  // Normal: vivid category color, strong bevel + shadow
  const s = 46;
  // Lighten the category color for the top highlight
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <defs>
      <radialGradient id="g${p.id}" cx="33%" cy="27%" r="72%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.72)"/>
        <stop offset="45%" stop-color="rgba(255,255,255,0.08)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.22)"/>
      </radialGradient>
      <filter id="sh${p.id}" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" flood-color="rgba(0,0,0,0.5)"/>
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.25)"/>
      </filter>
    </defs>
    <!-- outer white ring for contrast on any map bg -->
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-1}" fill="white" filter="url(#sh${p.id})"/>
    <!-- main colored circle -->
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-3.5}" fill="${color}" stroke="white" stroke-width="2"/>
    <!-- bevel overlay -->
    <circle cx="${s/2}" cy="${s/2}" r="${s/2-3.5}" fill="url(#g${p.id})"/>
    <!-- emoji -->
    <text x="50%" y="54%" font-size="18" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(s, s),
    anchor: new google.maps.Point(s/2, s/2),
  };
}

function addMarker(p){
  const marker = new google.maps.Marker({
    position:{lat:p.lat, lng:p.lng},
    map,
    icon: makeIcon(p, false),
    title: p.name,
    optimized: false,
    zIndex: 10,   // low — trip number markers (zIndex 9000+) always render on top
  });
  marker.addListener('click', ()=> openDetail(p.id));
  markers[p.id] = marker;
}

// ── PLACES PHOTO FETCH ────────────────────────────────────────

function showNbhdCircleAnimated(nbhdId){
  if(activeNbhdCircle){ activeNbhdCircle.setMap(null); activeNbhdCircle = null; }
  const n = NBHD_CIRCLES.find(x => x.id === nbhdId);
  if(!n || !map) return;

  // Start tiny, expand to full radius over 600ms
  const fullRadius = n.radius;
  const steps = 30;
  const duration = 600;
  let step = 0;

  activeNbhdCircle = new google.maps.Circle({
    map,
    center: {lat:n.lat, lng:n.lng},
    radius: fullRadius * 0.05,   // start at 5%
    fillColor: n.color,
    fillOpacity: 0.0,
    strokeColor: n.color,
    strokeOpacity: 0.0,
    strokeWeight: 2.5,
    clickable: false,
    zIndex: 0,
  });

  const interval = setInterval(() => {
    step++;
    const t = step / steps;
    const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
    activeNbhdCircle.setRadius(fullRadius * (0.05 + 0.95 * ease));
    activeNbhdCircle.setOptions({
      fillOpacity: 0.12 * ease,
      strokeOpacity: 0.6 * ease,
    });
    if(step >= steps){
      clearInterval(interval);
      // Gentle pulse: slightly expand and contract once
      setTimeout(() => {
        if(!activeNbhdCircle) return;
        activeNbhdCircle.setRadius(fullRadius * 1.08);
        activeNbhdCircle.setOptions({ strokeOpacity: 0.8 });
        setTimeout(() => {
          if(!activeNbhdCircle) return;
          activeNbhdCircle.setRadius(fullRadius);
          activeNbhdCircle.setOptions({ strokeOpacity: 0.55, fillOpacity: 0.10 });
        }, 200);
      }, 50);
    }
  }, duration / steps);
}
