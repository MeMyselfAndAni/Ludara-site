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

function openStories(nbhd){ openNbhdCard(nbhd); }

// Keep these stubs so old HTML references don't break
function buildProgressBars(){}
let storyTimer = null, storyFillTimer = null;
const STORY_DURATION = 6000;










// storiesOpenDetail removed — cards now show full details inline



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
      btn.style.cssText = 'position:fixed;top:14px;left:16px;z-index:600;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:8px;padding:7px 11px;font-size:1rem;cursor:pointer;color:white;';
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

// ── Align nbhd bar indent under Wander-Lush logo ─────────────
function alignNbhdBar(){
  if(window.innerWidth < 768) return;
  const logo = document.querySelector('.header-title .wl-logo');
  const bar  = document.getElementById('nbhd-bar');
  if(!logo || !bar) return;
  // Right edge of logo relative to the map (map starts at 300px)
  const logoRight = logo.getBoundingClientRect().right;
  const mapLeft   = 300; // sidebar width px
  // indent = how far into the map the first bubble should start
  // = right edge of logo - map left edge + small gap
  const indent    = Math.max(20, logoRight - mapLeft + 6);
  // Handle area is ~22px; subtract so bubble aligns under logo right edge
  const handleW   = 22;
  const paddingLeft = Math.max(10, indent - handleW);
  bar.style.setProperty('--nbhd-indent', paddingLeft + 'px');
  // Also set directly on the row as fallback
  const row = document.getElementById('nbhd-bubbles-row');
  if(row) row.style.paddingLeft = paddingLeft + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
  // Run multiple times to catch font loading
  setTimeout(alignNbhdBar, 100);
  setTimeout(alignNbhdBar, 600);
  setTimeout(alignNbhdBar, 1500);
  if(document.fonts?.ready) document.fonts.ready.then(alignNbhdBar);
  window.addEventListener('resize', alignNbhdBar);
});

// ── Nbhd bar show/hide ────────────────────────────────────────
function closeNbhdBar(){
  const bar = document.getElementById('nbhd-bar');
  const btn = document.getElementById('nbhd-show-btn');
  if(bar) bar.classList.add('hidden');
  if(btn) btn.classList.add('visible');
}
function openNbhdBar(){
  const bar = document.getElementById('nbhd-bar');
  const btn = document.getElementById('nbhd-show-btn');
  if(bar) bar.classList.remove('hidden');
  if(btn) btn.classList.remove('visible');
}
