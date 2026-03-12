// ── FAVOURITES & TRIP PLANNER ────────────────────────────────
// Persisted in localStorage so they survive page refresh
let favourites = JSON.parse(localStorage.getItem('tbilisi-favs') || '[]');

function saveFavs(){
  localStorage.setItem('tbilisi-favs', JSON.stringify(favourites));
  updateFavBadge();
}

function updateFavBadge(){
  const badge = document.getElementById('fav-count-badge');
  const icon  = document.getElementById('fav-panel-icon');
  if(!badge) return;
  if(favourites.length > 0){
    badge.textContent = favourites.length;
    badge.style.display = 'flex';
    if(icon) icon.textContent = '♥';
  } else {
    badge.style.display = 'none';
    if(icon) icon.textContent = '♡';
  }
}

function isFav(id){ return favourites.includes(id); }

function toggleFav(){
  if(!AID) return;
  if(isFav(AID)){
    favourites = favourites.filter(x => x !== AID);
  } else {
    favourites.push(AID);
  }
  saveFavs();
  updateFavBtn();
}

function updateFavBtn(){
  const btn = document.getElementById('detail-fav-btn');
  if(!btn || !AID) return;
  const faved = isFav(AID);
  btn.textContent = faved ? '♥' : '♡';
  btn.classList.toggle('faved', faved);
  btn.title = faved ? 'Remove from favourites' : 'Save to favourites';
}

// Call this from openDetail after AID is set
function syncFavBtn(id){
  const btn = document.getElementById('detail-fav-btn');
  if(!btn) return;
  const faved = isFav(id);
  btn.textContent = faved ? '♥' : '♡';
  btn.classList.toggle('faved', faved);
  btn.title = faved ? 'Remove from favourites' : 'Save to favourites';
}

// ── FAVOURITES PANEL ─────────────────────────────────────────
let favPanelOpen = false;

function toggleFavPanel(){
  favPanelOpen = !favPanelOpen;
  const panel = document.getElementById('fav-panel');
  if(favPanelOpen){
    renderFavList();
    panel.classList.add('open');
  } else {
    panel.classList.remove('open');
  }
}

function renderFavList(){
  const el = document.getElementById('fav-list');
  const tripBtn = document.getElementById('fav-trip-btn');
  if(!el) return;

  if(favourites.length === 0){
    el.innerHTML = '<div class="fav-empty">Tap ♡ on any place to save it here</div>';
    if(tripBtn) tripBtn.style.display = 'none';
    return;
  }

  if(tripBtn) tripBtn.style.display = 'block';

  el.innerHTML = favourites.map(id => {
    const p = PLACES.find(x => x.id === id);
    if(!p) return '';
    return `
      <div class="fav-row" onclick="openFavPlace(${id})">
        <div class="fav-row-pip" style="background:${CC[p.cat]}"></div>
        <div class="fav-row-emoji">${p.emoji}</div>
        <div class="fav-row-info">
          <div class="fav-row-name">${p.name}</div>
          <div class="fav-row-type">${CL[p.cat]}</div>
        </div>
        <button class="fav-row-remove" onclick="removeFav(event,${id})" title="Remove">✕</button>
      </div>`;
  }).join('');
}

function openFavPlace(id){
  toggleFavPanel();
  openDetail(id);
}

function removeFav(e, id){
  e.stopPropagation();
  favourites = favourites.filter(x => x !== id);
  saveFavs();
  renderFavList();
  // Update heart if this place is currently open
  if(AID === id) updateFavBtn();
}

// ── TRIP PLANNER ─────────────────────────────────────────────
let tripPolyline = null;
let tripMarkers  = [];

// Haversine distance in metres between two lat/lng points
function haversineM(a, b){
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const h = Math.sin(dLat/2)**2 +
            Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatWalk(metres){
  const mins = Math.round(metres / 80); // ~80 m/min walking
  if(mins < 2)  return '< 2 min walk';
  if(mins < 60) return `~${mins} min walk`;
  return `~${Math.round(mins/60*10)/10} hr walk`;
}

function clearTripRoute(){
  if(tripPolyline){ tripPolyline.setMap(null); tripPolyline = null; }
  tripMarkers.forEach(m => m.setMap(null));
  tripMarkers = [];
}

function drawTripRoute(places){
  clearTripRoute();
  const path = places.map(p => ({lat: p.lat, lng: p.lng}));

  tripPolyline = new google.maps.Polyline({
    path,
    geodesic: true,
    strokeColor: '#e00040',
    strokeOpacity: 0.85,
    strokeWeight: 3,
    map
  });

  places.forEach((p, i) => {
    const div = document.createElement('div');
    div.style.cssText = `
      width:26px; height:26px; border-radius:50%;
      background:#e00040; border:2.5px solid white;
      color:white; font-size:0.7rem; font-weight:700;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.3); cursor:pointer;
    `;
    div.textContent = i + 1;
    const m = new google.maps.marker.AdvancedMarkerElement
      ? new google.maps.marker.AdvancedMarkerElement({ map, position:{lat:p.lat, lng:p.lng}, content: div })
      : new google.maps.Marker({ map, position:{lat:p.lat, lng:p.lng}, label:{text:String(i+1), color:'white'} });
    tripMarkers.push(m);
  });
}

function planFavTrip(){
  if(favourites.length < 2){
    alert('Add at least 2 favourites to plan a trip!');
    return;
  }
  if(favPanelOpen) toggleFavPanel();

  // Nearest-neighbour sort starting from westernmost (good enough for a city walk)
  let unsorted = favourites.map(id => PLACES.find(x => x.id === id)).filter(Boolean);
  unsorted.sort((a,b) => a.lng - b.lng); // start west
  const sorted = [unsorted.shift()];
  while(unsorted.length){
    const last = sorted[sorted.length-1];
    let bestIdx = 0, bestDist = Infinity;
    unsorted.forEach((p,i) => {
      const d = haversineM(last, p);
      if(d < bestDist){ bestDist = d; bestIdx = i; }
    });
    sorted.push(unsorted.splice(bestIdx, 1)[0]);
  }

  // Calculate total walking distance
  let totalM = 0;
  for(let i=1; i<sorted.length; i++) totalM += haversineM(sorted[i-1], sorted[i]);
  const totalMins = Math.round(totalM / 80);

  const el = document.getElementById('trip-content');
  el.innerHTML = `
    <div class="trip-summary">
      <span>🗺 ${sorted.length} stops</span>
      <span>🚶 ~${totalMins} min total walk</span>
      <span>📏 ${(totalM/1000).toFixed(1)} km</span>
    </div>` +
  sorted.map((p, i) => {
    const distNext = i < sorted.length-1 ? haversineM(p, sorted[i+1]) : null;
    return `
    <div class="trip-stop" onclick="jumpToTripStop(${p.id})">
      <div class="trip-stop-num">${i + 1}</div>
      <div class="trip-stop-info">
        <div class="trip-stop-name">${p.emoji} ${p.name}</div>
        <div class="trip-stop-meta">${CL[p.cat]}${p.address ? ' · ' + p.address : ''}</div>
        ${p.hours ? `<div class="trip-stop-hours">🕐 ${p.hours}</div>` : ''}
      </div>
      <button class="trip-stop-map" onclick="event.stopPropagation();window.open('https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}','_blank')">📍</button>
    </div>
    ${distNext !== null ? `<div class="trip-connector">↓ ${formatWalk(distNext)}</div>` : ''}`;
  }).join('');

  document.getElementById('trip-overlay').classList.add('open');

  // Zoom map to show all stops & draw route
  const b = new google.maps.LatLngBounds();
  sorted.forEach(p => b.extend({lat: p.lat, lng: p.lng}));
  map.fitBounds(b, {top:80, right:20, bottom:120, left: window.innerWidth>=768 ? 320 : 20});
  drawTripRoute(sorted);
}

function jumpToTripStop(id){
  const p = PLACES.find(x => x.id === id);
  if(p) map.panTo({lat: p.lat, lng: p.lng});
}

function closeTripPlan(){
  document.getElementById('trip-overlay').classList.remove('open');
  clearTripRoute();
}

function openTripInMaps(){
  const places = favourites.map(id => PLACES.find(x => x.id === id)).filter(Boolean);
  if(!places.length) return;
  // Nearest-neighbour sort (same as planFavTrip)
  let unsorted = [...places].sort((a,b) => a.lng - b.lng);
  const sorted = [unsorted.shift()];
  while(unsorted.length){
    const last = sorted[sorted.length-1];
    let bestIdx=0, bestDist=Infinity;
    unsorted.forEach((p,i) => { const d=haversineM(last,p); if(d<bestDist){bestDist=d;bestIdx=i;} });
    sorted.push(unsorted.splice(bestIdx,1)[0]);
  }
  const stops = sorted.slice(0, 8);
  const origin = encodeURIComponent(`${stops[0].lat},${stops[0].lng}`);
  const dest   = encodeURIComponent(`${stops[stops.length-1].lat},${stops[stops.length-1].lng}`);
  const waypts = stops.slice(1,-1).map(p => encodeURIComponent(`${p.lat},${p.lng}`)).join('|');
  window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypts?'&waypoints='+waypts:''}&travelmode=walking`,'_blank');
}

// ── DRAGGABLE NEIGHBOURHOOD BAR ──────────────────────────────
(function initNbhdDrag(){
  const bar    = document.getElementById('nbhd-bar');
  const handle = document.getElementById('nbhd-handle');
  if(!bar || !handle) return;

  let dragY = 0, startBottom = 0, dragging = false;

  function getCurrentBottom(){
    // Read actual rendered bottom from bounding rect
    return window.innerHeight - bar.getBoundingClientRect().bottom;
  }

  function clamp(val){
    const headerH = 56;
    const min = 0;
    const max = window.innerHeight - bar.offsetHeight - headerH;
    return Math.max(min, Math.min(max, val));
  }

  function startDrag(clientY){
    dragging = true;
    dragY = clientY;
    startBottom = getCurrentBottom();
    document.body.style.userSelect = 'none';
    bar.style.transition = 'none'; // disable CSS transition while dragging
  }

  function doDrag(clientY){
    if(!dragging) return;
    const delta = dragY - clientY;
    bar.style.bottom = clamp(startBottom + delta) + 'px';
  }

  function endDrag(){
    dragging = false;
    document.body.style.userSelect = '';
    bar.style.transition = '';
  }

  // ── MOUSE (desktop) ──
  handle.addEventListener('mousedown', e => {
    startDrag(e.clientY);
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => doDrag(e.clientY));
  document.addEventListener('mouseup', endDrag);

  // ── TOUCH (mobile/tablet) ──
  handle.addEventListener('touchstart', e => {
    startDrag(e.touches[0].clientY);
    e.stopPropagation();
  }, {passive: true});
  handle.addEventListener('touchmove', e => {
    doDrag(e.touches[0].clientY);
    e.preventDefault();
  }, {passive: false});
  handle.addEventListener('touchend', endDrag, {passive: true});
})();

// Init on load
document.addEventListener('DOMContentLoaded', updateFavBadge);
