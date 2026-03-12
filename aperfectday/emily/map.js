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

  // On desktop, open list automatically
  if(window.innerWidth >= 768){
    document.getElementById('sheet').classList.add('open');
  }

  document.getElementById('loading').style.display='none';
}

// ── MARKERS ───────────────────────────────────────────────────
function makeIcon(p, active){
  const color = CC[p.cat]||'#888';
  if(active){
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#FFD700',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 4,
      scale: 22,
    };
  }
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.92,
    strokeColor: 'rgba(255,255,255,0.9)',
    strokeWeight: 1.5,
    scale: 10,
  };
}

function addMarker(p){
  const marker = new google.maps.Marker({
    position:{lat:p.lat, lng:p.lng},
    map,
    icon: makeIcon(p, false),
    label:{
      text: p.emoji,
      fontSize: '11px'
    },
    title: p.name,
    optimized: false
  });
  marker.addListener('click', ()=> openDetail(p.id));
  markers[p.id] = marker;
}

// ── PLACES PHOTO FETCH ────────────────────────────────────────
