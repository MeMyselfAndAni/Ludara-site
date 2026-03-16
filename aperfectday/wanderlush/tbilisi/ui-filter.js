// ── LIST ──────────────────────────────────────────────────────
function renderList(){
  const el=document.getElementById('places-list');
  let filtered;

  // Saved filter mode — list ALWAYS shows ALL saved places; category pill only adds icons on map
  if(typeof savedFilterActive !== 'undefined' && savedFilterActive){
    // Force re-read from localStorage — never trust stale in-memory array
    const rawFavs = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
    const allSaved = rawFavs.map(id => PLACES.find(x => x.id === id || x.id === +id)).filter(Boolean);
    // Nearest-neighbour sort if 2+ places
    let sorted = allSaved;
    if(allSaved.length >= 2){
      let pool = [...allSaved]; pool.sort((a,b)=>a.lng-b.lng);
      const out = [pool.shift()];
      while(pool.length){ const last=out[out.length-1]; let bi=0,bd=Infinity; pool.forEach((p,i)=>{ const d=(p.lat-last.lat)**2+(p.lng-last.lng)**2; if(d<bd){bd=d;bi=i;} }); out.push(pool.splice(bi,1)[0]); }
      sorted = out;
    }
    filtered = sorted;
    const catNote = (AF && AF !== 'all') ? ` · +${CL[AF]||AF} on map` : '';
    document.getElementById('sheet-title').textContent = `♥ ${sorted.length} Saved${catNote}`;
    document.getElementById('list-badge').textContent = sorted.length;

    // Show/update the plan-trip banner
    let banner = document.getElementById('saved-mode-banner');
    if(!banner){
      const sheet = document.getElementById('sheet');
      banner = document.createElement('div');
      banner.id = 'saved-mode-banner';
      banner.className = 'saved-mode-banner';
      banner.innerHTML = `<span>Interactive trip through your saved places</span>
        <button class="saved-plan-btn" onclick="planFavTrip()">🗺 Full itinerary</button>`;
      const header = sheet.querySelector('.sheet-header');
      if(header) header.insertAdjacentElement('afterend', banner);
    } else {
      // Update text in case it was set with old wording
      const span = banner.querySelector('span');
      if(span) span.textContent = 'Interactive trip through your saved places';
    }

    el.innerHTML = allSaved.length === 0
      ? '<div style="padding:32px 20px;text-align:center;color:#999;font-size:0.85rem;">Tap ♡ on any place<br>to save it here</div>'
      : allSaved.map((p,i) => `
        <div class="place-row ${p.id===AID?'active':''}" onclick="openDetail(${p.id})" id="row-${p.id}">
          <div class="trip-stop-num" style="margin:0 10px 0 4px;flex-shrink:0">${i+1}</div>
          <div class="place-thumb" id="thumb-${p.id}">${p.emoji}</div>
          <div class="place-info">
            <div class="place-name">${p.name}</div>
            <div class="place-type">${CL[p.cat]}</div>
            <div class="place-addr">${p.address}</div>
          </div>
          <span class="chevron">›</span>
        </div>`).join('');
    return;
  }

  // Remove saved banner if present
  const banner = document.getElementById('saved-mode-banner');
  if(banner) banner.remove();

  // Intersection of type filter + neighbourhood filter
  filtered = PLACES.filter(p => {
    const catOk  = AF === 'all' || p.cat === AF;
    const nbhdOk = (typeof ANF === 'undefined' || ANF === 'all' || p.nbhd === ANF);
    const openOk = !openNowActive || isOpenNow(p);
    return catOk && nbhdOk && openOk;
  });
  const count = filtered.length;
  const nbhdName = (typeof ANF !== 'undefined' && ANF && ANF !== 'all') ? ({
    'old-town':'Old Town','sololaki':'Sololaki','avlabari':'Avlabari',
    'vera':'Vera','chugureti':'Chugureti','mtatsminda':'Mtatsminda','vake':'Vake'
  }[ANF] || ANF) + ' · ' : '';
  document.getElementById('sheet-title').textContent = nbhdName + count + ' Places';
  document.getElementById('list-badge').textContent = count;

  el.innerHTML=filtered.map(p=>`
    <div class="place-row ${p.id===AID?'active':''}" onclick="openDetail(${p.id})" id="row-${p.id}">
      <div class="cat-pip" style="background:${CC[p.cat]}"></div>
      <div class="place-thumb" id="thumb-${p.id}">${p.emoji}</div>
      <div class="place-info">
        <div class="place-name">${p.name}</div>
        <div class="place-type">${CL[p.cat]}</div>
        <div class="place-addr">${p.address}</div>
      </div>
      <span class="chevron">›</span>
    </div>`).join('');

  // Lazy-load thumbnails from local images folder
  const imgBase = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  filtered.forEach(p=>{
    const thumb = document.getElementById(`thumb-${p.id}`);
    if(!thumb) return;
    const img = new Image();
    img.onload = () => {
      thumb.innerHTML = `<img src="${imgBase}${p.id}.jpg" alt="${p.name}" loading="lazy">`;
    };
    // If local image missing, keep emoji placeholder — no API call
    img.src = imgBase + p.id + '.jpg';
  });
}

// ── DETAIL ────────────────────────────────────────────────────






// ── FILTER ────────────────────────────────────────────────────
function fc(el,cat){
  // Reset card mode
  if(typeof CARD_MODE !== 'undefined') CARD_MODE = 'detail';

  // Close any open place card silently (no list re-open)
  const card = document.getElementById('place-card');
  if(card) card.classList.remove('open');
  const dim = document.getElementById('place-card-dim');
  if(dim) dim.classList.remove('open');
  AID = null;

  // Toggle pill off if already active
  if(AF === cat && cat !== 'all') cat = 'all';
  AF = cat;

  // Update pill states
  document.querySelectorAll('.pill:not(.pill-opennow):not(.pill-saved)').forEach(p=>p.classList.remove('active'));
  if(cat === 'all'){
    document.querySelector('.pill[onclick*="all"]')?.classList.add('active');
  } else {
    el.classList.add('active');
  }
  if(typeof savedFilterActive !== 'undefined' && savedFilterActive){
    document.getElementById('pill-saved').classList.add('active');
  }

  // Update map markers
  applyFilters();

  // Fit map to visible places
  const vis = PLACES.filter(p=>(AF==='all'||p.cat===AF)&&(!openNowActive||isOpenNow(p)));
  if(vis.length && map){
    const b = new google.maps.LatLngBounds();
    vis.forEach(p=>b.extend({lat:p.lat,lng:p.lng}));
    map.fitBounds(b,{top:120,right:20,bottom:100,left:window.innerWidth>=768?320:20});
  }

  // On desktop open the sheet
  if(window.innerWidth >= 768){
    const s = document.getElementById('sheet');
    if(s && s.classList.contains('desktop-hidden')) openSheet();
  }

  // Always force-render the list last
  renderList();
}

// ── MY LOCATION ───────────────────────────────────────────────
let userMarker = null;
function locateMe(){
  const btn = document.getElementById('locate-btn');
  if(!navigator.geolocation){
    alert('Geolocation is not supported by your browser.');
    return;
  }
  btn.classList.add('locating');
  navigator.geolocation.getCurrentPosition(
    pos => {
      btn.classList.remove('locating');
      btn.classList.add('active');
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Remove old marker
      if(userMarker) userMarker.setMap(null);

      // Create pulsing dot via OverlayView
      const dotDiv = document.createElement('div');
      dotDiv.innerHTML = '<div class="user-dot-outer"><div class="user-dot-inner"></div></div>';

      userMarker = new google.maps.marker.AdvancedMarkerElement
        ? new google.maps.marker.AdvancedMarkerElement({
            map, position:{lat,lng}, content: dotDiv.firstChild
          })
        : new google.maps.Marker({
            map, position:{lat,lng},
            icon:{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8, fillColor:'#1a3a5c', fillOpacity:1,
              strokeColor:'white', strokeWeight:2.5
            },
            title:'You are here'
          });

      // Pan to location smoothly
      map.panTo({lat, lng});
      // Only zoom in if user is far zoomed out
      if(map.getZoom() < 14) map.setZoom(15);
    },
    err => {
      btn.classList.remove('locating');
      const msgs = {1:'Location access denied.', 2:'Location unavailable.', 3:'Request timed out.'};
      alert(msgs[err.code] || 'Could not get location.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}


// ── SPLASH ────────────────────────────────────────────────────
function closeSplash(){
  document.getElementById('splash').classList.add('hidden');
}

// ── OPEN NOW ─────────────────────────────────────────────────
let openNowActive = false;
function toggleOpenNow(el){
  openNowActive = !openNowActive;
  el.classList.toggle('active', openNowActive);
  applyOpenNowFilter();
}

function isOpenNow(place){
  if(!place.hours) return true; // no hours = assume open
  const h = place.hours.toLowerCase();
  if(h.includes('always') || h.includes('24 hour') || h.includes('open 24')) return true;
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const mins = now.getHours() * 60 + now.getMinutes();
  // Parse simple "HH:MM–HH:MM" patterns
  const match = h.match(/(\d{1,2}):(\d{2})\s*[–\-]\s*(\d{1,2}):(\d{2})/);
  if(!match) return true; // can't parse = assume open
  const open = parseInt(match[1])*60 + parseInt(match[2]);
  const close = parseInt(match[3])*60 + parseInt(match[4]);
  // Check closed days
  if(h.includes('mon–sat') || h.includes('mon-sat')){
    if(day === 0) return false; // closed Sunday
  }
  if(h.includes('tue') && h.includes('sun')){
    if(day === 1) return false; // closed Monday
  }
  return mins >= open && mins <= close;
}

function applyFilters(){
  const isSaved = typeof savedFilterActive !== 'undefined' && savedFilterActive;
  // Read saved IDs directly from localStorage — never stale
  const savedIds = isSaved
    ? JSON.parse(localStorage.getItem(FAVS_KEY) || '[]').map(Number)
    : null;

  PLACES.forEach(p => {
    let visible;
    if(isSaved){
      // Saved mode: ignore neighbourhood filter — show ALL saved places
      // plus any category pill matches (union)
      const inSaved = savedIds.includes(p.id);
      const inCat   = AF !== 'all' && p.cat === AF;
      visible = inSaved || inCat;
    } else {
      const nbhdOk = (typeof ANF === 'undefined' || ANF === 'all' || p.nbhd === ANF);
      const catOk  = AF === 'all' || p.cat === AF;
      const openOk = !openNowActive || isOpenNow(p);
      visible = catOk && openOk && nbhdOk;
    }
    if(markers[p.id]) markers[p.id].setVisible(visible);
  });

  if(isSaved && typeof drawSavedRoute === 'function') drawSavedRoute();
  else if(!isSaved && typeof clearTripRoute === 'function') clearTripRoute();

  renderList();
}
function applyOpenNowFilter(){ applyFilters(); }


// ── PIN PULSE OVERLAY ─────────────────────────────────────────
function updatePulse(place){
  const pulse = document.getElementById('pin-pulse');
  if(!place || !map){ pulse.style.display='none'; return; }
  const proj = map.getProjection();
  if(!proj){ pulse.style.display='none'; return; }
  const bounds = map.getBounds();
  if(!bounds){ pulse.style.display='none'; return; }
  // Convert lat/lng to pixel position on the map div
  const mapDiv = document.getElementById('map');
  const ne = proj.fromLatLngToPoint(bounds.getNorthEast());
  const sw = proj.fromLatLngToPoint(bounds.getSouthWest());
  const scale = Math.pow(2, map.getZoom());
  const pt = proj.fromLatLngToPoint(new google.maps.LatLng(place.lat, place.lng));
  const x = (pt.x - sw.x) * scale;
  const y = (pt.y - ne.y) * scale;
  pulse.style.display = 'block';
  pulse.style.left = x + 'px';
  pulse.style.top  = y + 'px';
}


// ══ NEIGHBOURHOOD STORIES ════════════════════════════════════
