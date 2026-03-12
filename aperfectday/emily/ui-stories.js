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

let storyPlaces = [], storyIdx = 0, storyTimer = null, storyFillTimer = null;
const STORY_DURATION = 6000; // ms per slide

function openStories(nbhd){
  storyPlaces = PLACES.filter(p => p.nbhd === nbhd);
  if(!storyPlaces.length){ alert('No places tagged for this neighbourhood yet!'); return; }
  storyIdx = 0;
  document.getElementById('stories-overlay').classList.add('open');
  const meta = NBHD_META[nbhd] || { label: nbhd, icon: '📍' };
  document.getElementById('stories-nbhd-name').textContent = meta.label;
  document.getElementById('stories-icon').textContent = meta.icon;
  buildProgressBars();
  showStorySlide(0);
}

function buildProgressBars(){
  const bar = document.getElementById('stories-progress');
  bar.innerHTML = storyPlaces.map((_,i) =>
    `<div class="stories-seg"><div class="stories-seg-fill" id="sfill-${i}"></div></div>`
  ).join('');
}

function showStorySlide(idx){
  clearTimeout(storyTimer);
  cancelAnimationFrame(storyFillTimer);
  storyIdx = idx;
  const p = storyPlaces[idx];
  if(!p) { closeStories(); return; }

  // Update progress bars
  storyPlaces.forEach((_,i) => {
    const fill = document.getElementById('sfill-'+i);
    if(!fill) return;
    fill.style.transition = 'none';
    if(i < idx)       { fill.style.width = '100%'; }
    else if(i === idx){ fill.style.width = '0%'; }
    else              { fill.style.width = '0%'; }
  });

  // Animate current bar
  const activeFill = document.getElementById('sfill-'+idx);
  if(activeFill){
    requestAnimationFrame(() => {
      activeFill.style.transition = `width ${STORY_DURATION}ms linear`;
      activeFill.style.width = '100%';
    });
  }

  // Background — color layer shows instantly, photo fades in on top
  const bgColor = document.getElementById('stories-bg-color');
  const bg = document.getElementById('stories-bg');
  const colors = {
    landmark:'135deg,#1a3a5c 0%,#2a5298 100%',
    food:'135deg,#7a3020 0%,#c06040 100%',
    cafe:'135deg,#1a3a2a 0%,#2a7a4a 100%',
    church:'135deg,#1a1a5c 0%,#3a3a9c 100%',
    market:'135deg,#5c3a1a 0%,#9c6a3a 100%',
    soviet:'135deg,#3a1a5c 0%,#6a3a9c 100%',
    nature:'135deg,#1a4a2a 0%,#3a8a4a 100%',
  };
  // Always show gradient immediately
  bgColor.style.background = `linear-gradient(${colors[p.cat]||'135deg,#1a3a5c,#2a5298'})`;
  bg.classList.remove('loaded');
  bg.style.backgroundImage = '';
  const loadImg = (url) => {
    const img = new Image();
    img.onload = () => {
      if(storyIdx === idx){
        bg.style.backgroundImage = `url(${url})`;
        bg.classList.add('loaded');
      }
    };
    img.src = url;
  };
  if(photoCache[p.id] && photoCache[p.id].url){
    loadImg(photoCache[p.id].url);
  } else {
    fetchPhoto(p, result => {
      if(result && storyIdx === idx) loadImg(result.url);
    });
  }

  // Content
  document.getElementById('stories-badge').innerHTML =
    `<span>${p.emoji}</span> ${CL_STORIES[p.cat]||p.cat}`;
  document.getElementById('stories-name').textContent = p.name;
  document.getElementById('stories-note').textContent = p.note || '';
  document.getElementById('stories-tip').textContent = p.tip ? '💡 ' + p.tip : '';
  document.getElementById('stories-count').textContent = `${idx+1} / ${storyPlaces.length}`;

  // Auto-advance
  storyTimer = setTimeout(() => storiesNext(), STORY_DURATION);
}

function storiesNext(){
  if(storyIdx < storyPlaces.length - 1){
    showStorySlide(storyIdx + 1);
  } else {
    closeStories();
  }
}
function storiesPrev(){
  if(storyIdx > 0) showStorySlide(storyIdx - 1);
}
function closeStories(){
  clearTimeout(storyTimer);
  document.getElementById('stories-overlay').classList.remove('open');
}
function storiesOpenDetail(){
  const p = storyPlaces[storyIdx];
  if(!p) return;
  closeStories();
  openDetail(p.id);
  // On mobile, open the detail sheet
  setTimeout(()=>{
    if(window.innerWidth < 768){
      document.getElementById('detail-sheet').classList.add('open');
      document.getElementById('sheet').classList.remove('open');
    }
  }, 100);
}
function storiesMaps(){
  const p = storyPlaces[storyIdx];
  if(p) window.open(`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`,'_blank');
}

// Swipe down to close stories
(function(){
  let startY = 0;
  const el = document.getElementById('stories-overlay');
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
