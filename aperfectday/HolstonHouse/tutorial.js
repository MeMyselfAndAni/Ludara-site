(function () {
  'use strict';

  var DONE_KEY = 'holston_tour_v1';
  if (localStorage.getItem(DONE_KEY)) return;

  /* ── Step definitions ───────────────────────────────────────── */
  var STEPS = [
    {
      title: 'Your Nashville guide',
      body: 'Every icon on the map is a hand-picked place. Colours show the type — tap any icon to open its card with hours, a concierge tip, and a link to the website.',
      target: null,
      cardPos: 'bottom-center',
      demo: 'blink',
      btn: 'Next'
    },
    {
      title: 'Filter by place type',
      body: 'Slide the bar left or right to browse all categories. Tap one — only places of that type stay on the map.',
      target: '.filter-bar',
      cardPos: 'below',
      demo: 'scroll-filter',
      btn: 'Next'
    },
    {
      title: 'Explore by neighbourhood',
      body: 'The icons along the bottom are Nashville neighbourhoods. Tap one to zoom the map to that area. Tap it again to reset.',
      target: '#nbhd-bar',
      cardPos: 'above',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Save your favourites',
      body: 'Tap any map icon to open its place card. Inside the card, tap the heart ♡ to save it. Browse through your picks in the Place List too.',
      target: null,
      cardPos: 'bottom-center',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Your saved places',
      body: 'Tap Saved to see everything you picked. From there you can rearrange the order, open in Google Maps, download a branded PDF guide, or share with a friend.',
      target: '#pill-saved',
      cardPos: 'below',
      demo: null,
      btn: 'Next'
    },
    {
      title: 'Our Day Trip Picks',
      body: 'See the two buttons on the left edge? One tap loads a full curated itinerary — a Music Insider Day or an evening Broadway Bar Hop. Your saved places are restored when you exit.',
      target: '#trip-launcher',
      cardPos: 'right',
      demo: 'pulse-launcher',
      btn: 'Done ✓'
    }
  ];

  /* ── Inject CSS ─────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#tut-overlay{position:fixed;inset:0;z-index:9000;pointer-events:none;transition:opacity 0.4s;}',

    '#tut-spot{',
    '  position:fixed;',
    '  box-shadow:0 0 0 9999px rgba(15,10,5,0.70);',
    '  border-radius:12px;',
    '  transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1),',
    '             width 0.4s cubic-bezier(.4,0,.2,1),height 0.4s cubic-bezier(.4,0,.2,1);',
    '  pointer-events:none;',
    '}',

    '#tut-card{',
    '  position:fixed;',
    '  background:#f5edd8;',
    '  border-radius:16px;',
    '  padding:20px 22px 16px;',
    '  max-width:290px;',
    '  width:calc(100vw - 52px);',
    '  box-shadow:0 8px 40px rgba(0,0,0,0.30);',
    '  pointer-events:all;',
    '  transition:left 0.35s ease,top 0.35s ease,bottom 0.35s ease,right 0.35s ease;',
    '  z-index:9001;',
    '}',

    '#tut-dots{display:flex;gap:5px;margin-bottom:12px;}',
    '.tut-dot{height:5px;border-radius:3px;background:rgba(49,38,29,0.22);transition:all 0.3s;}',
    '.tut-dot.on{background:#31261d;width:18px;}',
    '.tut-dot.off{width:5px;}',

    '#tut-title{',
    '  font-family:"Playfair Display",serif;',
    '  font-size:1.05rem;font-weight:700;',
    '  color:#31261d;margin:0 0 8px;',
    '}',

    '#tut-body{',
    '  font-family:"Inter",sans-serif;',
    '  font-size:0.80rem;color:#4a5568;',
    '  line-height:1.65;margin:0 0 16px;',
    '}',

    '#tut-actions{display:flex;justify-content:space-between;align-items:center;}',

    '#tut-skip{',
    '  background:none;border:none;',
    '  font-size:0.72rem;',
    '  color:rgba(49,38,29,0.45);',
    '  cursor:pointer;',
    '  font-family:"Inter",sans-serif;',
    '  padding:4px 0;',
    '}',

    '#tut-next{',
    '  background:#31261d;color:#f5edd8;',
    '  border:none;border-radius:20px;',
    '  padding:9px 22px;',
    '  font-size:0.80rem;font-weight:700;',
    '  cursor:pointer;',
    '  font-family:"Inter",sans-serif;',
    '  transition:background 0.15s;',
    '}',
    '#tut-next:hover{background:#251b12;}',

    '@keyframes tut-pulse{',
    '  0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.85;}',
    '  50%{transform:translate(-50%,-50%) scale(1.8);opacity:0.2;}',
    '}',

    '.tut-beacon{',
    '  position:absolute;',
    '  width:26px;height:26px;',
    '  border-radius:50%;',
    '  border:3px solid #802f2d;',
    '  animation:tut-pulse 1.3s ease-in-out infinite;',
    '  pointer-events:none;',
    '  z-index:8998;',
    '}',

    '@keyframes tut-launcher-glow{',
    '  0%,100%{box-shadow:0 0 0 0 rgba(49,38,29,0.5);}',
    '  50%{box-shadow:0 0 0 10px rgba(49,38,29,0);}',
    '}'
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
  document.body.appendChild(overlay);

  var titleEl = document.getElementById('tut-title');
  var bodyEl  = document.getElementById('tut-body');
  var nextBtn = document.getElementById('tut-next');
  var skipBtn = document.getElementById('tut-skip');
  var dotsEl  = document.getElementById('tut-dots');

  /* Build dots */
  STEPS.forEach(function (_, i) {
    var d = document.createElement('div');
    d.className = 'tut-dot off';
    d.id = 'tut-dot-' + i;
    dotsEl.appendChild(d);
  });

  /* ── State ──────────────────────────────────────────────────── */
  var currentStep = 0;
  var beacons = [];
  var launcherAnim = null;

  /* ── Helpers ────────────────────────────────────────────────── */
  function clearBeacons() {
    beacons.forEach(function (b) { b.parentNode && b.parentNode.removeChild(b); });
    beacons = [];
  }

  function clearLauncherAnim() {
    if (launcherAnim) {
      var btns = document.querySelectorAll('.trip-btn-circle');
      btns.forEach(function (b) { b.style.animation = ''; });
      launcherAnim = null;
    }
  }

  function addBeacons() {
    var map = document.getElementById('map');
    if (!map) return;
    var positions = [{ x: '38%', y: '40%' }, { x: '63%', y: '57%' }];
    positions.forEach(function (pos) {
      var b = document.createElement('div');
      b.className = 'tut-beacon';
      b.style.cssText = 'left:' + pos.x + ';top:' + pos.y + ';';
      map.style.position = map.style.position || 'absolute';
      map.appendChild(b);
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
    var btns = document.querySelectorAll('.trip-btn-circle');
    btns.forEach(function (b) {
      b.style.animation = 'tut-launcher-glow 1.1s ease-in-out infinite';
    });
    launcherAnim = true;
  }

  /* ── Spotlight + card positioning ───────────────────────────── */
  function setSpot(el) {
    var PAD = 8;
    if (!el) {
      /* No spotlight — invisible (full map step) */
      spot.style.cssText = [
        'position:fixed;left:50%;top:50%;',
        'width:0;height:0;',
        'box-shadow:0 0 0 9999px rgba(15,10,5,0);',
        'border-radius:12px;pointer-events:none;',
        'transition:none;'
      ].join('');
      return;
    }
    var r = el.getBoundingClientRect();
    spot.style.cssText = [
      'position:fixed;',
      'box-shadow:0 0 0 9999px rgba(15,10,5,0.70);',
      'border-radius:12px;pointer-events:none;',
      'transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1),',
      '           width 0.4s cubic-bezier(.4,0,.2,1),height 0.4s cubic-bezier(.4,0,.2,1);',
      'left:' + (r.left - PAD) + 'px;',
      'top:' + (r.top - PAD) + 'px;',
      'width:' + (r.width + PAD * 2) + 'px;',
      'height:' + (r.height + PAD * 2) + 'px;'
    ].join('');
  }

  function setCard(el, position) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var cardW = Math.min(290, vw - 52);

    /* Reset */
    card.style.cssText = 'position:fixed;background:#f5edd8;border-radius:16px;padding:20px 22px 16px;max-width:290px;width:calc(100vw - 52px);box-shadow:0 8px 40px rgba(0,0,0,0.30);pointer-events:all;z-index:9001;';

    if (position === 'bottom-center') {
      card.style.bottom = '28px';
      card.style.left = Math.max(16, (vw - cardW) / 2) + 'px';
      return;
    }

    if (!el) {
      card.style.bottom = '28px';
      card.style.left = Math.max(16, (vw - cardW) / 2) + 'px';
      return;
    }

    var r = el.getBoundingClientRect();
    var cx = Math.max(16, Math.min(vw - cardW - 16, r.left + r.width / 2 - cardW / 2));

    if (position === 'below') {
      card.style.top = (r.bottom + 14) + 'px';
      card.style.left = cx + 'px';
    } else if (position === 'above') {
      /* place card above element; estimate card height ~180px */
      card.style.bottom = (vh - r.top + 14) + 'px';
      card.style.left = cx + 'px';
    } else if (position === 'right') {
      var topPos = Math.max(80, Math.min(vh - 220, r.top + r.height / 2 - 90));
      card.style.top = topPos + 'px';
      var rightSpace = vw - r.right - 14;
      if (rightSpace >= cardW + 8) {
        card.style.left = (r.right + 14) + 'px';
      } else {
        /* Not enough right space — go below */
        card.style.top = (r.bottom + 14) + 'px';
        card.style.left = cx + 'px';
      }
    }
  }

  /* ── Show a step ────────────────────────────────────────────── */
  function showStep(n) {
    clearBeacons();
    clearLauncherAnim();

    var step = STEPS[n];

    /* Dots */
    STEPS.forEach(function (_, i) {
      var d = document.getElementById('tut-dot-' + i);
      if (d) d.className = 'tut-dot ' + (i === n ? 'on' : 'off');
    });

    titleEl.textContent = step.title;
    bodyEl.textContent  = step.body;
    nextBtn.textContent = step.btn;

    var targetEl = step.target ? document.querySelector(step.target) : null;
    setSpot(targetEl);
    setCard(targetEl, step.cardPos);

    /* Demos */
    if (step.demo === 'blink')           { setTimeout(addBeacons, 350); }
    if (step.demo === 'scroll-filter')   { setTimeout(scrollFilterDemo, 450); }
    if (step.demo === 'pulse-launcher')  { setTimeout(pulseLauncher, 350); }
  }

  /* ── End tutorial ───────────────────────────────────────────── */
  function endTutorial() {
    clearBeacons();
    clearLauncherAnim();
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

  /* ── Start: wait for splash to close, then map to be ready ─── */
  function tryStart() {
    var loading = document.getElementById('loading');
    var mapEl   = document.getElementById('map');
    if ((loading && loading.style.display !== 'none') &&
        !(mapEl && mapEl.querySelector('.leaflet-tile'))) {
      setTimeout(tryStart, 300);
      return;
    }
    setTimeout(function () { showStep(0); }, 600);
  }

  function waitForSplashClose() {
    var splash = document.getElementById('splash');
    /* Splash not present or already hidden — go straight to map check */
    if (!splash || splash.style.display === 'none' || splash.classList.contains('hidden')) {
      setTimeout(tryStart, 1200);
      return;
    }
    /* Splash is visible — watch for it to be dismissed */
    var obs = new MutationObserver(function () {
      if (splash.style.display === 'none' || splash.classList.contains('hidden')) {
        obs.disconnect();
        setTimeout(tryStart, 600);
      }
    });
    obs.observe(splash, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  if (document.readyState === 'complete') {
    waitForSplashClose();
  } else {
    window.addEventListener('load', waitForSplashClose);
  }

})();
