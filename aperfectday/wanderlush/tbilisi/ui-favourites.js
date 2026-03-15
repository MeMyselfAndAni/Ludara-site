// ══ FAVOURITES ══════════════════════════════════════════════
// Persisted in localStorage
let favourites = JSON.parse(localStorage.getItem('tbilisi-favs') || '[]');
let savedFilterActive = false;

function saveFavs(){
  localStorage.setItem('tbilisi-favs', JSON.stringify(favourites));
  updateFavUI();
}

// Sync in-memory favourites from localStorage (called after external writes)
function refreshFavourites(){
  favourites = JSON.parse(localStorage.getItem('tbilisi-favs') || '[]');
  updateFavUI();
}

function updateFavUI(){
  const count = favourites.length;

  // Pill count badge
  const pillCount = document.getElementById('pill-saved-count');
  if(pillCount){
    pillCount.textContent = count;
    pillCount.style.display = count > 0 ? 'inline-flex' : 'none';
  }
  // Pill icon
  const pill = document.getElementById('pill-saved');
  if(pill){
    const icon = pill.childNodes[0];
    if(icon && icon.nodeType === 3) icon.textContent = count > 0 ? '♥ Saved ' : '♡ Saved ';
  }

  // Re-render list if saved filter is on
  if(savedFilterActive) applyFilters();
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
  syncFavBtn(AID);

  // If saved filter is on and we just un-saved, refresh list
  if(savedFilterActive) applyFilters();
}

function syncFavBtn(id){ if(typeof _updateFavBtn === "function") _updateFavBtn();
  // legacy btn sync below:
  const btn = document.getElementById('pc-btn-fav');
  if(!btn) return;
  const faved = isFav(id);
  btn.textContent = faved ? '♥' : '♡';
  btn.classList.toggle('faved', faved);
  btn.title = faved ? 'Remove from favourites' : 'Save to favourites';
}

// ── SAVED FILTER (replaces the old panel) ────────────────────
function toggleSavedFilter(el){
  savedFilterActive = !savedFilterActive;
  el.classList.toggle('active', savedFilterActive);

  if(savedFilterActive){
    if(favourites.length === 0){
      savedFilterActive = false;
      el.classList.remove('active');
      alert('Tap ♡ on any place to save it here.');
      return;
    }
    // Keep current category filter — Saved now intersects with it
    // (user can still tap Landmarks, Restaurants etc to filter saved places)
    applyFilters();
    // Only open sheet on desktop; mobile user taps "Browse all places"
    if(window.innerWidth >= 768) openSheet();
    drawSavedRoute();
  } else {
    clearTripRoute();
    const banner = document.getElementById('saved-mode-banner');
    if(banner) banner.remove();
    applyFilters();
  }
}

// ── ROUTE DRAWING (real walking path via Directions API) ─────
let tripPolyline  = null;   // kept as stub — renderers replace it
let tripMarkers   = [];
let tripRenderers = [];     // DirectionsRenderer instances

function clearTripRoute(){
  tripMarkers.forEach(m => m.setMap(null));
  tripMarkers = [];
  tripRenderers.forEach(r => r.setMap(null));
  tripRenderers = [];
  if(tripPolyline){ tripPolyline.setMap(null); tripPolyline = null; }
}

function drawSavedRoute(){
  if(!savedFilterActive || favourites.length < 2){ clearTripRoute(); return; }
  const places = getSortedFavPlaces();
  if(places.length < 2){ clearTripRoute(); return; }
  clearTripRoute();

  // Place numbered markers first (instant feedback)
  places.forEach((p, i) => {
    const div = document.createElement('div');
    div.style.cssText = `
      width:24px;height:24px;border-radius:50%;
      background:#e00040;border:2.5px solid white;
      color:white;font-size:0.68rem;font-weight:700;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      font-family:'Inter',sans-serif;`;
    div.textContent = i + 1;
    const m = (window.google?.maps?.marker?.AdvancedMarkerElement)
      ? new google.maps.marker.AdvancedMarkerElement({ map, position:{lat:p.lat,lng:p.lng}, content:div, zIndex:9000+i })
      : new google.maps.Marker({ map, position:{lat:p.lat,lng:p.lng},
          zIndex: 9000 + i,
          label:{text:String(i+1),color:'white',fontSize:'11px',fontWeight:'bold'},
          icon:{path:google.maps.SymbolPath.CIRCLE,scale:14,
                fillColor:'#e00040',fillOpacity:1,strokeColor:'white',strokeWeight:2.5} });
    tripMarkers.push(m);
  });

  // Fit bounds immediately
  const b = new google.maps.LatLngBounds();
  places.forEach(p => b.extend({lat:p.lat,lng:p.lng}));
  map.fitBounds(b, {top:80, right:20, bottom:120, left: window.innerWidth>=768 ? 320 : 20});

  // Request real walking directions — chunk into segments of max 10 stops (8 waypoints)
  const CHUNK = 10;
  const dirSvc = new google.maps.DirectionsService();

  for(let start=0; start < places.length-1; start += CHUNK-1){
    const chunk = places.slice(start, start + CHUNK);
    if(chunk.length < 2) break;

    const origin      = {lat: chunk[0].lat, lng: chunk[0].lng};
    const destination = {lat: chunk[chunk.length-1].lat, lng: chunk[chunk.length-1].lng};
    const waypoints   = chunk.slice(1,-1).map(p => ({
      location: {lat:p.lat, lng:p.lng},
      stopover: true
    }));

    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,          // we draw our own numbered markers
      suppressInfoWindows: true,
      polylineOptions: {
        strokeColor:   '#e00040',
        strokeOpacity: 1,
        strokeWeight:  0,        // hide the solid line
        icons: [{
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor:    '#e00040',
            fillOpacity:  1,
            strokeColor:  '#e00040',
            strokeWeight: 0,
            scale: 4,
          },
          offset: '0',
          repeat: '14px',
        }],
      }
    });
    tripRenderers.push(renderer);

    dirSvc.route({
      origin, destination, waypoints,
      travelMode: google.maps.TravelMode.WALKING,
      optimizeWaypoints: false,
    }, (result, status) => {
      if(status === 'OK'){
        renderer.setDirections(result);
      }
      // On failure (quota etc) fall back to straight dotted line for this chunk
      else {
        const fallback = new google.maps.Polyline({
          path: chunk.map(p=>({lat:p.lat,lng:p.lng})),
          geodesic: true,
          strokeColor:   '#e00040',
          strokeOpacity: 0.5,
          strokeWeight:  3,
          strokePattern: [{ icon:{path:'M 0,-1 0,1',strokeOpacity:1,scale:3}, offset:'0', repeat:'12px' }],
          map
        });
        tripMarkers.push(fallback); // reuse array for cleanup
      }
    });
  }
}

// ── TRIP PLANNER ─────────────────────────────────────────────

function haversineM(a, b){
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const h = Math.sin(dLat/2)**2 +
    Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function formatWalk(m){
  const mins = Math.round(m/80);
  if(mins<2)  return '<2 min';
  if(mins<60) return `~${mins} min`;
  return `~${Math.round(mins/6)/10}h`;
}

function getSortedFavPlaces(){
  let unsorted = favourites.map(id => PLACES.find(x=>x.id===id)).filter(Boolean);
  if(unsorted.length < 2) return unsorted;
  unsorted.sort((a,b) => a.lng - b.lng);
  const sorted = [unsorted.shift()];
  while(unsorted.length){
    const last = sorted[sorted.length-1];
    let bestIdx=0, bestDist=Infinity;
    unsorted.forEach((p,i)=>{ const d=haversineM(last,p); if(d<bestDist){bestDist=d;bestIdx=i;} });
    sorted.push(unsorted.splice(bestIdx,1)[0]);
  }
  return sorted;
}

// clearTripRoute defined above with renderer support

function planFavTrip(){
  if(favourites.length < 2){ alert('Add at least 2 favourites first!'); return; }

  const places = getSortedFavPlaces();
  let totalM = 0;
  for(let i=1;i<places.length;i++) totalM += haversineM(places[i-1],places[i]);
  const totalMins = Math.round(totalM/80);

  const el = document.getElementById('trip-content');
  el.innerHTML = `
    <div class="trip-summary">
      <span>🗺 ${places.length} stops</span>
      <span>🚶 ~${totalMins} min</span>
      <span>📏 ${(totalM/1000).toFixed(1)} km</span>
    </div>` +
  places.map((p,i)=>{
    const dn = i<places.length-1 ? haversineM(p,places[i+1]) : null;
    return `
    <div class="trip-stop" onclick="jumpToTripStop(${p.id})">
      <div class="trip-stop-num">${i+1}</div>
      <div class="trip-stop-info">
        <div class="trip-stop-name">${p.emoji} ${p.name}</div>
        <div class="trip-stop-meta">${CL[p.cat]}${p.address?' · '+p.address:''}</div>
        ${p.hours?`<div class="trip-stop-hours">🕐 ${p.hours}</div>`:''}
      </div>
      <button class="trip-stop-map" onclick="event.stopPropagation();window.open('https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}','_blank')">📍</button>
    </div>
    ${dn!==null?`<div class="trip-connector">↓ ${formatWalk(dn)} walk</div>`:''}`;
  }).join('');

  document.getElementById('trip-overlay').classList.add('open');
}

function jumpToTripStop(id){
  const p = PLACES.find(x=>x.id===id);
  if(p) map.panTo({lat:p.lat,lng:p.lng});
}
function closeTripPlan(){
  document.getElementById('trip-overlay').classList.remove('open');
}
function openTripInMaps(){
  const places = getSortedFavPlaces();
  if(!places.length) return;
  const stops = places.slice(0,8);
  const origin = encodeURIComponent(`${stops[0].lat},${stops[0].lng}`);
  const dest   = encodeURIComponent(`${stops[stops.length-1].lat},${stops[stops.length-1].lng}`);
  const waypts = stops.slice(1,-1).map(p=>encodeURIComponent(`${p.lat},${p.lng}`)).join('|');
  window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypts?'&waypoints='+waypts:''}&travelmode=walking`,'_blank');
}

// ── STUB — old panel functions (called nowhere but keep to avoid JS errors) ──
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
  const bar    = document.getElementById('nbhd-bar');
  const handle = document.getElementById('nbhd-handle');
  if(!bar || !handle) return;

  let dragY=0, startBottom=0, dragging=false;

  function getCurrentBottom(){
    return window.innerHeight - bar.getBoundingClientRect().bottom;
  }
  function clamp(val){
    return Math.max(0, Math.min(window.innerHeight - bar.offsetHeight - 56, val));
  }
  function startDrag(clientY){
    dragging=true; dragY=clientY; startBottom=getCurrentBottom();
    document.body.style.userSelect='none';
    bar.style.transition='none';
  }
  function doDrag(clientY){
    if(!dragging) return;
    bar.style.bottom = clamp(startBottom + (dragY - clientY)) + 'px';
  }
  function endDrag(){
    dragging=false;
    document.body.style.userSelect='';
    bar.style.transition='';
  }

  handle.addEventListener('mousedown',  e=>{ startDrag(e.clientY); e.preventDefault(); });
  document.addEventListener('mousemove', e=>doDrag(e.clientY));
  document.addEventListener('mouseup',   endDrag);
  handle.addEventListener('touchstart', e=>{ startDrag(e.touches[0].clientY); e.stopPropagation(); }, {passive:true});
  handle.addEventListener('touchmove',  e=>{ doDrag(e.touches[0].clientY); e.preventDefault(); }, {passive:false});
  handle.addEventListener('touchend',   endDrag, {passive:true});
})();

// Init
document.addEventListener('DOMContentLoaded', updateFavUI);
