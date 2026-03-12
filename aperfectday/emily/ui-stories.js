const NBHD_META = {
  'old-town':   { label: 'Old Town & Kala',    icon: '🏰' },
  'sololaki':   { label: 'Sololaki',            icon: '🌿' },
  'avlabari':   { label: 'Avlabari',            icon: '⛪' },
  'vera':       { label: 'Vera & Stamba',       icon: '☕' },
  'chugureti':  { label: 'Chugureti & Fabrika', icon: '🏭' },
  'mtatsminda': { label: 'Mtatsminda',          icon: '🎭' },
  'vake':       { label: 'Vake',                icon: '🌲' },
};
const CL_STORIES = {
  landmark:'Landmark', food:'Restaurant', cafe:'Café & Bar',
  church:'Church', market:'Market', soviet:'Soviet Heritage', nature:'Nature'
};

// Neighbourhood map bounds for zoom-to
const NBHD_BOUNDS = {
  'old-town':   { lat:41.6895, lng:44.8100, zoom:16 },
  'sololaki':   { lat:41.6920, lng:44.8040, zoom:16 },
  'avlabari':   { lat:41.6920, lng:44.8190, zoom:16 },
  'vera':       { lat:41.6990, lng:44.7960, zoom:15 },
  'chugureti':  { lat:41.6890, lng:44.7990, zoom:15 },
  'mtatsminda': { lat:41.6940, lng:44.7960, zoom:15 },
  'vake':       { lat:41.7040, lng:44.7720, zoom:14 },
};

let storyPlaces = [], storyIdx = 0;

function openStories(nbhd){
  storyPlaces = PLACES.filter(p => p.nbhd === nbhd);
  if(!storyPlaces.length){ alert('No places for this neighbourhood yet!'); return; }
  storyIdx = 0;

  // Zoom map to neighbourhood
  const b = NBHD_BOUNDS[nbhd];
  if(b && map) { map.setCenter({lat:b.lat, lng:b.lng}); map.setZoom(b.zoom); }

  const meta = NBHD_META[nbhd] || { label: nbhd, icon: '📍' };
  document.getElementById('nbhd-card-icon').textContent = meta.icon;
  document.getElementById('nbhd-card-label').textContent = meta.label;

  document.getElementById('nbhd-cards').classList.add('open');
  document.getElementById('nbhd-dim').classList.add('open');

  showStorySlide(0);
}

// Keep these stubs so old HTML references don't break
function buildProgressBars(){}
let storyTimer = null, storyFillTimer = null;
const STORY_DURATION = 6000;

function showStorySlide(idx){
  storyIdx = idx;
  const p = storyPlaces[idx];
  if(!p){ closeStories(); return; }

  // Pan map to this place
  if(map) map.panTo({lat: p.lat, lng: p.lng});

  // Badge, name, note
  document.getElementById('card-badge').textContent = p.emoji + '  ' + (CL_STORIES[p.cat] || p.cat);
  document.getElementById('card-name').textContent = p.name;
  document.getElementById('card-note').textContent = p.note || '';
  document.getElementById('card-counter').textContent = (idx + 1) + ' / ' + storyPlaces.length;
  document.getElementById('card-prev').disabled = (idx === 0);
  document.getElementById('card-next').disabled = (idx === storyPlaces.length - 1);

  // Photo: gradient placeholder first, then fade photo in
  const placeholder = document.getElementById('card-placeholder');
  const img = document.getElementById('card-img');
  const gradients = {
    landmark:'linear-gradient(135deg,#1a3a5c,#2a5298)',
    food:    'linear-gradient(135deg,#7a3020,#c06040)',
    cafe:    'linear-gradient(135deg,#1a3a2a,#2a7a4a)',
    church:  'linear-gradient(135deg,#1a1a5c,#3a3a9c)',
    market:  'linear-gradient(135deg,#5c3a1a,#9c6a3a)',
    soviet:  'linear-gradient(135deg,#3a1a5c,#6a3a9c)',
    nature:  'linear-gradient(135deg,#1a4a2a,#3a8a4a)',
  };
  placeholder.style.background = gradients[p.cat] || gradients.landmark;
  placeholder.style.opacity = '1';
  placeholder.textContent = p.emoji;
  img.classList.remove('loaded');
  img.src = '';

  const captureIdx = idx;
  const loadPhoto = (url) => {
    if(storyIdx !== captureIdx) return;
    img.onload = () => {
      if(storyIdx === captureIdx){
        img.classList.add('loaded');
        placeholder.style.opacity = '0';
      }
    };
    img.src = url;
  };

  if(photoCache[p.id] && photoCache[p.id].url){
    loadPhoto(photoCache[p.id].url);
  } else {
    fetchPhoto(p, result => {
      if(result && result.url) loadPhoto(result.url);
    });
  }
}

function storiesNext(){
  if(storyIdx < storyPlaces.length - 1) showStorySlide(storyIdx + 1);
}
function storiesPrev(){
  if(storyIdx > 0) showStorySlide(storyIdx - 1);
}
function closeStories(){
  document.getElementById('nbhd-cards').classList.remove('open');
  document.getElementById('nbhd-dim').classList.remove('open');
  storyPlaces = []; storyIdx = 0;
}
function storiesOpenDetail(){
  const p = storyPlaces[storyIdx];
  if(!p) return;
  closeStories();
  openDetail(p.id);
  if(window.innerWidth < 768){
    setTimeout(()=>{
      document.getElementById('detail-sheet').classList.add('open');
      document.getElementById('sheet').classList.remove('open');
    }, 100);
  }
}
function storiesMaps(){
  const p = storyPlaces[storyIdx];
  if(p) window.open(`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`,'_blank');
}

// Keyboard nav
document.addEventListener('keydown', e => {
  if(!document.getElementById('nbhd-cards').classList.contains('open')) return;
  if(e.key === 'ArrowRight') storiesNext();
  if(e.key === 'ArrowLeft')  storiesPrev();
  if(e.key === 'Escape')     closeStories();
});

// Swipe down on card to close
(function(){
  let startY = 0;
  const el = document.getElementById('nbhd-cards');
  if(!el) return;
  el.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive:true});
  el.addEventListener('touchend', e => {
    if(e.changedTouches[0].clientY - startY > 60) closeStories();
  }, {passive:true});
})();

// ── SHEET TOGGLE (mobile) ─────────────────────────────────────
function openSheet(){
  const s = document.getElementById('sheet');
  s.classList.add('open');
  s.classList.remove('desktop-hidden');
  document.getElementById('detail-sheet').classList.remove('open');
  if(window.innerWidth >= 768){
    document.getElementById('map').style.left = '';
    document.querySelector('.filter-bar').style.left = '';
    const nb = document.getElementById('nbhd-bar');
    if(nb){ nb.style.left=''; nb.style.width=''; nb.style.right=''; }
    const btn = document.getElementById('sidebar-reopen');
    if(btn) btn.style.display = 'none';
  }
}
function closeSheet(){
  const s = document.getElementById('sheet');
  if(window.innerWidth >= 768){
    s.classList.add('desktop-hidden');
    document.getElementById('map').style.left = '0';
    document.querySelector('.filter-bar').style.left = '0';
    const nb = document.getElementById('nbhd-bar');
    if(nb){ nb.style.left='0'; nb.style.width='100%'; nb.style.right='0'; }
    // Show a reopen button
    let btn = document.getElementById('sidebar-reopen');
    if(!btn){
      btn = document.createElement('button');
      btn.id = 'sidebar-reopen';
      btn.innerHTML = '☰';
      btn.style.cssText = 'position:absolute;top:16px;left:16px;z-index:600;background:white;border:1px solid #ddd;border-radius:8px;padding:8px 12px;font-size:1rem;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.15);';
      btn.onclick = openSheet;
      document.body.appendChild(btn);
    }
    btn.style.display = 'block';
  } else {
    s.classList.remove('open');
  }
}
function toggleSheet(){
  const s=document.getElementById('sheet');
  const isHidden = s.classList.contains('desktop-hidden');
  const isOpen = s.classList.contains('open');
  if(window.innerWidth >= 768){
    if(isHidden){ openSheet(); } else { closeSheet(); }
  } else {
    if(isOpen){ closeSheet(); } else { openSheet(); }
  }
}
