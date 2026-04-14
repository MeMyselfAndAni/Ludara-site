// ══ FAVOURITES ══════════════════════════════════════════════
// Unique key per guide so favourites don't mix between cities
const FAVS_KEY = 'favs_' + window.location.pathname.replace(/\//g,'_');
let favourites = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
let savedFilterActive = false;

// ── Toast notification — replaces browser alert() ────────────
function _toast(msg, durationMs){
  durationMs = durationMs || 3500;
  const existing = document.getElementById('_apd-toast');
  if(existing) existing.remove();
  const el = document.createElement('div');
  el.id = '_apd-toast';
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#1a3a5c';
  el.style.cssText = 'position:fixed;top:110px;left:50%;transform:translateX(-50%);' +
    'background:white;color:' + brand + ';padding:12px 22px;border-radius:24px;' +
    'border:2px solid ' + brand + ';' +
    'font-size:0.82rem;font-weight:600;font-family:Inter,sans-serif;' +
    'z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.15);max-width:80vw;text-align:center;' +
    'animation:_apd-fadein 0.2s ease;pointer-events:none;white-space:nowrap;';
  el.textContent = msg;
  if(!document.getElementById('_apd-toast-style')){
    const s = document.createElement('style');
    s.id = '_apd-toast-style';
    s.textContent = '@keyframes _apd-fadein{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(el);
  setTimeout(function(){ if(el.parentNode) el.remove(); }, durationMs);
}

// ── Brand color from CSS variable ─────────────────────────────
function _brandColor(){ return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#1a3a5c'; }

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
      _toast('Tap ♡ on any place to save it here.');
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
  tripMarkers.forEach(m => { try { m.remove(); } catch(e){} });
  tripMarkers = [];
  tripRenderers = [];
  if(tripPolyline && map.getSource('trip-route')){
    map.getSource('trip-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
  }
  tripPolyline = null;
}

function _ensureRouteLayer(){
  if(!map.getSource('trip-route')){
    map.addSource('trip-route', { type:'geojson', data:{type:'FeatureCollection',features:[]} });
    map.addLayer({
      id: 'trip-route-line', type: 'line', source: 'trip-route',
      paint: { 'line-color': _brandColor(), 'line-width':4, 'line-opacity':0.85 }
    });
  }
}

function _setRouteGeoJSON(geojson){
  _ensureRouteLayer();
  map.getSource('trip-route').setData(geojson);
  tripPolyline = { _isMapLibreLayer: true };
}

function _fitRouteBounds(places){
  const lngs = places.map(p=>p.lng), lats = places.map(p=>p.lat);
  map.fitBounds(
    [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
    { padding:{ top:80, bottom:120, left:window.innerWidth>=768?320:20, right:20 } }
  );
}

function _addNumberedMarkers(places){
  places.forEach((p, i) => {
    const el = document.createElement('div');
    el.style.cssText = 'width:24px;height:24px;border-radius:50%;background:' + _brandColor() + ';border:2.5px solid white;color:white;font-size:0.68rem;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.35);font-family:sans-serif;z-index:'+(9000+i);
    el.textContent = i + 1;
    const marker = new maplibregl.Marker({ element:el, anchor:'center' })
      .setLngLat([p.lng, p.lat]).addTo(map);
    tripMarkers.push(marker);
  });
}

function _drawStraightRoute(places){
  _setRouteGeoJSON({
    type: 'Feature',
    geometry: { type:'LineString', coordinates:places.map(p=>[p.lng,p.lat]) }
  });
}

async function _fetchOSRMRoute(places){
  // OSRM foot routing — uses dedicated walking server
  const allCoords = [];
  const CHUNK = 10;

  for(let i = 0; i < places.length - 1; i += CHUNK - 1){
    const chunk = places.slice(i, Math.min(i + CHUNK, places.length));
    const coords = chunk.map(p => p.lng + ',' + p.lat).join(';');
    // foot.router.project-osrm.org is the dedicated walking profile server
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${coords}?overview=full&geometries=geojson`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      if(data.code === 'Ok' && data.routes && data.routes[0]){
        const segCoords = data.routes[0].geometry.coordinates;
        if(allCoords.length > 0) segCoords.shift();
        allCoords.push(...segCoords);
        // Store actual walking durations
        data.routes[0].legs.forEach((leg, legIdx) => {
          _routeDurations[`${i+legIdx}-${i+legIdx+1}`] = leg.duration;
        });
      } else {
        chunk.forEach(p => allCoords.push([p.lng, p.lat]));
      }
    } catch(e) {
      console.warn('OSRM walking failed, using straight line');
      chunk.forEach(p => allCoords.push([p.lng, p.lat]));
    }
  }
  return allCoords;
}

function drawSavedRoute(){
  if(!savedFilterActive || favourites.length < 2){ clearTripRoute(); return; }
  const places = getSortedFavPlaces();
  if(places.length < 2){ clearTripRoute(); return; }
  clearTripRoute();

  // Draw numbered markers immediately
  _addNumberedMarkers(places);

  // Draw straight line first as placeholder
  _drawStraightRoute(places);
  _fitRouteBounds(places);

  // If online, fetch real walking route from OSRM and replace
  if(navigator.onLine){
    _fetchOSRMRoute(places).then(coords => {
      if(coords && coords.length > 1){
        _setRouteGeoJSON({
          type: 'Feature',
          geometry: { type:'LineString', coordinates: coords }
        });
      }
    }).catch(() => {
      // Keep straight line on failure
    });
  }
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
  if(favourites.length < 2){ _toast('Save at least 2 places first ♡'); return; }
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
  if(p) map.panTo([p.lng, p.lat]);
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
  _toast('Take a screenshot to save the map 📸', 4000);
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

// ── ROUTE STATS — used by ui-pdf.js and unified saved panel ──
// Fetches walking time + distance via OSRM, falls back to haversine
let _lastRouteStats = null;

function _fetchRouteStats(places) {
  return new Promise(function(resolve) {
    if (!places || places.length < 2) {
      return resolve({ walkMins: 0, distM: 0, legMins: [] });
    }

    function _hav(a, b) {
      const R = 6371000, dLat=(b.lat-a.lat)*Math.PI/180, dLng=(b.lng-a.lng)*Math.PI/180;
      const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
      return 2*R*Math.asin(Math.sqrt(h));
    }

    function fallback() {
      let distM = 0;
      const legMins = [];
      for (let i = 1; i < places.length; i++) {
        const d = _hav(places[i-1], places[i]);
        distM += d;
        legMins.push(Math.round(d * 1.35 / 80));
      }
      resolve({ walkMins: Math.round(distM * 1.35 / 80), distM, legMins });
    }

    if (!navigator.onLine) return fallback();

    const coords = places.map(p => p.lng + ',' + p.lat).join(';');
    const url = 'https://routing.openstreetmap.de/routed-foot/route/v1/walking/' + coords + '?overview=false';
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 8000) : null;

    fetch(url, ctrl ? { signal: ctrl.signal } : {})
      .then(r => r.json())
      .then(d => {
        if (timer) clearTimeout(timer);
        if (d.code !== 'Ok' || !d.routes?.[0]) return fallback();
        const route = d.routes[0];
        const legMins = (route.legs || []).map(l => Math.round(l.duration / 60));
        resolve({
          walkMins: Math.round(route.duration / 60),
          distM: route.distance,
          legMins
        });
      })
      .catch(() => { if (timer) clearTimeout(timer); fallback(); });
  });
}

document.addEventListener('DOMContentLoaded', updateFavUI);
