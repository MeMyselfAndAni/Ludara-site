// ── LIST ──────────────────────────────────────────────────────

// ── Drag-to-reorder helpers ───────────────────────────────────
const FAVS_ORDER_KEY_PREFIX = 'favs_order_';
function _favsOrderKey(){ return FAVS_ORDER_KEY_PREFIX + window.location.pathname.replace(/\//g,'_'); }
function _getSavedOrder(){ try{ return JSON.parse(localStorage.getItem(_favsOrderKey()) || 'null'); }catch(e){ return null; } }
function _setSavedOrder(ids){ localStorage.setItem(_favsOrderKey(), JSON.stringify(ids)); }
function _clearSavedOrder(){ localStorage.removeItem(_favsOrderKey()); }

function _applyDragOrder(allSaved){
  const manualOrder = _getSavedOrder();
  if(!manualOrder || !manualOrder.length) return null; // no manual order — use auto
  // Rebuild list in stored order, include any new saves not yet in order at end
  const orderedIds = manualOrder.filter(id => allSaved.some(p => p.id === id));
  const inOrder = orderedIds.map(id => allSaved.find(p => p.id === id)).filter(Boolean);
  const notInOrder = allSaved.filter(p => !orderedIds.includes(p.id));
  return [...inOrder, ...notInOrder];
}

function _initDragOnList(el){
  let dragSrcId = null;

  el.querySelectorAll('.place-row[draggable]').forEach(row => {
    row.addEventListener('dragstart', function(e){
      dragSrcId = parseInt(this.dataset.id);
      this.style.opacity = '0.5';
      e.dataTransfer.effectAllowed = 'move';
    });
    row.addEventListener('dragend', function(){
      this.style.opacity = '';
      el.querySelectorAll('.place-row').forEach(r => r.classList.remove('drag-over'));
    });
    row.addEventListener('dragover', function(e){
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      el.querySelectorAll('.place-row').forEach(r => r.classList.remove('drag-over'));
      this.classList.add('drag-over');
    });
    row.addEventListener('drop', function(e){
      e.stopPropagation();
      const targetId = parseInt(this.dataset.id);
      if(dragSrcId === targetId) return;
      // Get current displayed order
      const rows = Array.from(el.querySelectorAll('.place-row[draggable]'));
      const ids = rows.map(r => parseInt(r.dataset.id));
      const fromIdx = ids.indexOf(dragSrcId);
      const toIdx   = ids.indexOf(targetId);
      if(fromIdx < 0 || toIdx < 0) return;
      ids.splice(fromIdx, 1);
      ids.splice(toIdx, 0, dragSrcId);
      _setSavedOrder(ids);
      // Re-render with new order
      if(typeof renderList === 'function') renderList();
      if(typeof drawSavedRoute === 'function') drawSavedRoute();
    });

    // Touch drag support
    let touchDragSrc = null, touchClone = null;
    row.addEventListener('touchstart', function(e){
      if(!this.draggable) return;
      touchDragSrc = this;
    }, {passive:true});
    row.addEventListener('touchmove', function(e){
      if(!touchDragSrc) return;
      e.preventDefault();
      const touch = e.touches[0];
      const overEl = document.elementFromPoint(touch.clientX, touch.clientY);
      const overRow = overEl && overEl.closest('.place-row[draggable]');
      el.querySelectorAll('.place-row').forEach(r => r.classList.remove('drag-over'));
      if(overRow && overRow !== touchDragSrc) overRow.classList.add('drag-over');
    }, {passive:false});
    row.addEventListener('touchend', function(e){
      if(!touchDragSrc) return;
      const touch = e.changedTouches[0];
      const overEl = document.elementFromPoint(touch.clientX, touch.clientY);
      const overRow = overEl && overEl.closest('.place-row[draggable]');
      el.querySelectorAll('.place-row').forEach(r => r.classList.remove('drag-over'));
      if(overRow && overRow !== touchDragSrc){
        const rows = Array.from(el.querySelectorAll('.place-row[draggable]'));
        const ids = rows.map(r => parseInt(r.dataset.id));
        const srcId = parseInt(touchDragSrc.dataset.id);
        const tgtId = parseInt(overRow.dataset.id);
        const fi = ids.indexOf(srcId), ti = ids.indexOf(tgtId);
        if(fi >= 0 && ti >= 0){
          ids.splice(fi, 1);
          ids.splice(ti, 0, srcId);
          _setSavedOrder(ids);
          if(typeof renderList === 'function') renderList();
          if(typeof drawSavedRoute === 'function') drawSavedRoute();
        }
      }
      touchDragSrc = null;
    }, {passive:true});
  });
}

function renderList(){
  const el=document.getElementById('places-list');
  if(!el) return;
  // Fix 2: padding-bottom so last items scroll clear of the neighbourhood bar (~130px)
  el.style.paddingBottom = '140px';
  let filtered;

  if(typeof savedFilterActive !== 'undefined' && savedFilterActive){
    const rawFavs = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
    const allSaved = rawFavs.map(id => PLACES.find(x => x.id === id || x.id === +id)).filter(Boolean);

    // Use manual order if set, otherwise auto proximity sort
    let sorted = _applyDragOrder(allSaved);
    if(!sorted){
      sorted = allSaved;
      if(allSaved.length >= 2){
        let pool = [...allSaved]; pool.sort((a,b)=>a.lng-b.lng);
        const out = [pool.shift()];
        while(pool.length){ const last=out[out.length-1]; let bi=0,bd=Infinity; pool.forEach((p,i)=>{ const d=(p.lat-last.lat)**2+(p.lng-last.lng)**2; if(d<bd){bd=d;bi=i;} }); out.push(pool.splice(bi,1)[0]); }
        sorted = out;
      }
    }
    filtered = sorted;
    const catNote = (AF && AF !== 'all') ? ` · +${CL[AF]||AF} on map` : '';
    document.getElementById('sheet-title').textContent = `♥ ${sorted.length} Saved${catNote}`;
    document.getElementById('list-badge').textContent = sorted.length;

    // Banner with auto-sort reset button
    let banner = document.getElementById('saved-mode-banner');
    if(!banner){
      const sheet = document.getElementById('sheet');
      banner = document.createElement('div');
      banner.id = 'saved-mode-banner';
      banner.className = 'saved-mode-banner';
      const hasManual = !!_getSavedOrder();
      banner.innerHTML = `<span>Drag ⠿ to reorder stops</span>
        <button class="saved-plan-btn" onclick="planFavTrip()">🗺 Itinerary</button>
        ${hasManual ? '<button class="saved-plan-btn" style="margin-left:4px" onclick="_clearSavedOrder();renderList();if(typeof drawSavedRoute===\'function\')drawSavedRoute()">↺ Auto</button>' : ''}`;
      const header = sheet.querySelector('.sheet-header');
      if(header) header.insertAdjacentElement('afterend', banner);
    } else {
      // Update reset button visibility
      const hasManual = !!_getSavedOrder();
      let autoBtn = banner.querySelector('.saved-auto-reset');
      if(hasManual && !autoBtn){
        const btn = document.createElement('button');
        btn.className = 'saved-plan-btn saved-auto-reset';
        btn.style.marginLeft = '4px';
        btn.textContent = '↺ Auto';
        btn.onclick = function(){ _clearSavedOrder(); renderList(); if(typeof drawSavedRoute==='function') drawSavedRoute(); };
        banner.appendChild(btn);
      } else if(!hasManual && autoBtn){
        autoBtn.remove();
      }
    }

    el.innerHTML = allSaved.length === 0
      ? '<div style="padding:32px 20px;text-align:center;color:#999;font-size:0.85rem;">Tap ♡ on any place<br>to save it here</div>'
      : sorted.map((p,i) => `
        <div class="place-row ${p.id===AID?'active':''}" onclick="openDetail(${p.id})" id="row-${p.id}" draggable="true" data-id="${p.id}" style="cursor:grab">
          <span class="drag-handle" style="font-size:1.1rem;color:#ccc;margin:0 6px 0 2px;cursor:grab;flex-shrink:0;touch-action:none">⠿</span>
          <div class="trip-stop-num" style="margin:0 8px 0 0;flex-shrink:0">${i+1}</div>
          <div class="place-thumb" id="thumb-${p.id}">${p.emoji}</div>
          <div class="place-info">
            <div class="place-name">${p.name}</div>
            <div class="place-type">${CL[p.cat]}</div>
            <div class="place-addr">${p.address}</div>
          </div>
          <span class="chevron">›</span>
        </div>`).join('');

    // Wire up drag events after rendering
    _initDragOnList(el);

    // Load thumbnails
    const imgBase = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
    sorted.forEach(p => {
      const thumb = document.getElementById('thumb-' + p.id);
      if(!thumb) return;
      const img = new Image();
      img.onload = function(){ if(thumb) thumb.innerHTML = '<img src="' + imgBase + 'place-' + p.id + '.jpg" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:8px">'; };
      img.src = imgBase + 'place-' + p.id + '.jpg';
    });
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
  // Deactivate Saved when any category filter is clicked
  const savedPill = document.getElementById('pill-saved');
  if(savedPill) savedPill.classList.remove('active');
  if(typeof savedFilterActive !== 'undefined' && savedFilterActive){
    savedFilterActive = false;
    if(typeof clearTripRoute === 'function') clearTripRoute();
    const banner = document.getElementById('saved-mode-banner');
    if(banner) banner.remove();
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
