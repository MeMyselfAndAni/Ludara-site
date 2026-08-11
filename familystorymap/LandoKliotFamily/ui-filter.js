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


// ── Search ────────────────────────────────────────────────────
let _searchQuery = '';

/* ── The person journey filter ─────────────────────────────────────────────
   Set when the reader picks somebody in the family tree. While it is set the
   place list holds only that person's stops, in the order their journey is
   drawn on the map, and a pill over the map says whose journey it is.

   Two rules keep it from becoming a trap:
   - the pill always carries an ✕, so there is never a narrowed list with
     nothing on screen explaining why
   - any other filter the reader reaches for (a thread chip, the search box,
     the bookmarks pill) replaces it rather than combining with it, and the
     replacement is handled centrally in renderList so a per-family
     index.html never has to know this feature exists                        */
var PERSON_FILTER = null;   // { label:'name', ids:[placeId, …], personId:'nina' }
var _pppDragPos = null;     // where the reader dragged the pill, kept until the filter clears

function _renderPersonPill(){
  var old = document.getElementById('person-path-pill');
  if(old) old.remove();
  if(!PERSON_FILTER){ _pppDragPos = null; return; }
  var el = document.createElement('div');
  el.id = 'person-path-pill';
  el.className = 'person-path-pill';
  el.setAttribute('dir', 'auto');
  var name = document.createElement('span');
  name.className = 'ppp-name';
  // Their own distance, not the family's. A grandchild who taps their
  // grandmother should see how far SHE went.
  name.textContent = '👤 ' + PERSON_FILTER.label
                   + (PERSON_FILTER.km ? ' · ' + fmtKm(PERSON_FILTER.km) : '');
  var x = document.createElement('button');
  x.type = 'button';
  x.className = 'ppp-x';
  x.textContent = '✕';
  var clearLabel = _T('הצגת כל המקומות', 'Показать все места', 'Show all places');
  x.title = clearLabel;
  x.setAttribute('aria-label', clearLabel);
  x.onclick = function(){ window.clearPersonFilter(); };
  el.appendChild(name);
  el.appendChild(x);
  document.body.appendChild(el);

  /* The pill sits over the map and can hide the very path it names. It drags
     anywhere with mouse or finger; the ✕ stays an ordinary button. The dragged
     position survives re-renders (language switch) until the filter clears. */
  el.style.touchAction = 'none';
  el.style.cursor = 'grab';
  if(_pppDragPos){
    el.style.left = _pppDragPos.left + 'px';
    el.style.top  = _pppDragPos.top + 'px';
    el.style.transform = 'none';
  }
  el.addEventListener('pointerdown', function(ev){
    if(ev.target === x) return;                    // the ✕ is a click, never a drag
    var r = el.getBoundingClientRect();
    var offX = ev.clientX - r.left, offY = ev.clientY - r.top;
    try { el.setPointerCapture(ev.pointerId); } catch(e){}
    el.style.cursor = 'grabbing';
    function mv(e2){
      var L = Math.max(4, Math.min(window.innerWidth  - r.width  - 4, e2.clientX - offX));
      var T = Math.max(4, Math.min(window.innerHeight - r.height - 4, e2.clientY - offY));
      el.style.left = L + 'px';
      el.style.top  = T + 'px';
      el.style.transform = 'none';
      _pppDragPos = { left: L, top: T };
    }
    function up(){
      el.style.cursor = 'grab';
      el.removeEventListener('pointermove', mv);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    }
    el.addEventListener('pointermove', mv);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    ev.preventDefault();
  });
}

/* places must already be in the order the path is drawn, so the numbers in the
   list are the numbers on the map. */
window.setPersonFilter = function(label, places, personId){
  PERSON_FILTER = {
    label: label,
    ids:   places.map(function(p){ return p.id; }),
    personId: personId || null,
    km:    (typeof journeyKm === 'function') ? journeyKm(places) : 0
  };
  _renderPersonPill();
  renderList();      // not applyFilters: that would wipe the path just drawn
};

window.clearPersonFilter = function(quiet){
  if(!PERSON_FILTER) return;
  PERSON_FILTER = null;
  _renderPersonPill();
  if(typeof clearTripRoute === 'function') clearTripRoute();
  if(!quiet) renderList();
};

window.isPersonFiltered = function(){ return !!PERSON_FILTER; };

/* The person's stops, in journey order, for whoever exports them: the PDF
   booklet and the Share link both narrow to the selected person through these. */
window.getPersonFilterPlaces = function(){
  if(!PERSON_FILTER) return null;
  return PERSON_FILTER.ids
    .map(function(id){ return PLACES.find(function(p){ return p.id === id; }); })
    .filter(Boolean);
};
window.getPersonFilterLabel = function(){ return PERSON_FILTER ? PERSON_FILTER.label : null; };
window.getPersonFilterId    = function(){ return PERSON_FILTER ? PERSON_FILTER.personId : null; };

/* A place matches the query if any of its own fields match — or if a family
   member linked to it matches by name, in either Hebrew or Russian, whatever
   the current display language is. */
function _placeMatchesQuery(p, q){
  if(!q) return true;
  if(p.name && p.name.toLowerCase().includes(q)) return true;
  if(p.type && p.type.toLowerCase().includes(q)) return true;
  if(p.address && p.address.toLowerCase().includes(q)) return true;
  if(p.search && p.search.toLowerCase().includes(q)) return true;
  if(typeof PEOPLE !== 'undefined'){
    for(var i = 0; i < PEOPLE.length; i++){
      var per = PEOPLE[i];
      if(per.places && per.places.indexOf(p.id) !== -1 &&
         ((per.he && per.he.toLowerCase().includes(q)) ||
          (per.ru && per.ru.toLowerCase().includes(q)) ||
          (per.en && per.en.toLowerCase().includes(q)))) return true;
    }
  }
  return false;
}

function _initSearch(){
  const titleEl = document.getElementById('sheet-title');
  if(!titleEl || document.getElementById('search-icon-btn')) return;

  // Inject icon button next to title
  const iconBtn = document.createElement('button');
  iconBtn.id = 'search-icon-btn';
  iconBtn.innerHTML = '🔍';
  iconBtn.title = _T('חיפוש מקומות', 'Поиск мест', 'Search places');
  iconBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:1rem;padding:0 0 0 8px;opacity:0.6;flex-shrink:0;line-height:1;';
  iconBtn.addEventListener('click', _toggleSearch);

  // Wrap title + icon in a flex row
  const titleWrap = titleEl.parentNode;
  if(titleWrap){
    titleWrap.style.display = 'flex';
    titleWrap.style.alignItems = 'center';
    titleEl.after(iconBtn);
  }

  // Create search input (hidden initially)
  const input = document.createElement('input');
  input.id = 'search-input';
  input.type = 'text';
  input.placeholder = _T('חיפוש מקומות…', 'Поиск мест…', 'Search places…');
  input.style.cssText = [
    'display:none','width:100%','padding:7px 12px',
    'border:1.5px solid var(--brand)','border-radius:20px',
    'font-size:0.85rem','outline:none','font-family:inherit',
    'margin:4px 12px 6px','box-sizing:border-box','transition:all 0.2s'
  ].join(';');
  input.addEventListener('input', function(){
    _searchQuery = this.value.trim().toLowerCase();
    applyFilters(); /* filters map pins too, then re-renders the list */
  });
  input.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ _closeSearch(); }
  });

  // Insert below the sheet header
  const sheet = document.getElementById('sheet');
  const header = sheet && sheet.querySelector('.sheet-header');
  if(header) header.insertAdjacentElement('afterend', input);
}

function _toggleSearch(){
  const input = document.getElementById('search-input');
  const btn   = document.getElementById('search-icon-btn');
  if(!input) return;
  if(input.style.display === 'none'){
    input.style.display = 'block';
    if(btn) btn.style.opacity = '1';
    input.focus();
  } else {
    _closeSearch();
  }
}

function _closeSearch(){
  const input = document.getElementById('search-input');
  const btn   = document.getElementById('search-icon-btn');
  if(input){ input.style.display = 'none'; input.value = ''; }
  if(btn) btn.style.opacity = '0.6';
  _searchQuery = '';
  renderList();
}


// ── Distance helpers ─────────────────────────────────────────
function _distM(lat1, lng1, lat2, lng2) {
  var R = 6371000, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
  var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
  return R * 2 * Math.asin(Math.sqrt(a));
}
function _fmtDist(m) {
  return m < 1000 ? Math.round(m) + 'm' : (m/1000).toFixed(1) + 'km';
}

function updateListDistances() {
  if (!window._userLat) return;
  PLACES.forEach(function(place) {
    var row = document.getElementById('row-' + place.id);
    if (!row) return;
    var badge = row.querySelector('.dist-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'dist-badge';
      badge.style.cssText = 'display:inline-block;font-size:0.72rem;color:#888;background:rgba(0,0,0,0.06);border-radius:10px;padding:2px 7px;margin-left:6px;white-space:nowrap;vertical-align:middle';
      var nameEl = row.querySelector('.place-name');
      if (nameEl) nameEl.appendChild(badge);
    }
    badge.textContent = _fmtDist(_distM(window._userLat, window._userLng, place.lat, place.lng));
  });
}

// ── Hours display formatter ───────────────────────────────────
// Converts 24hr time to 12hr AM/PM when TIME_FORMAT === '12h'
// TIME_FORMAT is defined per guide in map.js (default: '24h')
function _24to12(hhmm){
  const parts = hhmm.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return m === 0 ? h12 + ' ' + period : h12 + ':' + String(m).padStart(2,'0') + ' ' + period;
}

function formatHours(str){
  if(!str) return str;
  if(typeof TIME_FORMAT === 'undefined' || TIME_FORMAT !== '12h') return str;
  return str.replace(/\d{1,2}:\d{2}/g, _24to12);
}

function renderList(){
  const el=document.getElementById('places-list');
  if(!el) return;
  // Fix 2: padding-bottom so last items scroll clear of the neighbourhood bar (~130px)
  el.style.paddingBottom = '140px';
  let filtered;

  // Show/hide search icon depending on mode
  const _searchIconBtn = document.getElementById('search-icon-btn');
  const _searchInputEl = document.getElementById('search-input');

  // Searching, or opening the bookmarks, is a new intent. It replaces a person's
  // journey rather than intersecting with it. Handled here rather than in each
  // caller, because the search box lives in the per-family index.html.
  if(PERSON_FILTER && (_searchQuery || (typeof savedFilterActive !== 'undefined' && savedFilterActive))){
    window.clearPersonFilter(true);
  }

  if(typeof savedFilterActive !== 'undefined' && savedFilterActive){
    // Hide search in saved mode
    if(_searchIconBtn) _searchIconBtn.style.display = 'none';
    if(_searchInputEl){ _searchInputEl.style.display = 'none'; _searchInputEl.value = ''; _searchQuery = ''; }
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
    const catNote = (AF && AF !== 'all') ? ` · +${CL[AF]||AF}${_T(' על המפה', ' на карте', ' on map')}` : '';
    document.getElementById('sheet-title').textContent = `🔖 ${sorted.length}${_T(' סימניות', ' закладок', ' bookmarked')}${catNote}`;
    document.getElementById('list-badge').textContent = sorted.length;

    // Banner with auto-sort reset button
    let banner = document.getElementById('saved-mode-banner');
    if(!banner){
      const sheet = document.getElementById('sheet');
      banner = document.createElement('div');
      banner.id = 'saved-mode-banner';
      banner.className = 'saved-mode-banner';
      const hasManual = !!_getSavedOrder();
      banner.innerHTML = `<span>${_T('גררו ⠿ כדי לשנות את הסדר', 'Перетащите ⠿, чтобы изменить порядок', 'Drag ⠿ to reorder stops')}</span>
        <button class="saved-plan-btn" onclick="planFavTrip()">🗺 ${_T('מסלול', 'Маршрут', 'Itinerary')}</button>
        ${hasManual ? `<button class="saved-plan-btn" style="margin-left:4px" onclick="_clearSavedOrder();renderList();if(typeof drawSavedRoute==='function')drawSavedRoute()">↺ ${_T('אוטומטי', 'Авто', 'Auto')}</button>` : ''}`;
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
        btn.textContent = '↺ ' + _T('אוטומטי', 'Авто', 'Auto');
        btn.onclick = function(){ _clearSavedOrder(); renderList(); if(typeof drawSavedRoute==='function') drawSavedRoute(); };
        banner.appendChild(btn);
      } else if(!hasManual && autoBtn){
        autoBtn.remove();
      }
    }

    el.innerHTML = allSaved.length === 0
      ? `<div style="padding:32px 20px;text-align:center;color:#999;font-size:0.85rem;">${_T('הקישו 🔖 על מקום<br>כדי לשמור אותו כאן', 'Нажмите 🔖 на любом месте,<br>чтобы сохранить его здесь', 'Tap 🔖 on any place<br>to bookmark it here')}</div>`
      : sorted.map((p,i) => `
        <div class="place-row ${p.id===AID?'active':''}" onclick="openDetail(${p.id})" id="row-${p.id}" draggable="true" data-id="${p.id}" style="cursor:grab">
          <span class="drag-handle" style="font-size:1.1rem;color:#ccc;margin:0 6px 0 2px;cursor:grab;flex-shrink:0;touch-action:none">⠿</span>
          <div class="stop-num" style="background:${CC[p.cat]};margin:0 8px 0 0">${STOP_NO[p.id]}</div>
          <div class="place-thumb" id="thumb-${p.id}">${p.emoji}</div>
          <div class="place-info">
            <div class="place-name">${p.name}</div>
            ${p.years ? `<div class="stop-years" style="text-align:${_T('right','left','left')}">${p.years}</div>` : ''}
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
      if(typeof photoKnownMissing === 'function' && photoKnownMissing(p.id)) return;
      const img = new Image();
      img.onload = function(){ if(thumb) thumb.innerHTML = '<img src="' + imgBase + 'place-' + p.id + '.jpg" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:8px">'; };
      img.onerror = function(){ if(typeof markPhotoMissing === 'function') markPhotoMissing(p.id); };
      img.src = imgBase + 'place-' + p.id + '.jpg';
    });
    return;
  }

  const banner = document.getElementById('saved-mode-banner');
  if(banner) banner.remove();

  // Show search icon in normal mode
  if(_searchIconBtn) _searchIconBtn.style.display = '';

  if(PERSON_FILTER){
    // Journey order, not story order: the map numbers this person's stops 1..N
    // along their path, and a list that renumbered them differently would put
    // two different numbers on the same place at the same time.
    filtered = PERSON_FILTER.ids
      .map(function(id){ return PLACES.find(function(p){ return p.id === id; }); })
      .filter(Boolean);
  } else {
    filtered = PLACES.filter(p => {
      const catOk    = AF === 'all' || p.cat === AF;
      const nbhdOk   = true; /* neighbourhood selection only pans map — all markers stay visible */
      const openOk   = !openNowActive || isOpenNow(p);
      const searchOk = !_searchQuery || _placeMatchesQuery(p, _searchQuery);
      return catOk && nbhdOk && openOk && searchOk;
    });
    /* The list reads in stop order, 1..N, and not in the order PLACES happens
       to be written in. STOP_NO numbers the route stops first, from
       STORY_PATH_IDS, then everything off the route, so sorting by it makes the
       numbers run straight down the panel with no jumps. Before this the first
       nineteen came out in order and the last ten arrived scattered among them.
       Person view is left alone: it numbers 1..N along that person's own path.
       (11 Aug 2026.) */
    filtered.sort(function(a, b){ return (STOP_NO[a.id] || 0) - (STOP_NO[b.id] || 0); });
  }
  const count = filtered.length;
  const nbhdName = (typeof ANF !== 'undefined' && ANF && ANF !== 'all') ? ({
    // neighbourhood labels from NBHD_LABELS in guide's map.js
  }[ANF] || ANF) + ' · ' : '';
  /* Distance in the sheet title too: the whole journey when nothing is
     filtered, that person's journey when one is. A region or a search shows
     neither, because a partial sum invites the wrong comparison. */
  const _allKm = (!PERSON_FILTER && !_searchQuery && !nbhdName && typeof familyJourneyKm === 'function')
    ? familyJourneyKm() : 0;
  const _titleText = PERSON_FILTER
    ? ('👤 ' + PERSON_FILTER.label + ' · ' + count + _T(' מקומות', ' мест', ' places')
       + (PERSON_FILTER.km ? ' · ' + fmtKm(PERSON_FILTER.km) : ''))
    : _searchQuery
    ? (count + _T(count === 1 ? ' תוצאה' : ' תוצאות', count === 1 ? ' совпадение' : ' совпадений', ' match' + (count !== 1 ? 'es' : '')))
    : (nbhdName + count + _T(' מקומות', ' мест', ' Places')
       + (_allKm ? ' · ' + fmtKm(_allKm) : ''));
  /* dir="auto" or the bidi algorithm tears this line apart. The element has no
     direction of its own and inherits LTR from <html>, which carries lang="he"
     but no dir. With one number the damage was invisible; with two, a Hebrew
     reader saw "מקומות · 11,227 ק״מ 26", the 26 stranded at the far end away
     from the word it counts. auto takes the direction from the first strong
     character, so Hebrew reads right to left and English and Russian are
     untouched. Verified on the live map in all three. */
  var _st = document.getElementById('sheet-title');
  _st.setAttribute('dir', 'auto');
  _st.textContent = _titleText;
  document.getElementById('list-badge').textContent = count;

  /* Colour legend. The list already prints each stop's thread underneath its name,
     but nothing said what the coloured number and stripe MEAN. Built from
     FAMILY.threads, so it is correct for any family without being maintained.
     Each chip also filters — fc() already exists and already toggles back to
     "all" when you click the active one. (31 Jul 2026.) */
  /* The colour key used to print every branch label in full, which on a family
     with six branches filled most of the panel before the reader reached a single
     place. It now collapses to a row of dots and opens on tap. It stays open
     while a branch filter is active, so the way back to "all" is always visible. */
  const _legendOpen = (window._legendOpen === true) || AF !== 'all';
  const _legend = `
    <div class="thread-legend${_legendOpen ? ' open' : ''}">
      <button class="thread-key" onclick="window._toggleLegend()"
              title="${_T('מקרא הצבעים', 'Обозначения цветов', 'Colour key')}">
        <span class="thread-key-dots">${FAMILY.threads.map(t => `<i class="thread-dot" style="--c:${t.color}"></i>`).join('')}</span>
        <span class="thread-key-label">${_T('מקרא הצבעים', 'Цвета', 'Colour key')}</span>
        <span class="thread-caret">${_legendOpen ? '\u25B4' : '\u25BE'}</span>
      </button>
      <div class="thread-chips">
        ${FAMILY.threads.map(t => `
          <button class="thread-chip${AF === t.key ? ' on' : ''}"
                  style="--c:${t.color}"
                  onclick="fc(null,'${t.key}')"
                  title="${_T('סינון לפי', 'Показать только', 'Show only')}: ${CL[t.key] || t.key}">
            <span class="thread-dot"></span>${CL[t.key] || t.key}
          </button>`).join('')}
        ${AF !== 'all' ? `<button class="thread-chip thread-chip-all" onclick="fc(null,'all')">${_T('הכול', 'Все', 'All')}</button>` : ''}
      </div>
    </div>`;

  /* Action row: PDF + Share available from the main (Story Path) list too */
  const _actionRow = `
    <div style="display:flex;padding:8px 10px 6px;gap:5px;">
      <button class="saved-action-btn" id="list-pdf-btn" onclick="if(typeof generatePDF==='function')generatePDF()" style="flex:1">📄 ${_T('חוברת PDF', 'Буклет PDF', 'PDF')}</button>
      <button class="saved-action-btn" id="list-share-btn" onclick="shareItinerary()" style="flex:1">🔗 ${_T('שיתוף', 'Поделиться', 'Share')}</button>
    </div>`;

  /* "One for your family" card at the foot of the list. Driven entirely by
     FAMILY.promo in each map's own family.js, so a map without that block
     shows nothing — a customer family should not be sold to while reading
     about their own grandmother. Hidden while a search, a branch filter or a
     person is active: it belongs at the end of the whole journey, not
     underneath three search results. (11 Aug 2026.) */
  const _pc = (typeof FAMILY !== 'undefined' && FAMILY.promo) ? FAMILY.promo : null;
  const _pt = (_pc && !PERSON_FILTER && !_searchQuery && AF === 'all')
    ? _T(_pc.he, _pc.ru, _pc.en) : null;
  const _promo = _pt ? `
    <a class="list-promo" href="${_pc.url}" target="_blank" rel="noopener" dir="auto">
      <div class="list-promo-title">${_pt.title}</div>
      <div class="list-promo-body">${_pt.body}</div>
      <span class="list-promo-cta">${_pt.cta}<span aria-hidden="true"> ›</span></span>
    </a>` : '';

  el.innerHTML = _legend + _actionRow + filtered.map((p,i)=>`
    <div class="place-row ${p.id===AID?'active':''}" onclick="openDetail(${p.id})" id="row-${p.id}">
      <div class="cat-pip" style="background:${CC[p.cat]}"></div>
      <div class="stop-num" style="background:${CC[p.cat]}">${PERSON_FILTER ? (i+1) : STOP_NO[p.id]}</div>
      <div class="place-thumb" id="thumb-${p.id}">${p.emoji}</div>
      <div class="place-info">
        <div class="place-name">${p.name}</div>
        ${p.years ? `<div class="stop-years" style="text-align:${_T('right','left','left')}">${p.years}</div>` : ''}
        <div class="place-type">${CL[p.cat]}</div>
        <div class="place-addr">${p.address}</div>
      </div>
      <span class="chevron">›</span>
    </div>`).join('') + _promo;

  const imgBase = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  filtered.forEach(p=>{
    const thumb = document.getElementById(`thumb-${p.id}`);
    if(!thumb) return;
    if(typeof photoKnownMissing === 'function' && photoKnownMissing(p.id)) return;
    const img = new Image();
    img.onload = () => { thumb.innerHTML = `<img src="${imgBase}place-${p.id}.jpg" alt="${p.name}" loading="lazy">`; };
    img.onerror = () => { if(typeof markPhotoMissing === 'function') markPhotoMissing(p.id); };
    img.src = imgBase + 'place-' + p.id + '.jpg';
  });
}

// Stop numbers for the place list.
// Deliberately NOT p.id: in some maps the ids were assigned before the places were
// grouped by region, so id 8 can be the eighteenth entry in the list. This is
// the place's position in the curated story order — the order PLACES is written in,
// which is the order the list and the map path present it. Computed once at load, so
// filtering by branch or searching never renumbers the stops out from under the reader.
const STOP_NO = (function(){
  // Stops on the drawn route are numbered exactly as the map draws them, from
  // STORY_PATH_IDS, so a pin marked 14 is 14 in the list and on its card too.
  // Everything else (side branches, and where the family lives now) keeps a
  // number and its place in the list, continuing after the last route stop.
  var m = {}, n = 0;
  if(typeof STORY_PATH_IDS !== 'undefined' && STORY_PATH_IDS)
    STORY_PATH_IDS.forEach(function(id){ if(!(id in m)) m[id] = ++n; });
  if(typeof PLACES !== 'undefined')
    PLACES.forEach(function(p){ if(!(p.id in m)) m[p.id] = ++n; });
  return m;
})();

// ── FILTER ────────────────────────────────────────────────────
function fc(el,cat){
  // A thread chip replaces a person's journey rather than narrowing it further.
  if(typeof window.clearPersonFilter === 'function') window.clearPersonFilter(true);
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
  } else if(el){
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
      window._userLat = lat;
      window._userLng = lng;
      updateListDistances();
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
  var el = document.getElementById('splash');
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
  setTimeout(function(){ el.classList.add('hidden'); }, 520);
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
      const nbhdOk = true; /* neighbourhood selection only pans map — all markers stay visible */
      const catOk  = AF === 'all' || p.cat === AF;
      const openOk = !openNowActive || isOpenNow(p);
      const searchOk = (typeof _searchQuery === 'undefined') || !_searchQuery
        || _placeMatchesQuery(p, _searchQuery);
      visible = catOk && openOk && nbhdOk && searchOk;
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

// ── Init search on load ───────────────────────────────────────
if(typeof document !== 'undefined'){
  document.addEventListener('DOMContentLoaded', function(){
    // Wait for sheet to be ready
    var tries = 0;
    var interval = setInterval(function(){
      if(document.getElementById('sheet-title') || tries++ > 20){
        clearInterval(interval);
        _initSearch();
      }
    }, 200);

    // Re-apply distance badges whenever the list re-renders
    var _listEl = document.getElementById('places-list');
    if (_listEl) {
      var _distObserver = new MutationObserver(function() {
        if (window._userLat) updateListDistances();
      });
      _distObserver.observe(_listEl, { childList: true });
    }
  });
}

/* The colour key opens and closes on tap. Kept on window so the inline onclick in
   the rendered list can reach it, and so the state survives a re-render. */
window._legendOpen = false;
window._toggleLegend = function(){
  window._legendOpen = !window._legendOpen;
  if (typeof renderList === 'function') renderList();
};
