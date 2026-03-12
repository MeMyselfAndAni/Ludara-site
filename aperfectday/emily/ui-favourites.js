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
function planFavTrip(){
  if(favourites.length < 2){
    alert('Add at least 2 favourites to plan a trip!');
    return;
  }
  toggleFavPanel();

  // Sort by rough geography (north to south, west to east)
  const places = favourites
    .map(id => PLACES.find(x => x.id === id))
    .filter(Boolean)
    .sort((a, b) => (b.lat - a.lat) || (a.lng - b.lng));

  const el = document.getElementById('trip-content');
  el.innerHTML = places.map((p, i) => `
    <div class="trip-stop">
      <div class="trip-stop-num">${i + 1}</div>
      <div class="trip-stop-info">
        <div class="trip-stop-name">${p.emoji} ${p.name}</div>
        <div class="trip-stop-meta">${CL[p.cat]} · ${p.address || ''}</div>
        ${p.hours ? `<div class="trip-stop-hours">🕐 ${p.hours}</div>` : ''}
      </div>
      <button class="trip-stop-map" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}','_blank')">📍</button>
    </div>
    ${i < places.length - 1 ? '<div class="trip-connector">↓ walk / drive</div>' : ''}
  `).join('');

  document.getElementById('trip-overlay').classList.add('open');

  // Show all fav markers on map
  const b = new google.maps.LatLngBounds();
  places.forEach(p => b.extend({lat: p.lat, lng: p.lng}));
  map.fitBounds(b, {top:120, right:20, bottom:100, left: window.innerWidth>=768 ? 320 : 20});
}

function closeTripPlan(){
  document.getElementById('trip-overlay').classList.remove('open');
}

function openTripInMaps(){
  const places = favourites.map(id => PLACES.find(x => x.id === id)).filter(Boolean);
  if(!places.length) return;
  // Google Maps directions with waypoints (max 8)
  const stops = places.slice(0, 8);
  const origin = encodeURIComponent(`${stops[0].lat},${stops[0].lng}`);
  const dest   = encodeURIComponent(`${stops[stops.length-1].lat},${stops[stops.length-1].lng}`);
  const waypts = stops.slice(1,-1).map(p => encodeURIComponent(`${p.lat},${p.lng}`)).join('|');
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypts ? '&waypoints='+waypts : ''}`;
  window.open(url, '_blank');
}

// ── DRAGGABLE NEIGHBOURHOOD BAR ──────────────────────────────
(function initNbhdDrag(){
  const bar    = document.getElementById('nbhd-bar');
  const handle = document.getElementById('nbhd-handle');
  if(!bar || !handle) return;

  let dragY = 0, startBottom = 0, dragging = false;

  function getBottom(){ return parseInt(bar.style.bottom) || (window.innerWidth < 768 ? 56 : 0); }

  function clamp(val){
    const min = 0;
    const max = window.innerHeight - bar.offsetHeight - 60; // don't go above header
    return Math.max(min, Math.min(max, val));
  }

  // ── MOUSE (desktop) ──
  handle.addEventListener('mousedown', e => {
    dragging = true;
    dragY = e.clientY;
    startBottom = getBottom();
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if(!dragging) return;
    const delta = dragY - e.clientY; // moving up = positive delta = bigger bottom
    bar.style.bottom = clamp(startBottom + delta) + 'px';
  });
  document.addEventListener('mouseup', () => {
    dragging = false;
    document.body.style.userSelect = '';
  });

  // ── TOUCH (mobile/tablet) ──
  handle.addEventListener('touchstart', e => {
    dragging = true;
    dragY = e.touches[0].clientY;
    startBottom = getBottom();
    e.stopPropagation(); // don't fire the bubble click
  }, {passive: true});
  handle.addEventListener('touchmove', e => {
    if(!dragging) return;
    const delta = dragY - e.touches[0].clientY;
    bar.style.bottom = clamp(startBottom + delta) + 'px';
    e.preventDefault();
  }, {passive: false});
  handle.addEventListener('touchend', () => { dragging = false; }, {passive: true});
})();

// Init on load
document.addEventListener('DOMContentLoaded', updateFavBadge);
