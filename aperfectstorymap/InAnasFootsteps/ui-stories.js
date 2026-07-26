// ── Neighbourhood filter (works with type filter as intersection) ──
function selectNbhd(nbhd, el){
  // Toggle off if already active
  if(ANF === nbhd && nbhd !== 'all'){ nbhd = 'all'; }
  ANF = nbhd;

  // Update bubble active states
  document.querySelectorAll('.nbhd-bubble').forEach(b => b.classList.remove('nbhd-active'));
  if(nbhd === 'all'){
    const allBtn = document.getElementById('nbhd-all');
    if(allBtn) allBtn.classList.add('nbhd-active');
  } else {
    if(el) el.classList.add('nbhd-active');
  }

  // Show/clear neighbourhood circle on map
  if(nbhd === 'all'){
    if(typeof clearNbhdCircle === 'function') clearNbhdCircle();
  } else {
    if(typeof showNbhdCircleAnimated === 'function') showNbhdCircleAnimated(nbhd);
    else if(typeof showNbhdCircle === 'function') showNbhdCircle(nbhd);
  }

  // Apply filters + update list
  applyFilters();
  if(typeof renderList === 'function') renderList();

  // Pan map to neighbourhood center
  if(nbhd !== 'all' && map){
    // Use actual circle data to fit bounds perfectly
    var circle = (typeof NBHD_CIRCLES !== 'undefined' && NBHD_CIRCLES.length)
      ? NBHD_CIRCLES.find(function(x){ return x.id === nbhd; }) : null;
    // Fallback to approx center if circles not built yet
    if(!circle && typeof NBHD_APPROX_CENTERS !== 'undefined' && NBHD_APPROX_CENTERS[nbhd]){
      var c = NBHD_APPROX_CENTERS[nbhd];
      circle = { lat: c.lat, lng: c.lng, radius: 800 };
    }
    if(circle){
      // Calculate bounds from circle radius with padding for UI panels
      var R = 6371000;
      var dLat = (circle.radius * 1.4 / R) * (180 / Math.PI);
      var dLng = dLat / Math.cos(circle.lat * Math.PI / 180);
      var isMobile = window.innerWidth < 768;
      map.fitBounds(
        [[circle.lng - dLng, circle.lat - dLat], [circle.lng + dLng, circle.lat + dLat]],
        { padding: { top: 80, bottom: isMobile ? 180 : 80, left: isMobile ? 20 : 340, right: 20 },
          duration: 800 }
      );
    }
  }

  // When selecting All — fit all visible places
  if(nbhd === 'all' && map){
    const vis = PLACES.filter(p => AF === 'all' || p.cat === AF);
    if(vis.length){
      const lngs = vis.map(p=>p.lng), lats = vis.map(p=>p.lat);
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding:{ top:120, bottom:100, left: window.innerWidth>=768?320:20, right:20 }, duration:700 }
      );
    }
  }

  // Open list panel on desktop
  if(window.innerWidth >= 768){
    if(typeof openSheet === 'function') openSheet();
  }
}

// Keep openStories as alias for backwards compat
function openStories(nbhd){ selectNbhd(nbhd, document.getElementById('nbhd-' + nbhd)); }

// NBHD_META defined in guide-specific map.js
const CL_STORIES = {
  landmark:'Landmark', food:'Restaurant', cafe:'Café & Bar',
  church:'Church', market:'Market', soviet:'Soviet Heritage', pub:'Pub & Bar', nature:'Nature'
};

// Neighbourhood map bounds for zoom-to
// NBHD_BOUNDS removed — zoom computed from circle radius

let storyPlaces = [], storyIdx = 0;

// openStories removed — selectNbhd handles neighbourhood selection

// Keep these stubs so old HTML references don't break
function buildProgressBars(){}
let storyTimer = null, storyFillTimer = null;
const STORY_DURATION = 6000;










// storiesOpenDetail removed — cards now show full details inline



// Keyboard nav
document.addEventListener('keydown', e => {
  const nc = document.getElementById('nbhd-cards');
  if(!nc) return;
  if(!nc.classList.contains('open')) return;
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
  // Hide the browse button (panel covers it)
  const btn = document.getElementById('list-toggle');
  if(btn) btn.classList.add('hidden');
}
function closeSheet(){
  const s = document.getElementById('sheet');
  s.classList.remove('open');
  s.classList.add('desktop-hidden');
  // Show the browse button again
  const btn = document.getElementById('list-toggle');
  if(btn) btn.classList.remove('hidden');
}
function toggleSheet(){
  const s = document.getElementById('sheet');
  const isOpen = s.classList.contains('open');
  if(isOpen){ closeSheet(); } else { openSheet(); }
}

// ── Align nbhd bar indent (no-op on desktop now — bubbles start left) ──
function alignNbhdBar(){
  return; // nbhd bar now starts from left edge on desktop
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
  const ttl = document.getElementById('nbhd-title');
  const btn = document.getElementById('nbhd-show-btn');
  if(bar) bar.classList.add('hidden');
  if(ttl) ttl.classList.add('hidden');
  if(btn) btn.classList.add('visible');
}
function openNbhdBar(){
  const bar = document.getElementById('nbhd-bar');
  const ttl = document.getElementById('nbhd-title');
  const btn = document.getElementById('nbhd-show-btn');
  if(bar) bar.classList.remove('hidden');
  if(ttl) ttl.classList.remove('hidden');
  if(btn) btn.classList.remove('visible');
}

// ── Mobile: swipe-down to dismiss nbhd bar ────────────────────
(function initNbhdSwipe(){
  const bar = document.getElementById('nbhd-bar');
  if(!bar) return;
  let startY = 0, dragging = false;

  bar.addEventListener('touchstart', e => {
    if(window.innerWidth >= 768) return;
    // Only drag from handle area or top of bar — not from bubbles
    const handle = document.getElementById('nbhd-handle');
    if(!handle) return;
    const rect = handle.getBoundingClientRect();
    const touch = e.touches[0];
    // Allow drag if touching anywhere on bar (within top 20px = handle zone)
    const barRect = bar.getBoundingClientRect();
    if(touch.clientY > barRect.top + 28) return; // only from top strip
    startY = touch.clientY;
    dragging = true;
    bar.style.transition = 'none';
  }, { passive: true });

  bar.addEventListener('touchmove', e => {
    if(!dragging) return;
    const dy = e.touches[0].clientY - startY;
    if(dy > 0) bar.style.transform = `translateY(${dy}px)`;
  }, { passive: true });

  bar.addEventListener('touchend', e => {
    if(!dragging) return;
    dragging = false;
    bar.style.transition = '';
    const dy = e.changedTouches[0].clientY - startY;
    if(dy > 60) {
      // Swiped down enough — dismiss
      bar.style.transform = '';
      closeNbhdBar();
    } else {
      // Snap back
      bar.style.transform = '';
    }
  });
})();


// ── iPhone Safari touch fix ──────────────────────────────────
window.addEventListener('load', function() {
  document.querySelectorAll('.nbhd-bubble').forEach(function(bubble) {
    var startY = 0;
    bubble.addEventListener('touchstart', function(e) {
      startY = e.touches[0].clientY;
    }, {passive:true});
    bubble.addEventListener('touchend', function(e) {
      var dy = Math.abs(e.changedTouches[0].clientY - startY);
      if(dy > 10) return;
      e.preventDefault();
      // Read the key from the onclick attribute so Seoul's 'nbhd-X' prefix
      // is preserved while unprefixed cities (London, Nashville, etc.) still work.
      var onclickVal = bubble.getAttribute('onclick') || '';
      var match = onclickVal.match(/selectNbhd\(\s*'([^']+)'/);
      var nbhd = match ? match[1] : bubble.id.replace('nbhd-','');
      selectNbhd(nbhd, bubble);
    }, {passive:false});
  });
});
