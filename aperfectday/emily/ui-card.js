// ── UNIFIED PLACE CARD CONTROLLER ────────────────────────────
// Both list details (openDetail) and neighbourhood browsing
// use this single component.

let CARD_PLACE   = null;   // currently displayed place
let CARD_LIST    = [];     // array when browsing neighbourhood
let CARD_IDX     = 0;      // current index in CARD_LIST
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
  CARD_LIST = [];
  const p = PLACES.find(x => x.id === id);
  if(!p) return;

  // Update active marker
  if(AID && markers[AID]){
    const prev = PLACES.find(x => x.id === AID);
    if(prev){ markers[AID].setIcon(makeIcon(prev,false)); markers[AID].setZIndex(1); }
  }
  AID = id;
  if(markers[id]){ markers[id].setIcon(makeIcon(p,true)); markers[id].setZIndex(10); }
  if(map) map.panTo({lat:p.lat, lng:p.lng});

  // Show ‹ List, hide prev/next
  document.getElementById('pc-btn-back').style.display = 'flex';
  document.getElementById('pc-nav-prev').style.display = 'none';
  document.getElementById('pc-nav-next').style.display = 'none';
  document.getElementById('pc-counter').style.display  = 'none';

  _populateCard(p);
  _openCard();

  // Hide list on mobile
  if(window.innerWidth < 768){
    document.getElementById('sheet').classList.remove('open');
  }
  // Desktop backdrop
  _showDim();

  // Highlight list row
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

  // Zoom map to neighbourhood
  const NBHD_BOUNDS = {
    'old-town':   {lat:41.6895,lng:44.8100,zoom:16},
    'sololaki':   {lat:41.6920,lng:44.8040,zoom:16},
    'avlabari':   {lat:41.6920,lng:44.8190,zoom:16},
    'vera':       {lat:41.6990,lng:44.7960,zoom:15},
    'chugureti':  {lat:41.6890,lng:44.7990,zoom:15},
    'mtatsminda': {lat:41.6940,lng:44.7960,zoom:15},
    'vake':       {lat:41.7040,lng:44.7720,zoom:14},
  };
  const b = NBHD_BOUNDS[nbhd];
  if(b && map){ map.setCenter({lat:b.lat,lng:b.lng}); map.setZoom(b.zoom); }

  // Hide ‹ List, show prev/next
  document.getElementById('pc-btn-back').style.display = 'none';
  document.getElementById('pc-nav-prev').style.display = 'flex';
  document.getElementById('pc-nav-next').style.display = 'flex';
  document.getElementById('pc-counter').style.display  = 'block';

  _showSlide(0);
  _openCard();
  _showDim();
}

function _showSlide(idx){
  CARD_IDX = idx;
  const p = CARD_LIST[idx];
  if(!p){ closePlaceCard(); return; }
  if(map) map.panTo({lat:p.lat, lng:p.lng});

  document.getElementById('pc-nav-prev').disabled = (idx === 0);
  document.getElementById('pc-nav-next').disabled = (idx === CARD_LIST.length - 1);
  document.getElementById('pc-counter').textContent = (idx + 1) + ' / ' + CARD_LIST.length;

  _populateCard(p);
}

function cardPrev(){ if(CARD_IDX > 0) _showSlide(CARD_IDX - 1); }
function cardNext(){ if(CARD_IDX < CARD_LIST.length - 1) _showSlide(CARD_IDX + 1); }

// ── Populate all fields ───────────────────────────────────────
function _populateCard(p){
  CARD_PLACE = p;

  // Photo
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

  // Category badge
  const col = CAT_COLORS[p.cat] || '#888';
  document.getElementById('pc-cat').innerHTML =
    `<span class="pc-cat-dot" style="background:${col}"></span><span style="color:${col}">${CAT_LABELS[p.cat] || p.cat}</span>`;

  // Title, type, hours
  document.getElementById('pc-title').textContent = p.name;
  document.getElementById('pc-type').textContent  = p.type || '';
  const hoursEl = document.getElementById('pc-hours');
  hoursEl.innerHTML = p.hours ? `🕐 ${p.hours}` : '';

  // Note
  document.getElementById('pc-note').textContent = p.note || '';

  // Tip
  const tipEl = document.getElementById('pc-tip');
  if(p.tip){
    document.getElementById('pc-tip-text').textContent = p.tip;
    tipEl.style.display = '';
  } else {
    tipEl.style.display = 'none';
  }

  // Contacts
  let contacts = '';
  if(p.phone)   contacts += `<a class="pc-contact-pill" href="tel:${p.phone.replace(/\s/g,'')}">📞 ${p.phone}</a>`;
  if(p.website) contacts += `<a class="pc-contact-pill" href="${p.website}" target="_blank">🌐 Website</a>`;
  document.getElementById('pc-contacts').innerHTML = contacts;

  // Fav state
  _updateFavBtn();

  // Scroll body to top
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
  if(typeof refreshSavedPill === 'function') refreshSavedPill();
}

// ── Open / close ──────────────────────────────────────────────
function _openCard(){
  document.getElementById('place-card').classList.add('open');
  document.getElementById('place-card-dim').classList.add('open');
}
function _showDim(){
  // Desktop: dim is the #place-card-dim (already added above)
  // Nothing extra needed
}

function closePlaceCard(){
  document.getElementById('place-card').classList.remove('open');
  document.getElementById('place-card-dim').classList.remove('open');

  // Reset active marker
  if(AID && markers[AID]){
    const prev = PLACES.find(x => x.id === AID);
    if(prev){ markers[AID].setIcon(makeIcon(prev,false)); markers[AID].setZIndex(1); }
  }
  AID = null;
  CARD_PLACE = null;
  CARD_LIST  = [];

  document.querySelectorAll('.place-row').forEach(r => r.classList.remove('active'));

  // On mobile, reopen list
  if(window.innerWidth < 768) openSheet();
}

function cardBack(){
  closePlaceCard();
  if(window.innerWidth < 768) openSheet();
}

// Keyboard
document.addEventListener('keydown', e => {
  const card = document.getElementById('place-card');
  if(!card.classList.contains('open')) return;
  if(e.key === 'Escape')     closePlaceCard();
  if(e.key === 'ArrowRight') cardNext();
  if(e.key === 'ArrowLeft')  cardPrev();
});

// Swipe down to close (mobile)
(function(){
  let startY = 0;
  const el = document.getElementById('place-card');
  if(!el) return;
  el.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive:true});
  el.addEventListener('touchend', e => {
    if(e.changedTouches[0].clientY - startY > 70) closePlaceCard();
  }, {passive:true});
})();
