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
