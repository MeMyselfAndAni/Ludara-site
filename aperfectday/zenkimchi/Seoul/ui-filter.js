// ── LIST ──────────────────────────────────────────────────────
function renderList(){
  const el=document.getElementById('places-list');
  let filtered;

  if(typeof savedFilterActive !== 'undefined' && savedFilterActive){
    const rawFavs = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
    const allSaved = rawFavs.map(id => PLACES.find(x => x.id === id || x.id === +id)).filter(Boolean);
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

  const banner = document.getElementById('saved-mode-banner');
  if(banner) banner.remove();

  filtered = PLACES.filter(p => {
    const catOk  = AF === 'all' || p.cat === AF;
    const nbhdOk = (typeof ANF === 'undefined' || ANF === 'all' || p.nbhd === ANF);
    const openOk = !openNowActive || isOpenNow(p);
    return catOk && nbhdOk && openOk;
  });
  const count = filtered.length;
  const nbhdName = (typeof ANF !== 'undefined' && ANF && ANF !== 'all') ? ({
    // neighbourhood labels from NBHD_LABELS in guide's map.js
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

  const imgBase = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  filtered.forEach(p=>{
    const thumb = document.getElementById(`thumb-${p.id}`);
    if(!thumb) return;
    const img = new Image();
    img.onload = () => { thumb.innerHTML = `<img src="${imgBase}place-${p.id}.jpg" alt="${p.name}" loading="lazy">`; };
    img.src = imgBase + 'place-' + p.id + '.jpg';
  });
}

// ── FILTER ────────────────────────────────────────────────────
function fc(el,cat){
  if(typeof CARD_MODE !== 'undefined') CARD_MODE = 'detail';
  const card = document.getElementById('place-card');
  if(card) card.classList.remove('open');
  const dim = document.getElementById('place-card-dim');
  if(dim) dim.classList.remove('open');
  AID = null;

  if(AF === cat && cat !== 'all') cat = 'all';
  AF = cat;

  document.querySelectorAll('.pill:not(.pill-opennow):not(.pill-saved)').forEach(p=>p.classList.remove('active'));
  if(cat === 'all'){
    document.querySelector('.pill[onclick*="all"]')?.classList.add('active');
  } else {
    el.classList.add('active');
  }
  if(typeof savedFilterActive !== 'undefined' && savedFilterActive){
    document.getElementById('pill-saved').classList.add('active');
  }

  applyFilters();

  // Fit MapLibre map to visible places
  const vis = PLACES.filter(p=>(AF==='all'||p.cat===AF)&&(!openNowActive||isOpenNow(p)));
  if(vis.length && map){
    const lngs = vis.map(p => p.lng), lats = vis.map(p => p.lat);
    map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: { top:120, bottom:100, left: window.innerWidth>=768?320:20, right:20 } }
    );
  }

  if(window.innerWidth >= 768){
    const s = document.getElementById('sheet');
    if(s && s.classList.contains('desktop-hidden')) openSheet();
  }
  renderList();
}

// ── MY LOCATION ───────────────────────────────────────────────
let userMarker = null;
function locateMe(){
  const btn = document.getElementById('locate-btn');
  if(!navigator.geolocation){ alert('Geolocation not supported.'); return; }
  btn.classList.add('locating');
  navigator.geolocation.getCurrentPosition(
    pos => {
      btn.classList.remove('locating');
      btn.classList.add('active');
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if(userMarker) userMarker.remove();

      const dotEl = document.createElement('div');
      dotEl.innerHTML = '<div class="user-dot-outer"><div class="user-dot-inner"></div></div>';
      userMarker = new maplibregl.Marker({ element: dotEl, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);
      userMarker.setMap = function(m) { if(m === null) this.remove(); };

      map.panTo([lng, lat]);  // MapLibre: [lng, lat]
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
  if(!place.hours) return true;
  const h = place.hours.toLowerCase().trim();
  if(h.includes('always') || h.includes('24 hour') || h.includes('24/7') || h.includes('24h') || h.includes('open 24')) return true;

  // Use guide city's local time — requires GUIDE_TIMEZONE constant in map.js
  // e.g. const GUIDE_TIMEZONE = 'America/Chicago'; (New Orleans / Nashville)
  //      const GUIDE_TIMEZONE = 'Europe/London';
  //      const GUIDE_TIMEZONE = 'Asia/Bangkok';
  const now = (typeof GUIDE_TIMEZONE !== 'undefined' && GUIDE_TIMEZONE)
    ? new Date(new Date().toLocaleString('en-US', { timeZone: GUIDE_TIMEZONE }))
    : new Date();
  const day  = now.getDay(); // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const mins = now.getHours() * 60 + now.getMinutes();

  const DAY = { sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6 };

  // Handles wrap-around ranges e.g. Wed–Mon (excludes Tue)
  function dayInRange(from, to){
    const f = DAY[from], t = DAY[to];
    if(f === undefined || t === undefined) return true;
    return f <= t ? (day >= f && day <= t) : (day >= f || day <= t);
  }

  // Handles midnight-crossing e.g. 22:00–02:00
  function timeInRange(seg){
    const m = seg.match(/(\d{1,2}):(\d{2})\s*[–\-]\s*(\d{1,2}):(\d{2})/);
    if(!m) return true;
    const open  = +m[1]*60 + +m[2];
    const close = +m[3]*60 + +m[4];
    return close < open
      ? (mins >= open || mins <= close)
      : (mins >= open && mins <= close);
  }

  // Split on semicolons — handles "Mon–Fri 11:00–14:00; Daily 18:00–22:00" etc.
  const segments = h.split(';').map(s => s.trim()).filter(Boolean);
  let anyRecognised = false;

  for(const seg of segments){
    const isDaily    = /\bdaily\b/.test(seg);
    const rangeMatch = seg.match(/\b(mon|tue|wed|thu|fri|sat|sun)[–\-](mon|tue|wed|thu|fri|sat|sun)\b/);
    const singleMatch = !rangeMatch && seg.match(/\b(mon|tue|wed|thu|fri|sat|sun)\b/);

    if(!isDaily && !rangeMatch && !singleMatch) continue;
    anyRecognised = true;

    const todayOk = isDaily
      || (rangeMatch && dayInRange(rangeMatch[1], rangeMatch[2]))
      || (singleMatch && day === DAY[singleMatch[1]]);

    if(todayOk && timeInRange(seg)) return true;
  }

  return !anyRecognised; // unrecognised format → assume open; recognised but no match → closed
}

function applyFilters(){
  const isSaved = typeof savedFilterActive !== 'undefined' && savedFilterActive;
  const savedIds = isSaved
    ? JSON.parse(localStorage.getItem(FAVS_KEY) || '[]').map(Number)
    : null;

  PLACES.forEach(p => {
    let visible;
    if(isSaved){
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

// ── PIN PULSE — uses Leaflet projection ──────────────────────
function updatePulse(place){
  const pulse = document.getElementById('pin-pulse');
  if(!place || !map){ if(pulse) pulse.style.display='none'; return; }
  try {
    const pt = map.latLngToContainerPoint([place.lat, place.lng]);
    pulse.style.display = 'block';
    pulse.style.left = pt.x + 'px';
    pulse.style.top  = pt.y + 'px';
  } catch(e) {
    if(pulse) pulse.style.display = 'none';
  }
}

// ── NEIGHBOURHOOD STORIES ─────────────────────────────────────
