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
      /* 1 — Welcome */
      title: 'Welcome to Your Perfect Day in ' + CITY,
      body: 'One interactive map for the whole estate — the house and galleries, the naturalistic garden, children’s Enchanted Woods and every trail — with the story behind each place.',
      target: null,
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      /* 2 — Explore the pins */
      title: 'The Winterthur Guide',
      body: 'Every pin is worth your time: Henry Francis du Pont’s house and its American treasures, the March Bank’s millions of late-winter bulbs, Azalea Woods in full bloom, the children’s Enchanted Woods, and the narrated tram that carries you through it all. Tap any icon to see what’s there.',
      target: null,
      cardPos: 'center',
      demo: 'open-card-delayed-no-heart',
      btn: 'Next'
    },
    {
      /* 3 — Inside the card */
      title: 'Inside the place card',
      body: 'Each card has a place description, visitor tip and direct Google Maps navigation link.',
      target: null,
      cardPos: 'center',
      demo: 'scroll-card',
      btn: 'Next'
    },
    {
      /* 4 — Ready-made day trips (moved up so visitors meet it early) */
      title: 'Ready-made day trips',
      body: 'Short on time? One tap on the left loads a full, ready-to-go day — ' + TRIP_NAMES + '. A whole route, planned for you.',
      target: '#trip-launcher',
      cardPos: 'center',
      closeCard: true,
      demo: 'close-saved-pulse',
      btn: 'Next'
    },
    {
      /* 5 — Filter by type & area (merged: category bar + zone bubbles) */
      title: 'Filter by type & area',
      body: 'Looking only for the house and galleries, or just the gardens? Tap a category at the top to show only what you want. Or tap a zone below — Museum & House, The Garden, Visitor Center — to jump straight to that part of the estate. The map follows either way.',
      target: '.filter-bar',
      dualTargets: ['.filter-bar', '#nbhd-bar'],  /* desktop: highlight both; mobile: highlight the top bar, copy points to the zones below */
      cardPos: 'center',
      closeCard: true,
      demo: 'scroll-filter',
      btn: 'Next'
    },
    {
      /* 6 — Save your favourites (merged: tap heart + saved list in one demo) */
      title: 'Save your favourites',
      body: 'Found something you love? Tap the heart to save it. Your saved places gather under Saved — tap any to reopen its card, and drag to arrange them in the order you’ll walk.',
      target: null,
      cardPos: 'center',
      demo: 'save-and-show',
      btn: 'Next'
    },
    {
      /* 7 — Google Maps navigation */
      title: 'Navigate with Google Maps',
      body: 'Ready to walk? Open your full route in Google Maps, or tap any saved place to navigate there directly.',
      target: '#sheet button[onclick="openTripInMaps()"]',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      /* 8 — PDF */
      title: 'Download a PDF guide',
      body: 'Tap PDF Guide to get a beautifully designed guide with all your picks, ready to share or print before you leave.',
      target: '#sheet button[onclick="generatePDF()"]',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      /* 9 — Share */
      title: 'Share your map',
      body: 'Send this map to a travel companion or keep it for the next visit. One tap to share by message or email.',
      target: '#sheet button[onclick="shareItinerary()"]',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      /* 10 — Locate yourself */
      title: 'Navigate',
      body: 'The estate spreads across a thousand acres and it’s easy to lose your bearings. Tap the circle to find yourself on the map.',
      target: null,
      targets: ['#locate-btn'],
      targetsDelay: 200,  /* wait for close-sheet animation before spotlighting */
      cardPos: 'center',
      demo: 'close-saved-sheet',
      mobileCardOffset: -75,  /* move card ~2cm up on mobile only */
      btn: 'Next'
    },
    {
      /* 11 — All set */
      title: "You're all set!",
      body: 'The estate is yours to explore. Go find your perfect day.',
      target: null,
      cardPos: 'center',
      mobileCardOffset: -75,  /* match Navigate step so card doesn't jump */
      demo: null,
      btn: 'Done'
    }
  ];

  /* ── Filter steps that need optional UI elements ───────────── */
  /* Day Trips step — skip if launcher absent or tripNames not configured */
  if (!document.querySelector('#trip-launcher') || !CFG.tripNames) {
    STEPS = STEPS.filter(function (s) { return s.demo !== 'close-saved-pulse'; });
  }
  /* Always mark the final step as Done */
  if (STEPS.length > 0) { STEPS[STEPS.length - 1].btn = 'Done ✓'; }

  /* ── Multilingual tutorial copy ──────────────────────────────────
     The Winterthur guide is English-only, so the tour ships no per-language
     dictionaries. (The previous Hebrew/Russian/Arabic blocks here were
     leftover Eretz Israel Museum copy and were removed 2026-07-22.)
     showStep() looks these maps up and safely falls back to the English
     STEPS text when a language has no entry — to add a language later,
     populate these maps keyed by the English step title. */
  var TUT_BY_LANG      = {};
  var TUT_BTN_BY_LANG  = {};
  var TUT_SKIP_BY_LANG = {};


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
    /* Drag grip + one-time hint (card stays centred; user can shift it) */
    '#tut-grip{width:38px;height:4px;border-radius:3px;background:rgba(49,38,29,0.22);margin:0 auto 12px;}',
    '#tut-hint{font-size:0.68rem;color:rgba(49,38,29,0.5);text-align:center;margin:-6px 0 4px;',
    '  transition:opacity 0.4s ease;}',
    /* "New here?" nudge — one-time invite that appears 5s after the map opens */
    '#tut-nudge{position:fixed;right:12px;bottom:272px;z-index:1200;max-width:236px;',
    '  background:#2f5347;color:#f5edd8;border-radius:14px;padding:12px 14px 12px;',
    '  box-shadow:0 6px 24px rgba(0,0,0,0.35);font-family:"Rubik","Inter",sans-serif;',
    '  opacity:0;transform:translateY(8px);transition:opacity 0.3s ease,transform 0.3s ease;pointer-events:all;}',
    '#tut-nudge.show{opacity:1;transform:translateY(0);}',
    '#tut-nudge-txt{font-size:0.82rem;line-height:1.45;margin:2px 16px 10px 0;}',
    '#tut-nudge-go{background:#e6c34d;color:#2f5347;border:none;border-radius:16px;',
    '  padding:7px 16px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:"Rubik","Inter",sans-serif;',
    '  letter-spacing:0.02em;}',
    '#tut-nudge-go:hover{background:#efd06a;}',
    '#tut-nudge-x{position:absolute;top:6px;right:8px;background:none;border:none;',
    '  color:rgba(245,237,216,0.7);font-size:0.9rem;line-height:1;cursor:pointer;padding:2px 4px;}',
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
    '<div id="tut-grip" title="Drag to move"></div>',
    '<div id="tut-dots"></div>',
    '<h3 id="tut-title"></h3>',
    '<p id="tut-body"></p>',
    '<div id="tut-actions">',
    '  <button id="tut-skip">Skip to the end</button>',
    '  <button id="tut-next">Next</button>',
    '</div>',
    '<div id="tut-hint">✋ Drag to move this card</div>'
  ].join('');

  overlay.appendChild(spot);
  overlay.appendChild(dualOverlay);
  overlay.appendChild(card);

  /* ── Drag-to-move card ──────────────────────────────────────── */
  card.addEventListener('pointerdown', function (e) {
    if (e.target.tagName === 'BUTTON') return;   /* don't steal button clicks */
    /* Once the user starts dragging, they've got it — hide the hint */
    var _h = document.getElementById('tut-hint'); if (_h) _h.style.opacity = '0';
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
  var _hintTimer     = null;
  var _nudgeTimer    = null;
  var _showToken     = 0;   /* bumped each step so a slow demo can't hijack a later step */

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
    hb.textContent = '♥'; /* ♥ filled */
    hb.style.fontFamily = 'Arial, sans-serif';
    hb.style.color = '#e00040';
    hb.style.transform = 'scale(1.25)';
    /* After 2 s, fade back to white outline heart */
    setTimeout(function () {
      hb.style.color = 'white';
      hb.style.transform = 'scale(1)';
      setTimeout(function () {
        hb.textContent = '♡'; /* ♡ outline */
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
    /* Idempotent: if the saved demo is already up, just make sure the sheet
       is visible (later sheet-button steps rely on this). */
    if (_demoSavedOn) {
      var pill0 = document.getElementById('pill-saved');
      if (pill0 && !pill0.classList.contains('active') && typeof toggleSavedFilter === 'function') {
        toggleSavedFilter(pill0);
      }
      if (typeof openSheet === 'function') { openSheet(); }
      return;
    }
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

  /* Merged "Save your favourites" demo: open a card and fill the heart,
     then open the Saved list so both halves are shown in one step. */
  function saveAndShowDemo() {
    var tok = _showToken;                 /* if the user advances, don't hijack the next step */
    openDemoCard();                       /* opens DEMO_PLACE card, blinks heart at +600ms */
    setTimeout(function () {
      if (_showToken !== tok) return;
      showSavedDemo();                    /* closes card, injects saved places, opens the sheet */
      setTimeout(function () {
        if (_showToken !== tok) return;
        if (window.innerWidth >= 768) { setSpotDual(['#pill-saved', '#sheet']); }
        else { setSpot(null); }           /* no shading on mobile — matches the old saved step */
      }, 550);
    }, 2600);
  }

  /* Locate step cleanup: put the saved demo away AND close the sheet,
     so the map is clear when we spotlight the locate button. */
  function closeSavedSheetDemo() {
    closeSavedDemo();
    if (typeof closeSheet === 'function') { closeSheet(); }
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
    document.querySelectorAll('.trip-btn-circle').forEach(function (b) {
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

  function setCard(extraOffset, targetEl) {
    var vw      = window.innerWidth;
    var vh      = window.innerHeight;
    var cardW   = Math.min(290, vw - 52);
    var left    = Math.max(16, (vw - cardW) / 2);
    var cardH   = card.offsetHeight || 240;
    var top;
    var r = (targetEl && targetEl.getBoundingClientRect) ? targetEl.getBoundingClientRect() : null;
    if (r && r.width > 0) {
      top = (r.top > vh * 0.48) ? (r.top - cardH - 18) : (r.bottom + 18);
      top = Math.max(72, Math.min(top, vh - cardH - 14));
    } else {
      var mobileOffset = vw < 768 ? 40 : 0;
      top = Math.max(80, (vh - 280) / 2 + mobileOffset + (extraOffset || 0));
    }
    card.style.cssText = 'position:fixed;background:#f5edd8;border-radius:16px;' +
      'padding:20px 22px 16px;max-width:290px;width:calc(100vw - 52px);' +
      'box-shadow:0 8px 40px rgba(0,0,0,0.30);pointer-events:all;z-index:9001;touch-action:none;' +
      'left:' + left + 'px;top:' + top + 'px;';
  }

  /* ── Show a step ────────────────────────────────────────────── */
  function showStep(n) {
    _showToken++;   /* invalidate any pending demo from the previous step */
    clearBeacons();
    clearLauncherAnim();
    clearDualOverlay();

    var step = STEPS[n];

    /* Close any open place card if this step requests it — unconditional.
       Wrapped so a throw here can't stop the step's text from rendering. */
    if (step.closeCard) {
      try {
        if (typeof closePlaceCard === 'function') { closePlaceCard(false); }
      } catch (err) {
        try { console.warn('tutorial: closeCard failed on step ' + n, err); } catch (_) {}
      }
      _demoCardOpen = false;
    }

    STEPS.forEach(function (_, i) {
      var d = card.querySelector('#tut-dot-' + i);
      if (d) d.className = 'tut-dot ' + (i === n ? 'on' : 'off');
    });

    var _tl   = (typeof LANG !== 'undefined') ? LANG : 'en';
    var _dict = TUT_BY_LANG[_tl] || null;
    var _h    = _dict ? _dict[step.title] : null;
    titleEl.textContent = _h ? _h.title : step.title;
    bodyEl.textContent  = _h ? _h.body  : step.body;
    var _btnmap = TUT_BTN_BY_LANG[_tl];
    nextBtn.textContent = (_btnmap && _btnmap[step.btn]) || step.btn;
    var _skip = document.getElementById('tut-skip'); if(_skip) _skip.textContent = TUT_SKIP_BY_LANG[_tl] || 'Skip to the end';

    var targetEl = step.target ? document.querySelector(step.target) : null;
    setCard(window.innerWidth < 768 ? (step.mobileCardOffset || 0) : 0, targetEl);
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
        /* Mobile: highlight the primary target (e.g. the category bar);
           the copy points to the second target (the zones just below). */
        if (targetEl) { setSpot(targetEl); }
        else { setSpot(null); }
      }
    } else if (step.targets) {
      if (step.targetsDelay) {
        setSpot(null);
        setTimeout(function() { setSpotMulti(step.targets); }, step.targetsDelay);
      } else {
        setSpotMulti(step.targets);
      }
    } else if (step.target && (step.target.indexOf('saved-action') !== -1 || step.target.indexOf('#sheet button') !== -1)) {
      /* These buttons live inside the Saved sheet — make sure it's open even
         if the user raced past "Save your favourites" before its demo ran. */
      if (step.target.indexOf('#sheet button') !== -1 && typeof showSavedDemo === 'function') {
        showSavedDemo();
      }
      setTimeout(function () {
        var el = document.querySelector(step.target);
        if (el && el.getBoundingClientRect().width > 0) { setSpot(el); setCard(0, el); }
        else { setSpot(null); }
      }, 300);
    } else {
      setSpot(targetEl);
    }

    /* Demo dispatch — wrapped so a single broken demo can never freeze the
       tour (the card title/body are already set above). */
    try {
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
      if (step.demo === 'save-and-show')     { setTimeout(saveAndShowDemo,   350); }
      if (step.demo === 'pulse-launcher')    { setTimeout(pulseLauncher,    350); }
      if (step.demo === 'close-saved')       { setTimeout(closeSavedDemo, 100); }
      if (step.demo === 'close-saved-sheet') { setTimeout(closeSavedSheetDemo, 100); }
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
    } catch (err) {
      try { console.warn('tutorial: demo failed on step ' + n, err); } catch (_) {}
    }

    /* One-time "drag to move" hint — first step only, auto-fades */
    var _hint = document.getElementById('tut-hint');
    if (_hint) {
      if (n === 0) {
        _hint.style.display = 'block';
        _hint.style.opacity = '1';
        clearTimeout(_hintTimer);
        _hintTimer = setTimeout(function () { _hint.style.opacity = '0'; }, 4500);
      } else {
        _hint.style.display = 'none';
      }
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

  /* ── "New here?" nudge — one-time invite, 5s after the map opens ──
     A gentle, non-blocking prompt that sits just above the Guide button.
     It does NOT start the tour on its own — tapping "Take the tour" does.
     Shows once (per browser), and stays quiet if the tour was taken. */
  var NUDGE_KEY = DONE_KEY + '_nudge';

  function _mapReady() {
    var s = document.getElementById('splash');
    return !s || s.classList.contains('hidden') || getComputedStyle(s).display === 'none';
  }

  function dismissNudge() {
    if (_nudgeTimer) { clearTimeout(_nudgeTimer); _nudgeTimer = null; }
    var n = document.getElementById('tut-nudge');
    if (!n) return;
    n.classList.remove('show');
    setTimeout(function () { n.parentNode && n.parentNode.removeChild(n); }, 350);
  }

  function showNudge() {
    /* Don't nag: skip if the tour was taken, the nudge already appeared,
       or the tour is on screen right now. */
    if (localStorage.getItem(DONE_KEY) || localStorage.getItem(NUDGE_KEY)) return;
    if (overlay.parentNode) return;
    if (document.getElementById('tut-nudge')) return;
    if (!style.parentNode) { document.head.appendChild(style); }  /* ensure nudge CSS is present */
    localStorage.setItem(NUDGE_KEY, '1');   /* appears once */

    var n = document.createElement('div');
    n.id = 'tut-nudge';
    n.innerHTML = [
      '<button id="tut-nudge-x" aria-label="Dismiss">✕</button>',
      '<div id="tut-nudge-txt">👋 New here? Let me show you around.</div>',
      '<button id="tut-nudge-go">Take the tour</button>'
    ].join('');
    document.body.appendChild(n);
    requestAnimationFrame(function () { n.classList.add('show'); });

    document.getElementById('tut-nudge-go').addEventListener('click', function () {
      dismissNudge();
      launch();
    });
    document.getElementById('tut-nudge-x').addEventListener('click', dismissNudge);

    /* Tuck it away after 15s if ignored (already marked as shown) */
    _nudgeTimer = setTimeout(dismissNudge, 15000);
  }

  (function scheduleNudge() {
    if (localStorage.getItem(DONE_KEY) || localStorage.getItem(NUDGE_KEY)) return;
    var waitReady = function () {
      if (_mapReady()) { setTimeout(showNudge, 5000); }   /* 5s after the map becomes visible */
      else { setTimeout(waitReady, 300); }
    };
    if (document.readyState === 'complete') { waitReady(); }
    else { window.addEventListener('load', waitReady); }
  })();

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
