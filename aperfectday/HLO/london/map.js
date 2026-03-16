// ── HLO LONDON — MAP CONFIGURATION ───────────────────────────────────────────

const MAP_CENTER = { lat: 51.5074, lng: -0.1278 };
const MAP_ZOOM = 12;

// ── NEIGHBOURHOOD CIRCLES ─────────────────────────────────────────────────────
// Radius = max distance from centre to furthest place × 1.25 + 80m buffer
const NBHD_CIRCLES = [
  {
    id: 'westminster',
    lat: 51.5012, lng: -0.1340,
    radius: 900,
    label: 'Westminster',
    color: '#e8724a'
  },
  {
    id: 'southbank',
    lat: 51.5065, lng: -0.1085,
    radius: 1100,
    label: 'South Bank',
    color: '#f0c060'
  },
  {
    id: 'borough',
    lat: 51.5020, lng: -0.0840,
    radius: 1300,
    label: 'Borough & Bermondsey',
    color: '#6b9e6e'
  },
  {
    id: 'city',
    lat: 51.5095, lng: -0.0875,
    radius: 1200,
    label: 'The City',
    color: '#6090c8'
  },
  {
    id: 'covent-garden',
    lat: 51.5122, lng: -0.1290,
    radius: 900,
    label: 'Covent Garden & Soho',
    color: '#c08060'
  },
  {
    id: 'camden',
    lat: 51.5370, lng: -0.1420,
    radius: 1500,
    label: 'Camden & King\'s Cross',
    color: '#9080a8'
  },
  {
    id: 'notting-hill',
    lat: 51.5165, lng: -0.2010,
    radius: 700,
    label: 'Notting Hill',
    color: '#50906a'
  },
  {
    id: 'kensington',
    lat: 51.4970, lng: -0.1740,
    radius: 1200,
    label: 'Kensington',
    color: '#e8724a'
  },
  {
    id: 'greenwich',
    lat: 51.4820, lng: -0.0030,
    radius: 1200,
    label: 'Greenwich',
    color: '#6090c8'
  }
];

// ── MAP INIT ──────────────────────────────────────────────────────────────────
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    styles: [
      { featureType:'poi', elementType:'labels', stylers:[{visibility:'off'}] },
      { featureType:'transit.station', elementType:'labels', stylers:[{visibility:'off'}] },
      { featureType:'road', elementType:'labels.icon', stylers:[{visibility:'off'}] }
    ],
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  });

  placesService = new google.maps.places.PlacesService(map);
  initMarkers();
  drawNbhdCircles();
  renderList();

  map.addListener('click', () => { closePlaceCard(false); });

  setTimeout(preloadAllPhotos, 1500);
}

function initMarkers() {
  PLACES.forEach(p => {
    const marker = new google.maps.Marker({
      position: { lat: p.lat, lng: p.lng },
      map: map,
      title: p.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: CC[p.cat] || '#aaa',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
        scale: 9
      }
    });
    marker.addListener('click', () => openPlaceCard(p.id));
    markers[p.id] = marker;
  });
}

function drawNbhdCircles() {
  NBHD_CIRCLES.forEach(n => {
    new google.maps.Circle({
      map: map,
      center: { lat: n.lat, lng: n.lng },
      radius: n.radius,
      strokeColor: n.color,
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: n.color,
      fillOpacity: 0.07
    });
  });
}

// ── LOCATE ME ────────────────────────────────────────────────────────────────
let userMarker = null;
function locateMe() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    if (userMarker) userMarker.setMap(null);
    userMarker = new google.maps.Marker({
      position: loc, map: map, title: 'You are here',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#4285F4', fillOpacity: 1,
        strokeColor: '#fff', strokeWeight: 3, scale: 10
      }
    });
    map.panTo(loc);
    map.setZoom(15);
  });
}
