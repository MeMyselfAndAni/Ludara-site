// ══ FAVOURITES ══════════════════════════════════════════════
let favourites = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
let savedFilterActive = false;

function saveFavs(){ localStorage.setItem(FAVS_KEY, JSON.stringify(favourites)); updateFavUI(); }
function refreshFavourites(){ favourites = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); updateFavUI(); }

function updateFavUI(){
  const count = favourites.length;
  const pillCount = document.getElementById('pill-saved-count');
  if(pillCount){ pillCount.textContent = count; pillCount.style.display = count > 0 ? 'inline-flex' : 'none'; }
  const pill = document.getElementById('pill-saved');
  if(pill){ const icon = pill.childNodes[0]; if(icon && icon.nodeType === 3) icon.textContent = count > 0 ? '♥ Saved ' : '♡ Saved '; }
  if(savedFilterActive) applyFilters();
}

function isFav(id){ return favourites.includes(id); }

function toggleFav(){
  if(!AID) return;
  if(isFav(AID)){ favourites = favourites.filter(x => x !== AID); }
  else { favourites.push(AID); }
  saveFavs();
  syncFavBtn(AID);
  if(savedFilterActive) applyFilters();
}

function syncFavBtn(id){
  if(typeof _updateFavBtn === "function") _updateFavBtn();
  const btn = document.getElementById('pc-btn-fav');
  if(!btn) return;
  const faved = isFav(id);
  btn.textContent = faved ? '♥' : '♡';
  btn.classList.toggle('faved', faved);
  btn.title = faved ? 'Remove from favourites' : 'Save to favourites';
}

// ── SAVED FILTER ──────────────────────────────────────────────
function toggleSavedFilter(el){
  savedFilterActive = !savedFilterActive;
  el.classList.toggle('active', savedFilterActive);
  if(typeof CARD_MODE !== 'undefined') CARD_MODE = 'detail';
  if(typeof ANF !== 'undefined') ANF = 'all';
  if(typeof clearNbhdCircle === 'function') clearNbhdCircle();
  if(typeof _nbhdRestoreMarkers === 'function') _nbhdRestoreMarkers();
  if(typeof _clearNbhdList === 'function') _clearNbhdList();
  document.querySelectorAll('.nbhd-bubble').forEach(b => b.classList.remove('nbhd-active'));
  const allBtn = document.getElementById('nbhd-all');
  if(allBtn) allBtn.classList.add('nbhd-active');

  if(savedFilterActive){
    if(favourites.length === 0){
      savedFilterActive = false; el.classList.remove('active');
      alert('Tap ♡ on any place to save it here.');
      return;
    }
    applyFilters();
    if(window.innerWidth >= 768) openSheet();
    drawSavedRoute();
  } else {
    clearTripRoute();
    const banner = document.getElementById('saved-mode-banner');
    if(banner) banner.remove();
    applyFilters();
  }
}

// ── ROUTE DRAWING (Leaflet polylines — works fully offline) ──
let tripPolyline  = null;
let tripMarkers   = [];
let tripRenderers = [];
let _routeDurations = {};

function clearTripRoute(){
  tripMarkers.forEach(m => {
    try { if(map.hasLayer(m)) map.removeLayer(m); } catch(e){}
  });
  tripMarkers = [];
  tripRenderers.forEach(r => {
    try { if(map.hasLayer(r)) map.removeLayer(r); } catch(e){}
  });
  tripRenderers = [];
  if(tripPolyline){ try { map.removeLayer(tripPolyline); } catch(e){} tripPolyline = null; }
}

function drawSavedRoute(){
  if(!savedFilterActive || favourites.length < 2){ clearTripRoute(); return; }
  const places = getSortedFavPlaces();
  if(places.length < 2){ clearTripRoute(); return; }
  clearTripRoute();

  // Numbered markers
  places.forEach((p, i) => {
    const marker = L.marker([p.lat, p.lng], {
      icon: L.divIcon({
        html: `<div style="width:24px;height:24px;border-radius:50%;background:#e00040;border:2.5px solid white;color:white;font-size:0.68rem;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.35);font-family:sans-serif;">${i+1}</div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
      zIndexOffset: 9000 + i,
    }).addTo(map);
    tripMarkers.push(marker);
  });

  // Dotted polyline (works offline)
  tripPolyline = L.polyline(places.map(p => [p.lat, p.lng]), {
    color: '#e00040', weight: 3, opacity: 0.65, dashArray: '8, 10',
  }).addTo(map);

  // Fit bounds
  const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
  map.fitBounds(bounds, {
    paddingTopLeft:     [window.innerWidth >= 768 ? 320 : 20, 80],
    paddingBottomRight: [20, 120]
  });
}

// ── DWELL TIMES ───────────────────────────────────────────────
const DWELL = { landmark:25, church:20, food:75, cafe:40, market:35, soviet:25, pub:25, nature:40 };
function getDwell(cat){ return DWELL[cat] || 25; }
function formatMins(mins){
  if(mins < 60) return `${mins} min`;
  const h = Math.floor(mins/60), m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function haversineM(a, b){
  const R = 6371000, dLat = (b.lat-a.lat)*Math.PI/180, dLng = (b.lng-a.lng)*Math.PI/180;
  const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function formatWalk(m){
  const mins = Math.round(m/80);
  if(mins<2) return '<2 min';
  if(mins<60) return `~${mins} min`;
  return `~${Math.round(mins/6)/10}h`;
}

function getSortedFavPlaces(){
  let u = favourites.map(id => PLACES.find(x=>x.id===id)).filter(Boolean);
  if(u.length < 2) return u;
  u.sort((a,b) => a.lng - b.lng);
  const s = [u.shift()];
  while(u.length){ const last=s[s.length-1]; let bi=0,bd=Infinity; u.forEach((p,i)=>{ const d=haversineM(last,p); if(d<bd){bd=d;bi=i;} }); s.push(u.splice(bi,1)[0]); }
  return s;
}

function planFavTrip(){
  if(favourites.length < 2){ alert('Add at least 2 favourites first!'); return; }
  const places = getSortedFavPlaces();
  let totalWalkSecs = 0, totalDwell = 0;
  places.forEach((p, i) => {
    totalDwell += getDwell(p.cat);
    if(i < places.length-1){
      totalWalkSecs += Math.round(haversineM(p, places[i+1]) / 80 * 60 * 1.35);
    }
  });
  const totalWalkMins = Math.round(totalWalkSecs/60);
  const totalMins = totalWalkMins + totalDwell;
  let totalDistM = 0;
  for(let i=1;i<places.length;i++) totalDistM += haversineM(places[i-1],places[i]);

  const el = document.getElementById('trip-content');
  el.innerHTML = `
    <div class="trip-summary">
      <span>🗺 ${places.length} stops</span>
      <span>⏱ ~${formatMins(totalMins)} total</span>
      <span>🚶 ${formatMins(totalWalkMins)} walking</span>
      <span>📏 ${(totalDistM/1000).toFixed(1)} km</span>
    </div>
    <div style="font-size:0.72rem;color:#888;text-align:center;padding:4px 0 8px;">Walking times are estimates</div>` +
  places.map((p,i)=>{
    const walkToNext = i < places.length-1
      ? Math.round(haversineM(p,places[i+1])/80*1.35) : null;
    return `
    <div class="trip-stop" onclick="jumpToTripStop(${p.id})">
      <div class="trip-stop-num">${i+1}</div>
      <div class="trip-stop-info">
        <div class="trip-stop-name">${p.emoji} ${p.name}</div>
        <div class="trip-stop-meta">${CL[p.cat]}${p.address?' · '+p.address:''}</div>
        ${p.hours?`<div class="trip-stop-hours">🕐 ${p.hours}</div>`:''}
        <div class="trip-stop-dwell">⏱ ~${getDwell(p.cat)} min here</div>
      </div>
      <button class="trip-stop-map" onclick="event.stopPropagation();window.open('https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}','_blank')">📍</button>
    </div>
    ${walkToNext!==null?`<div class="trip-connector">🚶 ~${walkToNext} min walk</div>`:''}`;
  }).join('');

  document.getElementById('trip-overlay').classList.add('open');
}

function jumpToTripStop(id){
  const p = PLACES.find(x=>x.id===id);
  if(p) map.panTo([p.lat, p.lng]);
}
function closeTripPlan(){ document.getElementById('trip-overlay').classList.remove('open'); }

function openTripInMaps(){
  const places = getSortedFavPlaces();
  if(!places.length) return;
  const stops = places.slice(0,8);
  const origin = encodeURIComponent(`${stops[0].lat},${stops[0].lng}`);
  const dest   = encodeURIComponent(`${stops[stops.length-1].lat},${stops[stops.length-1].lng}`);
  const waypts = stops.slice(1,-1).map(p=>encodeURIComponent(`${p.lat},${p.lng}`)).join('|');
  window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypts?'&waypoints='+waypts:''}&travelmode=walking`,'_blank');
}

function saveMapImage(){
  alert('Map screenshot requires internet connection. Please take a screenshot manually.');
}

// Stubs
function toggleFavPanel(){}
function renderFavList(){}
function openFavPlace(id){ openDetail(id); }
function removeFav(e,id){
  e.stopPropagation();
  favourites = favourites.filter(x=>x!==id);
  saveFavs();
  if(AID===id) syncFavBtn(id);
}

// ── DRAGGABLE NEIGHBOURHOOD BAR ──────────────────────────────
(function initNbhdDrag(){
  const bar = document.getElementById('nbhd-bar');
  const handle = document.getElementById('nbhd-handle');
  if(!bar || !handle) return;
  let dragY=0, startBottom=0, dragging=false;
  function getCurrentBottom(){ return window.innerHeight - bar.getBoundingClientRect().bottom; }
  function clamp(val){ return Math.max(0, Math.min(window.innerHeight - bar.offsetHeight - 56, val)); }
  function startDrag(clientY){ dragging=true; dragY=clientY; startBottom=getCurrentBottom(); document.body.style.userSelect='none'; bar.style.transition='none'; }
  function doDrag(clientY){ if(!dragging) return; bar.style.bottom = clamp(startBottom + (dragY - clientY)) + 'px'; }
  function endDrag(){ dragging=false; document.body.style.userSelect=''; bar.style.transition=''; }
  handle.addEventListener('mousedown',  e=>{ startDrag(e.clientY); e.preventDefault(); });
  document.addEventListener('mousemove', e=>doDrag(e.clientY));
  document.addEventListener('mouseup',   endDrag);
  handle.addEventListener('touchstart', e=>{ startDrag(e.touches[0].clientY); e.stopPropagation(); }, {passive:true});
  handle.addEventListener('touchmove',  e=>{ doDrag(e.touches[0].clientY); e.preventDefault(); }, {passive:false});
  handle.addEventListener('touchend',   endDrag, {passive:true});
})();

document.addEventListener('DOMContentLoaded', updateFavUI);
