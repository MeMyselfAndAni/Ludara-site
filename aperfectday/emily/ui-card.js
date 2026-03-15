// ── UNIFIED PLACE CARD CONTROLLER ────────────────────────────
// Both list details and neighbourhood browsing use this single component.

let CARD_PLACE   = null;
let CARD_LIST    = [];
let CARD_IDX     = 0;
let CARD_MODE    = 'detail'; // 'detail' | 'nbhd'
// AID is declared in data.js

const CAT_COLORS = {
  landmark:'#e8724a', food:'#f0c060', cafe:'#6b9e6e',
  church:'#6090c8', market:'#c08060', soviet:'#9080a8', nature:'#50906a'
};
const CAT_LABELS = {
  landmark:'Landmark', food:'Restaurant', cafe:'Café & Bar',
  church:'Church & Spiritual', market:'Market & Shopping',
  soviet:'Soviet Heritage', nature:'Nature & Views'
};
const CAT_GRADIENTS = {
  landmark:'linear-gradient(135deg,#1a3a5c,#2a5298)',
  food:    'linear-gradient(135deg,#7a3020,#c06040)',
  cafe:    'linear-gradient(135deg,#1a3a2a,#2a7a4a)',
  church:  'linear-gradient(135deg,#1a1a5c,#3a3a9c)',
  market:  'linear-gradient(135deg,#5c3a1a,#9c6a3a)',
  soviet:  'linear-gradient(135deg,#3a1a5c,#6a3a9c)',
  nature:  'linear-gradient(135deg,#1a4a2a,#3a8a4a)',
};

// ── Open card from list ────────────────────────────────────────
function openDetail(id){
  CARD_MODE = 'detail';

  // Build nav list from whatever is currently visible in the list
  const rows = Array.from(document.querySelectorAll('.place-row'));
  CARD_LIST = rows.map(r => {
    const rid = parseInt(r.id.replace('row-',''));
    return PLACES.find(x => x.id === rid);
  }).filter(Boolean);
  if(!CARD_LIST.length) CARD_LIST = PLACES.slice();

  CARD_IDX = CARD_LIST.findIndex(x => x.id === id);
  if(CARD_IDX < 0) CARD_IDX = 0;

  const p = PLACES.find(x => x.id === id);
  if(!p) return;

  _activateMarker(p);

  // Show both ‹ List AND ‹ › arrows
  document.getElementById('pc-btn-back').style.display = 'flex';
  document.getElementById('pc-nav-prev').style.display = 'flex';
  document.getElementById('pc-nav-next').style.display = 'flex';
  document.getElementById('pc-counter').style.display  = 'block';

  _refreshNav();
  _populateCard(p);
  _openCard();

  if(window.innerWidth < 768){
    document.getElementById('sheet').classList.remove('open');
  }

  document.querySelectorAll('.place-row').forEach(r => r.classList.remove('active'));
  const row = document.getElementById('row-' + id);
  if(row){ row.classList.add('active'); row.scrollIntoView({block:'nearest'}); }
}

// ── Open card from neighbourhood bubble ───────────────────────
function openNbhdCard(nbhd){
  CARD_MODE = 'nbhd';
  CARD_LIST = PLACES.filter(p => p.nbhd === nbhd);
  if(!CARD_LIST.length){ alert('No places for this neighbourhood yet!'); return; }
  CARD_IDX = 0;

  const NBHD_BOUNDS = {
    'old-town':   {lat:41.6895,lng:44.8100,zoom:16},
    'sololaki':   {lat:41.6920,lng:44.8040,zoom:16},
    'avlabari':   {lat:41.6920,lng:44.8190,zoom:16},
    'vera':       {lat:41.6990,lng:44.7960,zoom:15},
    'chugureti':  {lat:41.6890,lng:44.7990,zoom:15},
    'mtatsminda': {lat:41.6940,lng:44.7960,zoom:15},
    'vake':       {lat:41.7040,lng:44.7720,zoom:14},
  };

  // ── Step 1: dim all non-neighbourhood markers instantly ──
  PLACES.forEach(p => {
    if(!markers[p.id]) return;
    if(p.nbhd === nbhd){
      markers[p.id].setVisible(true);
      markers[p.id].setZIndex(20);
      markers[p.id].setOpacity ? markers[p.id].setOpacity(1) : null;
    } else {
      markers[p.id].setOpacity ? markers[p.id].setOpacity(0.15) : markers[p.id].setVisible(false);
      markers[p.id].setZIndex(1);
    }
  });

  // ── Step 2: pan + zoom smoothly to neighbourhood centre ──
  const b = NBHD_BOUNDS[nbhd];
  if(b && map){
    map.panTo({lat:b.lat, lng:b.lng});
    setTimeout(() => map.setZoom(b.zoom), 300);
  }

  // ── Step 3: draw neighbourhood circle with pulsing entrance ──
  setTimeout(() => {
    if(typeof showNbhdCircleAnimated === 'function'){
      showNbhdCircleAnimated(nbhd);
    } else if(typeof showNbhdCircle === 'function'){
      showNbhdCircle(nbhd);
    }
  }, 1000);

  // ── Step 4: after animation settles, open the card ──
  setTimeout(() => {
    document.getElementById('pc-btn-back').style.display = 'none';
    document.getElementById('pc-nav-prev').style.display = 'flex';
    document.getElementById('pc-nav-next').style.display = 'flex';
    document.getElementById('pc-counter').style.display  = 'block';
    _showSlide(0);
    _openCard();
  }, 2200);
}

// Restore all markers when neighbourhood card is closed
function _nbhdRestoreMarkers(){
  PLACES.forEach(p => {
    if(!markers[p.id]) return;
    markers[p.id].setOpacity ? markers[p.id].setOpacity(1) : markers[p.id].setVisible(true);
    markers[p.id].setZIndex(10);
  });
}

function _showSlide(idx){
  CARD_IDX = idx;
  const p = CARD_LIST[idx];
  if(!p){ closePlaceCard(); return; }
  if(map) map.panTo({lat:p.lat, lng:p.lng});
  _activateMarker(p);
  _refreshNav();
  _populateCard(p);

  // Highlight list row
  document.querySelectorAll('.place-row').forEach(r => r.classList.remove('active'));
  const row = document.getElementById('row-' + p.id);
  if(row){ row.classList.add('active'); row.scrollIntoView({block:'nearest'}); }
}

function _refreshNav(){
  const prev = document.getElementById('pc-nav-prev');
  const next = document.getElementById('pc-nav-next');
  const counter = document.getElementById('pc-counter');
  prev.disabled = (CARD_IDX === 0);
  next.disabled = (CARD_IDX === CARD_LIST.length - 1);
  counter.textContent = (CARD_IDX + 1) + ' / ' + CARD_LIST.length;
}

function cardPrev(){ if(CARD_IDX > 0) _showSlide(CARD_IDX - 1); }
function cardNext(){ if(CARD_IDX < CARD_LIST.length - 1) _showSlide(CARD_IDX + 1); }

function _activateMarker(p){
  if(AID && markers[AID]){
    const prev = PLACES.find(x => x.id === AID);
    if(prev){ markers[AID].setIcon(makeIcon(prev,false)); markers[AID].setZIndex(1); }
  }
  AID = p.id;
  if(markers[p.id]){ markers[p.id].setIcon(makeIcon(p,true)); markers[p.id].setZIndex(10); }
  if(map) map.panTo({lat:p.lat, lng:p.lng});
}

// ── Populate all fields ───────────────────────────────────────
function _populateCard(p){
  CARD_PLACE = p;

  const wrap = document.getElementById('pc-photo-wrap');
  const placeholder = document.getElementById('pc-emoji');
  const img = document.getElementById('pc-img');
  wrap.style.background = CAT_GRADIENTS[p.cat] || CAT_GRADIENTS.landmark;
  placeholder.textContent = p.emoji;
  placeholder.style.opacity = '1';
  img.classList.remove('loaded');
  img.src = '';
  document.getElementById('pc-credit').textContent = '';

  const captureId = p.id;
  const loadPhoto = (url, attr) => {
    if(CARD_PLACE?.id !== captureId) return;
    img.onload = () => {
      if(CARD_PLACE?.id === captureId){
        img.classList.add('loaded');
        placeholder.style.opacity = '0';
      }
    };
    img.src = url;
    if(attr){
      const tmp = document.createElement('div');
      tmp.innerHTML = attr;
      document.getElementById('pc-credit').textContent = '© ' + (tmp.querySelector('a')?.textContent || 'Google');
    }
  };

  if(photoCache[p.id]?.url){
    loadPhoto(photoCache[p.id].url, photoCache[p.id].attr);
  } else {
    fetchPhoto(p, result => { if(result?.url) loadPhoto(result.url, result.attr); });
  }

  const col = CAT_COLORS[p.cat] || '#888';
  document.getElementById('pc-cat').innerHTML =
    `<span class="pc-cat-dot" style="background:${col}"></span><span style="color:${col}">${CAT_LABELS[p.cat] || p.cat}</span>`;

  document.getElementById('pc-title').textContent = p.name;
  document.getElementById('pc-type').textContent  = p.type || '';
  document.getElementById('pc-hours').innerHTML   = p.hours ? `🕐 ${p.hours}` : '';

  document.getElementById('pc-note').textContent = p.note || '';

  const tipEl = document.getElementById('pc-tip');
  if(p.tip){
    document.getElementById('pc-tip-text').textContent = p.tip;
    tipEl.style.display = '';
  } else {
    tipEl.style.display = 'none';
  }

  let contacts = '';
  if(p.phone)   contacts += `<a class="pc-contact-pill" href="tel:${p.phone.replace(/\s/g,'')}">📞 ${p.phone}</a>`;
  if(p.website) contacts += `<a class="pc-contact-pill" href="${p.website}" target="_blank">🌐 Website</a>`;
  document.getElementById('pc-contacts').innerHTML = contacts;

  _updateFavBtn();

  const body = document.getElementById('pc-body');
  if(body) body.scrollTop = 0;
}

// ── Fav ──────────────────────────────────────────────────────
function _updateFavBtn(){
  const btn = document.getElementById('pc-btn-fav');
  if(!btn || !CARD_PLACE) return;
  const favs = JSON.parse(localStorage.getItem('tbilisi-favs') || '[]');
  const saved = favs.includes(CARD_PLACE.id);
  btn.textContent = saved ? '♥' : '♡';
  btn.classList.toggle('faved', saved);
}
function cardToggleFav(){
  if(!CARD_PLACE) return;
  let favs = JSON.parse(localStorage.getItem('tbilisi-favs') || '[]');
  if(favs.includes(CARD_PLACE.id)){
    favs = favs.filter(id => id !== CARD_PLACE.id);
  } else {
    favs.push(CARD_PLACE.id);
  }
  localStorage.setItem('tbilisi-favs', JSON.stringify(favs));
  _updateFavBtn();
  // Sync the favourites array in ui-favourites.js
  if(typeof refreshFavourites === 'function') refreshFavourites();
  else if(typeof refreshSavedPill === 'function') refreshSavedPill();
  // Refresh list if saved mode is active
  if(typeof savedFilterActive !== 'undefined' && savedFilterActive) applyFilters();
}

// ── Open / close ──────────────────────────────────────────────
function _openCard(){
  // Reset any drag-applied inline position before opening
  if(window.innerWidth >= 768){
    const card = document.getElementById('place-card');
    card.style.left = '';
    card.style.top  = '';
    card.style.transform = '';
  }
  document.getElementById('place-card').classList.add('open');
  document.getElementById('place-card-dim').classList.add('open');
}

function closePlaceCard(reopenList){
  document.getElementById('place-card').classList.remove('open');
  document.getElementById('place-card-dim').classList.remove('open');

  if(AID && markers[AID]){
    const prev = PLACES.find(x => x.id === AID);
    if(prev){ markers[AID].setIcon(makeIcon(prev,false)); markers[AID].setZIndex(1); }
  }
  AID = null;
  CARD_PLACE = null;
  CARD_LIST  = [];

  // Clear neighbourhood circle
  if(typeof clearNbhdCircle === 'function') clearNbhdCircle();
  if(typeof _nbhdRestoreMarkers === 'function') _nbhdRestoreMarkers();
  // If we were in nbhd mode, restore full list
  if(CARD_MODE === 'nbhd' && typeof renderList === 'function') renderList();

  document.querySelectorAll('.place-row').forEach(r => r.classList.remove('active'));

  // Reopen list on mobile only when coming from list mode (not neighbourhood browse)
  if(reopenList && window.innerWidth < 768 && CARD_MODE !== 'nbhd') openSheet();
}

function cardBack(){
  closePlaceCard(true); // user action — reopen list on mobile
}

// ── Keyboard nav ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const card = document.getElementById('place-card');
  if(!card.classList.contains('open')) return;
  if(e.key === 'Escape')     closePlaceCard();
  if(e.key === 'ArrowRight') cardNext();
  if(e.key === 'ArrowLeft')  cardPrev();
});

// ── Swipe down to close (mobile) ─────────────────────────────
(function(){
  let startY = 0;
  const el = document.getElementById('place-card');
  if(!el) return;
  el.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive:true});
  el.addEventListener('touchend', e => {
    if(e.changedTouches[0].clientY - startY > 70) closePlaceCard();
  }, {passive:true});
})();

// ── Draggable card on desktop ─────────────────────────────────
(function initCardDrag(){
  const card   = document.getElementById('place-card');
  const handle = document.getElementById('pc-photo-wrap');
  if(!card || !handle) return;

  let dragging = false, startMouseX = 0, startMouseY = 0, startCardX = 0, startCardY = 0;

  function startDrag(e){
    if(window.innerWidth < 768) return;
    // Freeze card at its current rendered position (resolve CSS calc + transform)
    const rect = card.getBoundingClientRect();
    card.style.left      = rect.left + 'px';
    card.style.top       = rect.top  + 'px';
    card.style.right     = 'auto';
    card.style.bottom    = 'auto';
    card.style.transform = 'none';
    card.style.transition = 'none';
    startCardX  = rect.left;
    startCardY  = rect.top;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    dragging = true;
    card.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }
  function doDrag(e){
    if(!dragging) return;
    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;
    let nx = startCardX + dx;
    let ny = startCardY + dy;
    nx = Math.max(0, Math.min(window.innerWidth  - card.offsetWidth,  nx));
    ny = Math.max(0, Math.min(window.innerHeight - card.offsetHeight, ny));
    card.style.left = nx + 'px';
    card.style.top  = ny + 'px';
  }
  function endDrag(){
    if(!dragging) return;
    dragging = false;
    card.style.cursor = '';
    document.body.style.userSelect = '';
  }

  handle.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', doDrag);
  document.addEventListener('mouseup',   endDrag);
})();

// (card position reset happens in closePlaceCard)
