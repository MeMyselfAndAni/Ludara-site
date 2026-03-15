// ── MAP INIT ──────────────────────────────────────────────────
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: GUIDE.city.mapCenter,
    zoom:   GUIDE.city.mapZoom,
    mapTypeControl:     false,
    streetViewControl:  false,
    fullscreenControl:  false,
    zoomControl:        true,
    zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
    gestureHandling:    'greedy',
    styles: [
      { featureType:'poi', elementType:'labels', stylers:[{visibility:'off'}] },
      { featureType:'transit.station', elementType:'labels', stylers:[{visibility:'simplified'}] },
    ],
  });

  placesService = new google.maps.places.PlacesService(map);

  PLACES.forEach(p => addMarker(p));
  renderList();

  // Sync all place-count displays
  (function syncPlaceCount(){
    const n = PLACES.length;
    document.querySelectorAll('.place-count-all').forEach(el => el.textContent = n);
    ['list-badge','list-badge-desktop','desktop-list-count'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.closest('#sheet')) el.textContent = n;
    });
    const title = document.getElementById('sheet-title');
    if (title && title.textContent.includes('Places')) title.textContent = n + ' Places';
  })();

  document.getElementById('loading').style.display = 'none';
}

// ── NEIGHBOURHOOD CIRCLES ──────────────────────────────────────
// Centred on each London neighbourhood with an appropriate radius
const NBHD_CIRCLES = [
  { id:'city',        lat:51.5138, lng:-0.0900, radius:1050, label:'The City',       color:'#c8623a' },
  { id:'south-bank',  lat:51.5048, lng:-0.0940, radius:1200, label:'South Bank',     color:'#b8704a' },
  { id:'east-london', lat:51.5240, lng:-0.0730, radius:1100, label:'East London',    color:'#7065a8' },
  { id:'west-end',    lat:51.5095, lng:-0.1280, radius:1400, label:'West End',       color:'#e8a030' },
  { id:'north-london',lat:51.5440, lng:-0.1470, radius:1600, label:'North London',   color:'#5a8f68' },
  { id:'west-london', lat:51.5040, lng:-0.1890, radius:2200, label:'West London',    color:'#4878a8' },
  { id:'greenwich',   lat:51.4800, lng:-0.0300, radius:2800, label:'Greenwich & SE', color:'#4a8a58' },
];

let activeNbhdCircle = null;

function showNbhdCircle(nbhdId){
  if (activeNbhdCircle){ activeNbhdCircle.setMap(null); activeNbhdCircle = null; }
  const cfg = NBHD_CIRCLES.find(n => n.id === nbhdId);
  if (!cfg) return;
  activeNbhdCircle = new google.maps.Circle({
    strokeColor: cfg.color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: cfg.color,
    fillOpacity: 0.08,
    map,
    center: { lat: cfg.lat, lng: cfg.lng },
    radius: cfg.radius,
  });
}

function showNbhdCircleAnimated(nbhdId){
  if (activeNbhdCircle){ activeNbhdCircle.setMap(null); activeNbhdCircle = null; }
  const cfg = NBHD_CIRCLES.find(n => n.id === nbhdId);
  if (!cfg) return;
  let r = 0;
  const target = cfg.radius;
  const circle = new google.maps.Circle({
    strokeColor: cfg.color, strokeOpacity: 0.8, strokeWeight: 2,
    fillColor: cfg.color, fillOpacity: 0.10,
    map, center: { lat: cfg.lat, lng: cfg.lng }, radius: r,
  });
  activeNbhdCircle = circle;
  const step = target / 20;
  const iv = setInterval(() => {
    r = Math.min(r + step, target);
    circle.setRadius(r);
    if (r >= target) clearInterval(iv);
  }, 20);
}

// ── MARKER ICONS ──────────────────────────────────────────────
function makeIcon(cat, highlighted = false){
  const color = CC[cat] || '#888888';
  const emoji = PLACES.find(p => p.cat === cat)?.emoji || '📍';
  const size  = highlighted ? 44 : 36;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size+8}" viewBox="0 0 44 52">
      <defs>
        <filter id="sh" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <ellipse cx="22" cy="49" rx="6" ry="2.5" fill="rgba(0,0,0,0.15)"/>
      <path d="M22 2 C12 2 5 9 5 18 C5 30 22 46 22 46 C22 46 39 30 39 18 C39 9 32 2 22 2 Z"
            fill="${color}" stroke="white" stroke-width="2" filter="url(#sh)"/>
      <circle cx="22" cy="18" r="12" fill="white" opacity="0.9"/>
      <text x="22" y="23" text-anchor="middle" font-size="14">${emoji}</text>
    </svg>`;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(size, size + 8),
    anchor: new google.maps.Point(size / 2, size + 8),
  };
}

function addMarker(place){
  const marker = new google.maps.Marker({
    position: { lat: place.lat, lng: place.lng },
    map,
    icon: makeIcon(place.cat),
    title: place.name,
    zIndex: 10,
  });
  marker.addListener('click', () => openDetail(place.id));
  markers[place.id] = marker;
}
