(function () {
  'use strict';

  /* ── City config (set window.TutorialConfig in each hotel's index.html) ── */
  var CFG             = window.TutorialConfig || {};
  var DONE_KEY        = CFG.doneKey       || 'city_tour_v1';
  var CITY            = CFG.cityName      || 'the city';
  var DEMO_PLACE      = CFG.demoPlaceId   || 1;
  var TRIP_NAMES      = CFG.tripNames     || 'a curated day trip';
  var DEMO_SAVED_IDS  = CFG.demoSavedIds  || null; /* array of 3-5 real place IDs */

  /* ── Step definitions ───────────────────────────────────────── */
  var STEPS = [
    {
      title: 'Bath & Bristol on Screen',
      body: 'One map, every filming location across two cities: Bridgerton in Bath and Rivals in Bristol. This short tour shows you the map, the place cards, and how to build your own day out. Tap Next to begin.',
      target: null,
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Preset trips',
      body: 'The pills along the top are ready-made routes: Bridgerton in Bath, a free outdoor walk, and Rivals in Bristol. Tap one and it draws the numbered route on the map and opens the Trip Plan, with the stops, walking times and distance, and buttons for Google Directions, a PDF guide, and Share. Your Favourites open in the very same Trip Plan.',
      target: '#pill-storypath',
      cardPos: 'center',
      demo: 'close-saved-pulse',
      btn: 'Next'
    },
    {
      title: 'The Locations, Mapped',
      body: 'Every pin is a filming location: the promenade of the ton, a grand ball, the dressmaker\'s shop. Tap any icon to see which scene was filmed there.',
      target: null,
      cardPos: 'center',
      demo: 'open-card-delayed-no-heart',
      btn: 'Next'
    },
    {
      title: 'Inside the place card',
      body: 'Tap any pin to open its card: a photo, what the place plays in the show, opening hours and a short "If you visit" note, plus buttons to Navigate in Google Maps, call, or open the website.',
      target: null,
      cardPos: 'center',
      demo: 'scroll-card',
      btn: 'Next'
    },
    {
      title: 'Find any location',
      body: 'Type in the search field to find a location by name. Pin colours mark the theme: Glamour & Society, Grand Houses & Buildings, and Streets & Squares.',
      target: '#topbar-search',
      cardPos: 'center',
      closeCard: true,
      demo: 'scroll-filter',
      btn: 'Next'
    },
    {
      title: 'The areas',
      body: 'Each bubble is an area: Royal Crescent, the Georgian Centre and Great Pulteney in Bath, and Bristol for the Rivals locations. Tap one to jump straight there.',
      target: '#nbhd-bar',
      cardPos: 'center',
      closeCard: true,
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Add to Favourites',
      body: 'Tap the heart on any place to add it to your Favourites. This is how you build your own custom trip: choose the stops you want, in any order.',
      target: null,
      cardPos: 'center',
      demo: 'open-card',
      btn: 'Next'
    },
    {
      title: 'Your favourites, your trip',
      body: 'Tap Favourites to see your list. Drag the stops to arrange them in your own walking order, then follow them as your personal day out.',
      target: null,
      dualTargets: ['#pill-saved', '#sheet'],
      targetsDelay: 550,  /* wait for show-saved demo to open the sheet */
      cardPos: 'center',
      demo: 'show-saved',
      btn: 'Next'
    },
    {
      title: 'Download a PDF companion',
      body: 'Tap PDF to turn your favourites into a printable walking companion, ready for the day.',
      target: '#sheet button[onclick="generatePDF()"]',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Share your day',
      body: 'Send your map of favourites to a friend or a guest. One tap to share by message or email.',
      target: '#sheet button[onclick="shareItinerary()"]',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Find yourself on the map',
      body: 'Tap the target button to show your location as a dot on the map, so you always know where you are among the filming locations.',
      target: '#locate-btn',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Save it for offline',
      body: 'Tap Save offline once, while on WiFi, and the map and your trip stay available even with no signal, perfect for walking the streets of Bath.',
      target: '#offline-save-btn',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: "You're all set!",
      body: 'The filming locations of Bath and Bristol are yours to explore. Enjoy the day out.',
      target: null,
      cardPos: 'center',
      mobileCardOffset: -75,  /* match Navigate step so card doesn't jump */
      demo: null,
      btn: 'Done'
    }
  ];

  /* ── Filter steps that need optional UI elements ───────────── */
  /* Day Trips step — skip if launcher absent or tripNames not configured */
  if (!document.querySelector('#pill-storypath') || !CFG.tripNames) {
    STEPS = STEPS.filter(function (s) { return s.demo !== 'close-saved-pulse'; });
  }
  /* Always mark the final step as Done */
  if (STEPS.length > 0) { STEPS[STEPS.length - 1].btn = 'Done ✓'; }

  /* ── Inject CSS ─────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#tut-overlay{position:fixed;inset:0;z-index:9000;pointer-events:none;transition:opacity 0.4s;}',
    '#tut-spot{position:fixed;box-shadow:0 0 0 9999px rgba(15,10,5,0.70);border-radius:12px;',
    '  transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1),',
    '  width 0.4s cubic-bezier(.4,0,.2,1),height 0.4s cubic-bezier(.4,0,.2,1),opacity 0.3s ease;pointer-events:none;}',
    '#tut-card{position:fixed;background:#f5edd8;border-radius:16px;padding:20px 22px 16px;',
    '  max-width:290px;width:calc(100vw - 52px);box-shadow:0 8px 40px rgba(0,0,0,0.30);',
    '  pointer-events:all;transition:left 0.35s ease,top 0.35s ease,bottom 0.35s ease;z-index:9001;cursor:grab;}',
    '#tut-card.tut-dragging{cursor:grabbing;transition:none;}',
    '#tut-next,#tut-skip{cursor:pointer;}',
    '#tut-dots{display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap;}',
    '.tut-dot{height:5px;border-radius:3px;background:rgba(49,38,29,0.22);transition:all 0.3s;}',
    '.tut-dot.on{background:#31261d;width:18px;}',
    '.tut-dot.off{width:5px;}',
    '#tut-title{font-family:"Playfair Display",serif;font-size:1.05rem;font-weight:700;color:#31261d;margin:0 0 8px;}',
    '#tut-body{font-family:"Inter",sans-serif;font-size:0.80rem;color:#4a5568;line-height:1.65;margin:0 0 16px;}',
    '#tut-actions{display:flex;justify-content:space-between;align-items:center;}',
    '#tut-skip{background:none;border:none;font-size:0.72rem;color:rgba(49,38,29,0.45);cursor:pointer;',
    '  font-family:"Inter",sans-serif;padding:4px 0;}',
    '#tut-next{background:#31261d;color:#f5edd8;border:none;border-radius:20px;padding:9px 22px;',
    '  font-size:0.80rem;font-weight:700;cursor:pointer;font-family:"Inter",sans-serif;transition:background 0.15s;}',
    '#tut-next:hover{background:#251b12;}',
    '@keyframes tut-pulse{',
    '  0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.85;}',
    '  50%{transform:translate(-50%,-50%) scale(1.8);opacity:0.2;}}',
    '.tut-beacon{position:fixed;width:26px;height:26px;border-radius:50%;border:3px solid #802f2d;',
    '  animation:tut-pulse 1.3s ease-in-out infinite;pointer-events:none;z-index:9002;transform:translate(-50%,-50%);}',
    '@keyframes tut-launcher-glow{',
    '  0%,100%{box-shadow:0 0 0 0 rgba(49,38,29,0.5);}',
    '  50%{box-shadow:0 0 0 10px rgba(49,38,29,0);}}',
    '.tut-tap-ripple{position:fixed;width:48px;height:48px;border-radius:50%;',
    '  border:3px solid rgba(128,47,45,0.85);background:rgba(128,47,45,0.22);',
    '  pointer-events:none;z-index:9005;',
    '  animation:tut-tap 1.95s ease-out forwards;}',
    '@keyframes tut-tap{',
    '  0%{transform:translate(-50%,-50%) scale(0.3);opacity:1;}',
    '  100%{transform:translate(-50%,-50%) scale(2.4);opacity:0;}}',
  ].join('');
  document.head.appendChild(style);


  /* ── Build overlay DOM ──────────────────────────────────────── */
  var overlay = document.createElement('div');
  overlay.id = 'tut-overlay';

  var spot = document.createElement('div');
  spot.id = 'tut-spot';

  var dualOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  dualOverlay.id = 'tut-dual-overlay';
  dualOverlay.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;display:none;z-index:9000;';

  var card = document.createElement('div');
  card.id = 'tut-card';
  card.innerHTML = [
    '<div id="tut-dots"></div>',
    '<h3 id="tut-title"></h3>',
    '<p id="tut-body"></p>',
    '<div id="tut-actions">',
    '  <button id="tut-skip">Skip tour</button>',
    '  <button id="tut-next">Next</button>',
    '</div>'
  ].join('');

  overlay.appendChild(spot);
  overlay.appendChild(dualOverlay);
  overlay.appendChild(card);

  /* ── Drag-to-move card ──────────────────────────────────────── */
  card.addEventListener('pointerdown', function (e) {
    if (e.target.tagName === 'BUTTON') return;   /* don't steal button clicks */
    var r = card.getBoundingClientRect();
    _drag.active = true;
    _drag.startX = e.clientX;
    _drag.startY = e.clientY;
    _drag.cardX  = r.left;
    _drag.cardY  = r.top;
    card.classList.add('tut-dragging');
    card.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  card.addEventListener('pointermove', function (e) {
    if (!_drag.active) return;
    var nx = _drag.cardX + (e.clientX - _drag.startX);
    var ny = _drag.cardY + (e.clientY - _drag.startY);
    /* keep card within viewport */
    var vw = window.innerWidth, vh = window.innerHeight;
    nx = Math.max(0, Math.min(nx, vw - card.offsetWidth));
    ny = Math.max(0, Math.min(ny, vh - card.offsetHeight));
    card.style.left = nx + 'px';
    card.style.top  = ny + 'px';
  });
  card.addEventListener('pointerup', function () {
    _drag.active = false;
    card.classList.remove('tut-dragging');
  });


  var titleEl = card.querySelector('#tut-title');
  var bodyEl  = card.querySelector('#tut-body');
  var nextBtn = card.querySelector('#tut-next');
  var skipBtn = card.querySelector('#tut-skip');
  var dotsEl  = card.querySelector('#tut-dots');

  STEPS.forEach(function (_, i) {
    var d = document.createElement('div');
    d.className = 'tut-dot off';
    d.id = 'tut-dot-' + i;
    dotsEl.appendChild(d);
  });

  /* ── State ──────────────────────────────────────────────────── */
  var currentStep   = 0;
  var beacons       = [];
  var launcherAnim  = null;
  var _demoCardOpen  = false;
  var _demoSavedOn   = false;
  var _demoSavedBkp  = null;

  /* ── Drag state ─────────────────────────────────────────────── */
  var _drag = { active: false, startX: 0, startY: 0, cardX: 0, cardY: 0 };

  /* ── Demo helpers ───────────────────────────────────────────── */
  function _favsKey() {
    return 'favs_' + window.location.pathname.replace(/\//g, '_');
  }

  function _showTapRipple(x, y) {
    var r = document.createElement('div');
    r.className = 'tut-tap-ripple';
    r.style.left = x + 'px';
    r.style.top  = y + 'px';
    document.body.appendChild(r);
    setTimeout(function () { r.parentNode && r.parentNode.removeChild(r); }, 2250);
  }

  function _blinkHeart() {
    var hb = document.querySelector('#pc-btn-fav');
    if (!hb) return;
    /* Snap to bright red filled heart */
    hb.style.transition = 'color 0.25s ease, transform 0.25s ease';
    hb.textContent = '🤍';
    hb.style.fontFamily = 'Arial, sans-serif';
    hb.style.color = '#e00040';
    hb.style.transform = 'scale(1.25)';
    /* After 2 s, fade back to white outline heart */
    setTimeout(function () {
      hb.style.color = 'white';
      hb.style.transform = 'scale(1)';
      setTimeout(function () {
        hb.textContent = '🤍';
        hb.style.fontFamily = '';
        hb.style.color = '';
        hb.style.transform = '';
        hb.style.transition = '';
      }, 260);
    }, 2000);
  }

  function openDemoCard() {
    /* Find a visible map marker to tap — prefer one near screen centre */
    var tapX = window.innerWidth * 0.55;
    var tapY = window.innerHeight * 0.42;
    var markers = document.querySelectorAll('.leaflet-marker-icon');
    markers.forEach(function (m) {
      var r = m.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cy > 80 && cy < window.innerHeight * 0.65 &&
          cx > 60 && cx < window.innerWidth - 60) {
        tapX = cx; tapY = cy;
      }
    });

    /* Open the place card directly — no ripple */
    if (typeof openDetail === 'function') {
      openDetail(DEMO_PLACE);
      _demoCardOpen = true;
      /* Blink the heart button after card animates in */
      setTimeout(_blinkHeart, 600);
    }
  }

  function closeDemoCard() {
    if (_demoCardOpen && typeof closePlaceCard === 'function') {
      closePlaceCard(false);
      _demoCardOpen = false;
    }
  }

  function scrollCardDemo() {
    /* Ensure the place card is open (in case user tapped Next before the 5s timer fired) */
    if (!_demoCardOpen && typeof openDetail === 'function') {
      openDetail(DEMO_PLACE);
      _demoCardOpen = true;
    }
    /* Wait 5 s, then slowly ease-scroll #pc-body down to reveal contacts */
    setTimeout(function () {
      var body = document.getElementById('pc-body');
      if (!body) return;
      var contacts = document.getElementById('pc-contacts');
      var targetScroll = contacts ? contacts.offsetTop : body.scrollHeight;
      var startScroll  = body.scrollTop;
      var distance     = targetScroll - startScroll;
      if (distance <= 4) return;
      var duration = 1400; /* ms — leisurely scroll */
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        /* ease-in-out cubic */
        var ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        body.scrollTop = startScroll + distance * ease;
        if (progress < 1) { requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
    }, 3000);
  }

  function showSavedDemo() {
    /* Close demo card if open */
    closeDemoCard();
    /* Suppress route drawing AND map re-fitting for the duration of the demo */
    window._tutDrawSavedOrig = window.drawSavedRoute;
    window.drawSavedRoute = function() {};
    window._tutFitBoundsOrig = window._fitRouteBounds;
    window._fitRouteBounds = function() {};
    /* Inject 5 demo saved places */
    _demoSavedBkp = localStorage.getItem(_favsKey());
    _demoSavedOn  = true;
    var demoIds = DEMO_SAVED_IDS
      ? DEMO_SAVED_IDS.slice(0, 5)
      : [DEMO_PLACE, 1, 5, 10, 15].filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,5);
    localStorage.setItem(_favsKey(), JSON.stringify(demoIds));
    if (typeof refreshFavourites === 'function') { refreshFavourites(); }
    /* Open saved panel if not already active */
    var pill = document.getElementById('pill-saved');
    if (pill && !pill.classList.contains('active')) {
      if (typeof toggleSavedFilter === 'function') { toggleSavedFilter(pill); }
    }
    /* On mobile toggleSavedFilter skips openSheet — call it explicitly */
    if (typeof openSheet === 'function') { setTimeout(openSheet, 80); }
    /* Card stays at bottom-center (set by setCard) — no repositioning needed */
  }

  function closeSavedDemo() {
    if (!_demoSavedOn) return;
    var pill = document.getElementById('pill-saved');
    if (pill && pill.classList.contains('active')) {
      if (typeof toggleSavedFilter === 'function') { toggleSavedFilter(pill); }
    }
    if (_demoSavedBkp !== null) {
      localStorage.setItem(_favsKey(), _demoSavedBkp);
    } else {
      localStorage.removeItem(_favsKey());
    }
    if (typeof refreshFavourites === 'function') { refreshFavourites(); }
    _demoSavedOn  = false;
    _demoSavedBkp = null;
    if (typeof clearTripRoute === 'function') clearTripRoute();
    /* Restore drawSavedRoute and _fitRouteBounds */
    if (window._tutDrawSavedOrig) {
      window.drawSavedRoute = window._tutDrawSavedOrig;
      window._tutDrawSavedOrig = null;
    }
    if (window._tutFitBoundsOrig !== undefined) {
      window._fitRouteBounds = window._tutFitBoundsOrig;
      window._tutFitBoundsOrig = undefined;
    }
  }

  /* ── General helpers ────────────────────────────────────────── */
  function clearBeacons() {
    beacons.forEach(function (b) { b.parentNode && b.parentNode.removeChild(b); });
    beacons = [];
  }

  function clearLauncherAnim() {
    if (launcherAnim) {
      document.querySelectorAll('.trip-btn-circle').forEach(function (b) { b.style.animation = ''; });
      launcherAnim = null;
    }
  }

  function addBeacons() {
    var markers = document.querySelectorAll('.leaflet-marker-icon');
    var chosen  = [];
    markers.forEach(function (m) {
      if (chosen.length >= 2) return;
      var r = m.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.top < 60 || r.bottom > window.innerHeight - 80) return;
      if (r.left < 40 || r.right > window.innerWidth - 40) return;
      var cx = r.left + r.width / 2;
      var cy = r.top  + r.height / 2;
      var tooClose = chosen.some(function (c) {
        return Math.abs(c.cx - cx) < 90 && Math.abs(c.cy - cy) < 90;
      });
      if (!tooClose) { chosen.push({ cx: cx, cy: cy }); }
    });
    chosen.forEach(function (pos) {
      var b = document.createElement('div');
      b.className = 'tut-beacon';
      b.style.cssText = 'position:fixed;left:' + pos.cx + 'px;top:' + pos.cy + 'px;';
      document.body.appendChild(b);
      beacons.push(b);
    });
  }

  function scrollFilterDemo() {
    var fb = document.querySelector('.filter-bar');
    if (!fb) return;
    var maxScroll = fb.scrollWidth - fb.clientWidth;
    if (maxScroll <= 0) return;
    var t = 0;
    function goRight() {
      t += 18;
      fb.scrollLeft = Math.min(maxScroll, (t / 700) * maxScroll);
      if (t < 700) { requestAnimationFrame(goRight); }
      else {
        setTimeout(function () {
          var t2 = 0; var start = fb.scrollLeft;
          function goLeft() {
            t2 += 18;
            fb.scrollLeft = Math.max(0, start * (1 - t2 / 500));
            if (t2 < 500) requestAnimationFrame(goLeft);
          }
          requestAnimationFrame(goLeft);
        }, 500);
      }
    }
    requestAnimationFrame(goRight);
  }

  function pulseLauncher() {
    document.querySelectorAll('.trip-btn-circle, #pill-storypath').forEach(function (b) {
      b.style.animation = 'tut-launcher-glow 1.1s ease-in-out infinite';
    });
    launcherAnim = true;
  }

  /* ── Spotlight + card positioning ───────────────────────────── */
  function setSpot(el) {
    var PAD = 8;
    clearDualOverlay();
    if (!el) {
      /* Fade out smoothly rather than snapping to hidden */
      spot.style.transition = 'opacity 0.3s ease';
      spot.style.opacity = '0';
      spot.style.pointerEvents = 'none';
      return;
    }
    var r = el.getBoundingClientRect();
    spot.style.cssText = 'display:block;position:fixed;box-shadow:0 0 0 9999px rgba(15,10,5,0.70);' +
      'border-radius:12px;pointer-events:none;opacity:1;' +
      'transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1),' +
      'width 0.4s cubic-bezier(.4,0,.2,1),height 0.4s cubic-bezier(.4,0,.2,1),opacity 0.3s ease;' +
      'left:' + (r.left - PAD) + 'px;top:' + (r.top - PAD) + 'px;' +
      'width:' + (r.width + PAD * 2) + 'px;height:' + (r.height + PAD * 2) + 'px;';
  }

  function setSpotMulti(selectors) {
    var PAD = 8;
    var els = selectors.map(function(s) { return document.querySelector(s); }).filter(Boolean);
    if (!els.length) { setSpot(null); return; }
    var left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
    els.forEach(function(el) {
      var r = el.getBoundingClientRect();
      if (r.width === 0) return;
      left   = Math.min(left,   r.left);
      top    = Math.min(top,    r.top);
      right  = Math.max(right,  r.right);
      bottom = Math.max(bottom, r.bottom);
    });
    if (left === Infinity) { setSpot(null); return; }
    spot.style.cssText = 'display:block;position:fixed;box-shadow:0 0 0 9999px rgba(15,10,5,0.70);' +
      'border-radius:12px;pointer-events:none;opacity:1;' +
      'transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1),' +
      'width 0.4s cubic-bezier(.4,0,.2,1),height 0.4s cubic-bezier(.4,0,.2,1),opacity 0.3s ease;' +
      'left:' + (left - PAD) + 'px;top:' + (top - PAD) + 'px;' +
      'width:' + (right - left + PAD * 2) + 'px;height:' + (bottom - top + PAD * 2) + 'px;';
  }

  function clearDualOverlay() {
    dualOverlay.style.display = 'none';
  }

  function setSpotDual(selectors) {
    /* Two separate highlighted cutouts via SVG mask — desktop only */
    var PAD = 8;
    var els = selectors.map(function(s) { return document.querySelector(s); }).filter(Boolean);
    spot.style.cssText = 'display:none;position:fixed;pointer-events:none;';
    if (!els.length) { dualOverlay.style.display = 'none'; return; }
    var vw = window.innerWidth, vh = window.innerHeight;
    var maskRects = '';
    els.forEach(function(el) {
      var r = el.getBoundingClientRect();
      if (!r.width) return;
      maskRects += '<rect x="' + (r.left - PAD) + '" y="' + (r.top - PAD) + '"' +
        ' width="' + (r.width + PAD * 2) + '" height="' + (r.height + PAD * 2) + '"' +
        ' rx="12" fill="black"/>';
    });
    if (!maskRects) { dualOverlay.style.display = 'none'; return; }
    dualOverlay.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    dualOverlay.innerHTML =
      '<defs><mask id="tut-holes-mask">' +
      '<rect width="' + vw + '" height="' + vh + '" fill="white"/>' +
      maskRects +
      '</mask></defs>' +
      '<rect width="' + vw + '" height="' + vh + '" fill="rgba(15,10,5,0.70)" mask="url(#tut-holes-mask)"/>';
    dualOverlay.style.display = 'block';
  }

  function setCard(extraOffset) {
    var vw      = window.innerWidth;
    var vh      = window.innerHeight;
    var cardW   = Math.min(290, vw - 52);
    var mobileOffset = vw < 768 ? 113 : 0; /* ~3 cm below centre on mobile */
    var extra   = extraOffset || 0;
    card.style.cssText = 'position:fixed;background:#f5edd8;border-radius:16px;' +
      'padding:20px 22px 16px;max-width:290px;width:calc(100vw - 52px);' +
      'box-shadow:0 8px 40px rgba(0,0,0,0.30);pointer-events:all;z-index:9001;' +
      'left:' + Math.max(16, (vw - cardW) / 2) + 'px;' +
      'top:'  + Math.max(80, (vh - 280) / 2 + mobileOffset + extra) + 'px;';
  }

  /* ── Show a step ────────────────────────────────────────────── */
  function showStep(n) {
    clearBeacons();
    clearLauncherAnim();
    clearDualOverlay();

    var step = STEPS[n];

    /* Close any open place card if this step requests it — unconditional */
    if (step.closeCard) {
      if (typeof closePlaceCard === 'function') { closePlaceCard(false); }
      _demoCardOpen = false;
    }

    STEPS.forEach(function (_, i) {
      var d = card.querySelector('#tut-dot-' + i);
      if (d) d.className = 'tut-dot ' + (i === n ? 'on' : 'off');
    });

    titleEl.textContent = step.title;
    bodyEl.textContent  = step.body;
    nextBtn.textContent = step.btn;

    var targetEl = step.target ? document.querySelector(step.target) : null;
    setCard(window.innerWidth < 768 ? (step.mobileCardOffset || 0) : 0);
    /* For sheet action buttons — keep spot visible and let CSS transition slide it smoothly */
    if (step.dualTargets) {
      clearDualOverlay();
      if (window.innerWidth >= 768) {
        if (step.targetsDelay) {
          setSpot(null);
          setTimeout(function() { setSpotDual(step.dualTargets); }, step.targetsDelay);
        } else {
          setSpotDual(step.dualTargets);
        }
      } else {
        setSpot(null); /* no shading on mobile for this step */
      }
    } else if (step.targets) {
      if (step.targetsDelay) {
        setSpot(null);
        setTimeout(function() { setSpotMulti(step.targets); }, step.targetsDelay);
      } else {
        setSpotMulti(step.targets);
      }
    } else if (step.target && (step.target.indexOf('saved-action') !== -1 || step.target.indexOf('#sheet button') !== -1)) {
      setTimeout(function () {
        var el = document.querySelector(step.target);
        if (el && el.getBoundingClientRect().width > 0) { setSpot(el); }
        else { setSpot(null); }
      }, 120);
    } else {
      setSpot(targetEl);
    }

    if (step.demo === 'blink')             { setTimeout(addBeacons,      350); }
    if (step.demo === 'scroll-filter')     { setTimeout(scrollFilterDemo, 450); }
    if (step.demo === 'open-card')         { setTimeout(openDemoCard,     350); }
    if (step.demo === 'open-card-delayed')  { setTimeout(openDemoCard,    3000); }
    if (step.demo === 'open-card-delayed-no-heart') { setTimeout(function() {
      if (!_demoCardOpen && typeof openDetail === 'function') {
        openDetail(DEMO_PLACE);
        _demoCardOpen = true;
      }
    }, 3000); }
    if (step.demo === 'scroll-card')       { scrollCardDemo(); }
    if (step.demo === 'close-card')        { setTimeout(closeDemoCard,    100); }
    if (step.demo === 'show-saved')        { setTimeout(showSavedDemo,     350); }
    if (step.demo === 'pulse-launcher')    { setTimeout(pulseLauncher,    350); }
    if (step.demo === 'close-saved')       { setTimeout(closeSavedDemo, 100); }
    if (step.demo === 'close-sheet')        { setTimeout(function() {
      if (typeof closeSheet === 'function') { closeSheet(); }
    }, 100); }
    if (step.demo === 'close-saved-pulse') {
      setTimeout(function () {
        closeSavedDemo();
        /* On mobile, close the places list so trip-launcher icons are visible */
        if (window.innerWidth < 768 && typeof closeSheet === 'function') { closeSheet(); }
        setTimeout(pulseLauncher, 400);
      }, 100);
    }
  }

  /* ── End tutorial ───────────────────────────────────────────── */
  function endTutorial() {
    clearBeacons();
    clearLauncherAnim();
    closeDemoCard();
    closeSavedDemo();
    localStorage.setItem(DONE_KEY, '1');
    overlay.style.opacity = '0';
    setTimeout(function () {
      overlay.parentNode && overlay.parentNode.removeChild(overlay);
      style.parentNode   && style.parentNode.removeChild(style);
    }, 400);
  }

  /* ── Button events ──────────────────────────────────────────── */
  nextBtn.addEventListener('click', function () {
    currentStep++;
    if (currentStep >= STEPS.length) { endTutorial(); }
    else { showStep(currentStep); }
  });
  skipBtn.addEventListener('click', endTutorial);

  /* ── Launch ─────────────────────────────────────────────────── */
  function launch() {
    currentStep   = 0;
    _demoCardOpen = false;
    _demoSavedOn  = false;
    _demoSavedBkp = null;
    if (!style.parentNode)   { document.head.appendChild(style); }
    if (!overlay.parentNode) { document.body.appendChild(overlay); }
    overlay.style.opacity = '1';
    showStep(0);
  }

  /* ── Public restart ─────────────────────────────────────────── */
  window.restartTutorial = function () {
    localStorage.removeItem(DONE_KEY);
    launch();
  };

  /* ── Auto-start on first visit DISABLED 2026-06-14 (per Maria) ──
     Visitors now explore the map first and open the tutorial themselves
     via the "Show tutorial" button (restartTutorial()).
     To re-enable first-visit auto-start, restore the original condition:
     if (!localStorage.getItem(DONE_KEY)) {                            */
  if (false) {
    var _splashGone = function() {
      var s = document.getElementById('splash');
      return !s || s.classList.contains('hidden') || getComputedStyle(s).display === 'none';
    };
    var _launchWhenClear = function() {
      if (_splashGone()) { launch(); } else { setTimeout(_launchWhenClear, 80); }
    };
    var waitForSplashClose = function () {
      var btn = document.querySelector('.splash-btn');
      if (!btn) {
        /* No splash on this page — only launch if there is genuinely no splash showing */
        if (_splashGone()) { setTimeout(launch, 400); }
        return;
      }
      btn.addEventListener('click', function () {
        /* Poll until splash is fully hidden (display:none) before launching */
        setTimeout(_launchWhenClear, 300);
      }, { once: true });
    };
    if (document.readyState === 'complete') {
      waitForSplashClose();
    } else {
      window.addEventListener('load', waitForSplashClose);
    }
  }

})();
