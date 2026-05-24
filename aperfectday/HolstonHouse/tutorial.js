(function () {
  'use strict';

  /* ── City config (set window.TutorialConfig in each hotel's index.html) ── */
  var CFG             = window.TutorialConfig || {};
  var DONE_KEY        = CFG.doneKey       || 'city_tour_v1';
  var CITY            = CFG.cityName      || 'the city';
  var DEMO_PLACE      = CFG.demoPlaceId   || 1;
  var TRIP_NAMES      = CFG.tripNames     || 'a curated day trip';
  var DEMO_SAVED_IDS  = CFG.demoSavedIds  || null; /* array of 3-4 real place IDs */

  /* ── Step definitions ───────────────────────────────────────── */
  var STEPS = [
    {
      title: 'Your Perfect Day in ' + CITY,
      body: 'Every icon on the map is a hand-picked place we recommend. Icon colors show the type — tap any icon to open its card with hours, an insider tip, and a link to the website.',
      target: null,
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Filter by place type',
      body: 'Slide the top bar left or right to browse all categories. Tap one — only places of that type stay on the map.',
      target: '.filter-bar',
      cardPos: 'center',
      demo: 'scroll-filter',
      btn: 'Next'
    },
    {
      title: 'Explore by neighbourhood',
      body: 'The icons along the bottom are ' + CITY + ' neighbourhoods. Tap one to zoom the map to that area. Tap it again to reset.',
      target: '#nbhd-bar',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Save your favorites',
      body: 'Tap any icon on the map to open its place card. Then tap the heart to save it — it stays saved between visits.',
      target: null,
      cardPos: 'center',
      demo: 'open-card',
      btn: 'Next'
    },
    {
      title: 'Inside the place card',
      body: 'Read our curated place description and exclusive tips. Scroll down for the phone number and website link.',
      target: null,
      cardPos: 'center',
      demo: 'scroll-card',
      btn: 'Next'
    },
    {
      title: 'Your saved places',
      body: 'Tap top left Saved to open your personal list. Click on rows to open each place card. Drag any item up or down to rearrange the order.',
      target: null,
      cardPos: 'center',
      demo: 'show-saved',
      btn: 'Next'
    },
    {
      title: 'Navigate',
      body: 'You can navigate on mobile using our maps or tap to open your trip in Google Maps.',
      target: '.saved-action-route',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Download a PDF guide',
      body: 'Tap PDF Guide to download a beautifully designed branded guide with all your picks.',
      target: '.saved-action-pdf',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Share your map',
      body: 'Share your personalized map via message or email.',
      target: '.saved-action-map',
      cardPos: 'center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Our Day Trip Picks',
      body: 'See the buttons on the left edge? One tap loads a full curated itinerary — ' + TRIP_NAMES + '.',
      target: '#trip-launcher',
      cardPos: 'center',
      demo: 'close-saved-pulse',
      btn: 'Next'
    },
    {
      title: "You're all set!",
      body: "Let's start planning Your Perfect Day!",
      target: null,
      cardPos: 'center',
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

  /* ── Inject CSS ─────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#tut-overlay{position:fixed;inset:0;z-index:9000;pointer-events:none;transition:opacity 0.4s;}',
    '#tut-spot{position:fixed;box-shadow:0 0 0 9999px rgba(15,10,5,0.70);border-radius:12px;',
    '  transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1),',
    '  width 0.4s cubic-bezier(.4,0,.2,1),height 0.4s cubic-bezier(.4,0,.2,1);pointer-events:none;}',
    '#tut-card{position:fixed;background:#f5edd8;border-radius:16px;padding:20px 22px 16px;',
    '  max-width:290px;width:calc(100vw - 52px);box-shadow:0 8px 40px rgba(0,0,0,0.30);',
    '  pointer-events:all;transition:left 0.35s ease,top 0.35s ease,bottom 0.35s ease;z-index:9001;}',
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
    '@keyframes tut-heart-blink{',
    '  0%,100%{color:inherit;transform:scale(1);}',
    '  30%{color:#802f2d;transform:scale(1.45);}',
    '  60%{color:rgba(128,47,45,0.35);transform:scale(1.1);}}',
    '.tut-heart-blink{animation:tut-heart-blink 2.25s ease-in-out 3 !important;}',
  ].join('');
  document.head.appendChild(style);


  /* ── Build overlay DOM ──────────────────────────────────────── */
  var overlay = document.createElement('div');
  overlay.id = 'tut-overlay';

  var spot = document.createElement('div');
  spot.id = 'tut-spot';

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
  overlay.appendChild(card);

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
    hb.classList.add('tut-heart-blink');
    setTimeout(function () { hb.classList.remove('tut-heart-blink'); }, 7500);
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
      setTimeout(_blinkHeart, 2250);
    }
  }

  function closeDemoCard() {
    if (_demoCardOpen && typeof closePlaceCard === 'function') {
      closePlaceCard(false);
      _demoCardOpen = false;
    }
  }

  function scrollCardDemo() {
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
    }, 5000);
  }

  function showSavedDemo() {
    /* Close 3rd & Lindsley card if open */
    closeDemoCard();
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
    if (!el) {
      spot.style.cssText = 'display:none;position:fixed;pointer-events:none;';
      return;
    }
    var r = el.getBoundingClientRect();
    spot.style.cssText = 'display:block;position:fixed;box-shadow:0 0 0 9999px rgba(15,10,5,0.70);' +
      'border-radius:12px;pointer-events:none;' +
      'transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1),' +
      'width 0.4s cubic-bezier(.4,0,.2,1),height 0.4s cubic-bezier(.4,0,.2,1);' +
      'left:' + (r.left - PAD) + 'px;top:' + (r.top - PAD) + 'px;' +
      'width:' + (r.width + PAD * 2) + 'px;height:' + (r.height + PAD * 2) + 'px;';
  }

  function setCard() {
    var vw    = window.innerWidth;
    var vh    = window.innerHeight;
    var cardW = Math.min(290, vw - 52);
    card.style.cssText = 'position:fixed;background:#f5edd8;border-radius:16px;' +
      'padding:20px 22px 16px;max-width:290px;width:calc(100vw - 52px);' +
      'box-shadow:0 8px 40px rgba(0,0,0,0.30);pointer-events:all;z-index:9001;' +
      'left:' + Math.max(16, (vw - cardW) / 2) + 'px;' +
      'top:'  + Math.max(80, (vh - 280) / 2)   + 'px;';
  }

  /* ── Show a step ────────────────────────────────────────────── */
  function showStep(n) {
    clearBeacons();
    clearLauncherAnim();

    var step = STEPS[n];

    STEPS.forEach(function (_, i) {
      var d = card.querySelector('#tut-dot-' + i);
      if (d) d.className = 'tut-dot ' + (i === n ? 'on' : 'off');
    });

    titleEl.textContent = step.title;
    bodyEl.textContent  = step.body;
    nextBtn.textContent = step.btn;

    var targetEl = step.target ? document.querySelector(step.target) : null;
    setCard();
    /* For saved-panel action buttons, re-query after panel animates in */
    if (step.target && step.target.indexOf('saved-action') !== -1) {
      setSpot(null);
      setTimeout(function () {
        var el = document.querySelector(step.target);
        if (el && el.getBoundingClientRect().width > 0) { setSpot(el); }
      }, 120);
    } else {
      setSpot(targetEl);
    }

    if (step.demo === 'blink')             { setTimeout(addBeacons,      350); }
    if (step.demo === 'scroll-filter')     { setTimeout(scrollFilterDemo, 450); }
    if (step.demo === 'open-card')         { setTimeout(openDemoCard,     350); }
    if (step.demo === 'scroll-card')       { scrollCardDemo(); }
    if (step.demo === 'close-card')        { setTimeout(closeDemoCard,    100); }
    if (step.demo === 'show-saved')        { setTimeout(showSavedDemo,     350); }
    if (step.demo === 'pulse-launcher')    { setTimeout(pulseLauncher,    350); }
    if (step.demo === 'close-saved')       { setTimeout(closeSavedDemo, 100); }
    if (step.demo === 'close-saved-pulse') {
      setTimeout(function () {
        closeSavedDemo();
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

  /* ── Auto-start on first visit only ─────────────────────────── */
  if (!localStorage.getItem(DONE_KEY)) {
    var waitForSplashClose = function () {
      var btn = document.querySelector('.splash-btn');
      if (!btn) { setTimeout(launch, 1200); return; }
      btn.addEventListener('click', function () {
        setTimeout(launch, 700);
      }, { once: true });
    };
    if (document.readyState === 'complete') {
      waitForSplashClose();
    } else {
      window.addEventListener('load', waitForSplashClose);
    }
  }

})();
