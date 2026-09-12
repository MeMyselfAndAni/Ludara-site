// A Perfect Day — Ludara / New Orleans
// map.js — guide-specific config (rebuilt from data.js)

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-90.077, 29.9503];  // [longitude, latitude] — New Orleans centroid
const MAP_ZOOM          = 12;
const OFFLINE_CENTER    = { lat: 29.9503, lng: -90.077 };
const GUIDE_CITY        = 'New Orleans';
const BLOGGER_NAME      = 'Ludara';
const GUIDE_TIMEZONE    = 'America/Chicago';
const TIME_FORMAT       = '12h';
const DISTANCE_UNITS    = 'imperial';

const CC = {
  "landmark": "#ff2a00",
  "food": "#d4902a",
  "cafe": "#5a8f68",
  "pub": "#6b5b9a",
  "market": "#b07040",
  "nature": "#3d8a5e"
};

const CL = {
  "landmark": "Landmarks",
  "food": "Restaurants",
  "cafe": "Coffee & Brunch",
  "pub": "Bars & Music",
  "market": "Markets",
  "nature": "Parks & Nature"
};

const NBHD_COLORS = {
  "french-quarter": "#ff2a00",
  "marigny-bywater": "#d4902a",
  "treme": "#6b5b9a",
  "garden-district": "#5a8f68",
  "warehouse": "#4a90b8",
  "mid-city": "#b07040",
  "uptown": "#3d8a5e"
};

const NBHD_LABELS = {
  "french-quarter": "French Quarter",
  "marigny-bywater": "Marigny & Bywater",
  "treme": "Tremé",
  "garden-district": "Garden District",
  "warehouse": "Warehouse District",
  "mid-city": "Mid-City",
  "uptown": "Uptown"
};

const NBHD_APPROX_CENTERS = {
  "french-quarter": { lat: 29.9582, lng: -90.0656 },
  "marigny-bywater": { lat: 29.9617, lng: -90.0489 },
  "treme": { lat: 29.9659, lng: -90.0725 },
  "garden-district": { lat: 29.9347, lng: -90.0863 },
  "warehouse": { lat: 29.9437, lng: -90.0704 },
  "mid-city": { lat: 29.9817, lng: -90.0852 },
  "uptown": { lat: 29.9204, lng: -90.1092 }
};

// ─── Map initialisation ───────────────────────────────────────────────────────
function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    attributionControl: false,
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

  map.on('error', function (e) {
    // Never reload the page at a reader. Until 11 September 2026 this handler
    // reloaded the whole page two seconds after ANY map error, which turned a
    // base map that could not be reached into a page that reloaded itself
    // every two seconds for as long as the reader stayed. The notice block at
    // the end of this file is what handles a base map that will not come.
    console.warn('Map error:', (e && e.error && e.error.message) || '');
  });

  map.on('load', () => {
    try {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';

      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce', ['get', 'name:en'], ['get', 'name'],
            ]);
          } catch(e) {}
        }
      });

      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();
      if (map.getSource('trip-route')) {
        map.getSource('trip-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
      }

      PLACES.forEach(p => addMarker(p));
      if (typeof applyFilters   === 'function') applyFilters();
      if (typeof renderList     === 'function') renderList();
      if (typeof initFavourites === 'function') initFavourites();
      if (typeof alignNbhdBar   === 'function') alignNbhdBar();

    } catch (err) {
      const el = document.getElementById('loading');
      if (el) {
        el.style.display = 'flex';
        el.innerHTML = '<div style="color:red;padding:20px;font-size:12px;font-family:monospace;">ERROR: ' + err.message + '</div>';
      }
      console.error('Map load error:', err);
    }
  });
}
// ⚠️ DO NOT call initMap() here — index.html fires it via window.addEventListener('load', initMap)


/* ─── LUDARA_TILE_NOTICE_V3 ────────────────────────────────────────────────
   The reader's experience while the base map is loading, and when it fails.
   Added 8 September 2026. Version 2 on 10 September. Version 3 on 11 September.

   THE PROBLEM THIS SOLVES

   The base map imagery comes from api.maptiler.com, which sits on Cloudflare.
   A network that cannot reach it gets no error from MapLibre at all: the map
   simply never draws. Worse, the page builds its places list, its filters and
   its saved list inside map.on('load'), which in that case never fires, so the
   reader is left looking at an empty rectangle AND an empty panel, with a
   spinner turning and no explanation. This happened on Maria's own home
   network on 8 September 2026 and took a whole day to identify.

   WHAT THIS BLOCK DOES, in the order the reader meets it

   1. Immediately, at DOMContentLoaded, it builds the places list. The reader
      has something to read in about a second instead of watching a spinner.
      Nothing in the list needs the base map.
   2. At 3 seconds, if the map still has not drawn, it says so quietly under
      the spinner, in the reader's language.
   3. At 8 seconds it says it is taking longer than usual and that their
      connection may be slow. Maria's decision, 12 September: say it every time
      rather than only when the browser admits to a slow connection. Safari
      never reports one, and by eight seconds a slow connection is the most
      likely explanation anyway.
   4. At 15 seconds, or after four failed requests, it gives up on the detailed
      map and swaps in a plain one: coastlines, land and country borders, from
      a small file on ludara.ai. Same map, same pins, same everything, on a
      simpler background. Then it says what happened, and reports it quietly.

   If the detailed map turns up late, every one of these takes itself away.
   On a healthy map this block creates nothing, shows nothing and sends nothing.

   Self contained on purpose. It adds no files, no styles and no dependencies,
   so it can be dropped into any map unchanged. The one thing it needs from
   outside is the plain map file, which every map shares.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var STYLE_TIMEOUT_MS = 15000;  // how long the base map may take before we act
  var HINT_1_MS        = 3000;   // first quiet word to the reader
  var HINT_2_MS        = 8000;   // second, when it is clearly slow
  var FIND_MAP_MS      = 60000;  // how long to keep looking for the map object
  var ERROR_LIMIT      = 4;      // failed requests that also trigger the notice

  var PAPER  = '#f5edd8';        // the shared paper tone, used if all else fails
  var SEA    = '#ccd8da';
  var LAND   = '#efe5cb';
  var INK    = '#b9a87e';

  // The plain map: land, coastlines and country borders, about 40 KB over the
  // wire. It lives on ludara.ai, so if the page itself loaded, this will load.
  var PLAIN_MAP_URL = '/assets/basemap/world-110m.json';

  // Quiet reporting. The URL is just a script id: it carries no email address
  // and no phone number, so nothing personal is exposed to the reader. Fires at
  // most once per browser session, plus one recovery ping.
  var REPORT_URL = 'https://script.google.com/macros/s/AKfycbzOtGuFCSX0ut-fzRYh_OgODb9BkMtQ1ZLJlD1s5rCZI77KitIbJYR0CGeWmRcWJ6svYg/exec';
  var REPORT_KEY = 'lud-91ycv8xzlczp';   // must match SECRET inside that script

  var TEXT = {
    en: {
      h1: 'Loading the background map…',
      h2: 'The background map is taking longer than usual. Your connection may be slow.',
      t:  'The background map is temporarily not working.',
      s:  'Ludara.AI is notified of this.',
      s3: 'You can still load all the place cards.',
      s4: 'You are seeing a simple map. Every place card and family tree still open. Click on the icons to open and read.',
      s5: 'You are seeing a simple map. Every place card still opens. Click on the icons to open and read.',
      b:  'Try again'
    },
    he: {
      h1: 'טוענים את מפת הרקע…',
      h2: 'טעינת מפת הרקע אורכת יותר מהרגיל. ייתכן שהחיבור איטי.',
      t:  'מפת הרקע אינה פועלת כרגע.',
      s:  'קיבלנו על כך התראה.',
      s3: 'עדיין אפשר לפתוח את כל כרטיסי המקומות.',
      s4: 'מוצגת מפה פשוטה. כל כרטיסי המקומות ועץ המשפחה עדיין נפתחים. אפשר ללחוץ על הסמלים כדי לפתוח ולקרוא.',
      s5: 'מוצגת מפה פשוטה. כל כרטיסי המקומות עדיין נפתחים. אפשר ללחוץ על הסמלים כדי לפתוח ולקרוא.',
      b:  'נסו שוב'
    },
    ru: {
      h1: 'Загружаем фоновую карту…',
      h2: 'Фоновая карта загружается дольше обычного. Возможно, соединение медленное.',
      t:  'Фоновая карта временно не работает.',
      s:  'Мы получили уведомление об этом.',
      s3: 'Карточки всех мест по-прежнему открываются.',
      s4: 'Показана упрощённая карта. Карточки всех мест и семейное древо по-прежнему открываются. Нажмите на значки, чтобы открыть и прочитать.',
      s5: 'Показана упрощённая карта. Карточки всех мест по-прежнему открываются. Нажмите на значки, чтобы открыть и прочитать.',
      b:  'Попробовать снова'
    },
    ar: {
      h1: 'جارٍ تحميل خريطة الخلفية…',
      h2: 'تحميل خريطة الخلفية يستغرق وقتا أطول من المعتاد. قد يكون الاتصال بطيئا.',
      t:  'خريطة الخلفية لا تعمل مؤقتا.',
      s:  'لقد تم إبلاغنا بذلك.',
      s3: 'لا يزال بإمكانك فتح جميع بطاقات الأماكن.',
      s4: 'تظهر خريطة مبسطة. ولا تزال جميع بطاقات الأماكن وشجرة العائلة تفتح. اضغط على الأيقونات لفتحها وقراءتها.',
      s5: 'تظهر خريطة مبسطة. ولا تزال جميع بطاقات الأماكن تفتح. اضغط على الأيقونات لفتحها وقراءتها.',
      b:  'حاول مرة أخرى'
    }
  };

  var T0 = Date.now();
  var shown = false, settled = false, errors = 0, hunting = 0;
  var sentHere = false, recoverySent = false, listBuilt = false, plainMap = false;
  var hintTimers = [];

  /* A short id so the sheet can pair a failure with its recovery. It is
     random, it lives for one browser session, and it identifies nobody. */
  function sessionId() {
    var v = '';
    try { v = sessionStorage.getItem('lud_sid') || ''; } catch (e) {}
    if (!v) {
      v = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
      try { sessionStorage.setItem('lud_sid', v); } catch (e) {}
    }
    return v;
  }
  var SID = sessionId();

  /* What the browser already knows about the connection. Chrome and the
     Android browsers report this, Safari does not, in which case it stays
     empty and the digest says so. */
  function connection() {
    try {
      var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!c) return '';
      var bits = [];
      if (c.effectiveType) bits.push(String(c.effectiveType));
      if (c.saveData) bits.push('data saver');
      return bits.join(' ');
    } catch (e) { return ''; }
  }

  function secondsSinceStart() { return Math.round((Date.now() - T0) / 1000); }

  /* Finding the map is fussier than it looks, and versions 1 and 2 got it
     wrong. The page holds the map in a global called `map`, but the map's
     container is <div id="map">, and a browser puts every id on the window
     object, so `window.map` is that DIV until the real map exists. Attaching
     to the div meant the load event never arrived, the notice never cleared,
     and at fifteen seconds a reader with a perfectly good map was told it was
     broken. So: take the real global first, and only accept something that
     behaves like a MapLibre map. */
  function currentMap() {
    var m = null;
    try { if (typeof map !== 'undefined' && map) m = map; } catch (e) {}
    if (!m) { try { m = window.map || null; } catch (e) { m = null; } }
    if (m && typeof m.on === 'function' && typeof m.isStyleLoaded === 'function') return m;
    return null;
  }

  function styleReady(m) {
    try { return !!(m && m.isStyleLoaded && m.isStyleLoaded()); } catch (e) { return false; }
  }

  function langCode() {
    var code = '';
    try { if (typeof LANG !== 'undefined' && LANG) code = String(LANG); } catch (e) {}
    if (!code) code = document.documentElement.getAttribute('lang') || 'en';
    return code.toLowerCase().slice(0, 2);
  }

  function words() { return TEXT[langCode()] || TEXT.en; }

  function isRTL() { return ['he', 'ar'].indexOf(langCode()) !== -1; }

  /* The family maps have a family tree and say so; the hotel guides and the
     book maps do not, and must not promise one. */
  function hasTree() {
    try { if (typeof FAMILY !== 'undefined' && FAMILY) return true; } catch (e) {}
    return false;
  }

  function hideSpinner() {
    var el = document.getElementById('loading');
    if (el) el.style.display = 'none';
  }

  /* ── 1. The places list, straight away ──────────────────────────────────
     These build the list, the filter chips and the region bar, and they touch
     only the DOM. The page normally runs them at the very end of map.on('load'),
     which is why a slow base map used to mean an empty panel as well as an
     empty map. Running them here costs nothing and the page runs them again
     when the map is ready. applyFilters and initFavourites are deliberately
     left to the map: they reach for markers and routes that do not exist yet. */
  function buildListNow() {
    if (listBuilt) return;
    listBuilt = true;
    runAll(['renderList', 'alignNbhdBar']);
  }

  /* The failure path wants everything, including the parts that touch the map,
     because by then the map is either plain or absent and the page will not
     run them itself. Each is called separately so one failure cannot stop the
     next. */
  function reviveWithoutMap() {
    runAll(['applyFilters', 'renderList', 'initFavourites', 'alignNbhdBar']);
  }

  function runAll(names) {
    for (var i = 0; i < names.length; i++) {
      try {
        var f = window[names[i]];
        if (typeof f === 'function') f();
      } catch (e) {}
    }
  }

  /* ── 2 and 3. A quiet word while they wait ──────────────────────────────
     Inside the page's own loading panel when there is one, so it reads as one
     message rather than two competing ones. Otherwise a small line of its own. */
  function hint(textKey) {
    if (shown || settled) return;
    var w = words();
    var msg = w[textKey];
    var el = document.getElementById('tile-hint');
    if (!el) {
      el = document.createElement('div');
      el.id = 'tile-hint';
      el.setAttribute('role', 'status');
      var host = document.getElementById('loading');
      var inPanel = host && getComputedStyle(host).display !== 'none';
      if (inPanel) {
        el.style.cssText = 'margin-top:10px;max-width:min(84vw,420px);opacity:.75;' +
          'font:400 13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center;';
        host.appendChild(el);
      } else {
        el.style.cssText = 'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);' +
          'z-index:999;max-width:min(88vw,440px);box-sizing:border-box;padding:8px 14px;' +
          'border-radius:999px;background:rgba(255,253,247,.94);color:#2c2a26;' +
          'border:1px solid #e0d6b8;box-shadow:0 2px 10px rgba(0,0,0,.10);' +
          'font:500 13px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center;';
        document.body.appendChild(el);
      }
      el.setAttribute('dir', isRTL() ? 'rtl' : 'ltr');
    }
    el.textContent = msg;
  }

  function clearHint() {
    var el = document.getElementById('tile-hint');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    for (var i = 0; i < hintTimers.length; i++) clearTimeout(hintTimers[i]);
    hintTimers = [];
  }

  /* ── 4. The plain map ───────────────────────────────────────────────────
     Land, coastlines and country borders from one small file of our own. No
     labels, because labels would need font files from the same service that is
     not answering. Swapping the style makes MapLibre fire load, so the page
     then does its own setup exactly as it would on a good day: markers, the
     journey line, the list, the filters. The reader gets a working map on a
     simpler background instead of an empty rectangle. */
  function plainStyle() {
    return {
      version: 8,
      sources: { plain: { type: 'geojson', data: PLAIN_MAP_URL } },
      layers: [
        { id: 'sea',    type: 'background', paint: { 'background-color': SEA } },
        { id: 'land',   type: 'fill', source: 'plain',
          filter: ['==', ['get', 'kind'], 'land'],
          paint: { 'fill-color': LAND } },
        { id: 'coast',  type: 'line', source: 'plain',
          filter: ['==', ['get', 'kind'], 'land'],
          paint: { 'line-color': INK, 'line-width': 0.9 } },
        { id: 'border', type: 'line', source: 'plain',
          filter: ['==', ['get', 'kind'], 'border'],
          paint: { 'line-color': INK, 'line-width': 0.7, 'line-opacity': 0.65,
                   'line-dasharray': [3, 2] } }
      ]
    };
  }

  function installPlainMap(m) {
    if (plainMap || !m || !m.setStyle) return false;
    try {
      m.setStyle(plainStyle());
      plainMap = true;
      return true;
    } catch (e) { return false; }
  }

  function send(payload) {
    if (!REPORT_URL) return;
    try {
      payload.k     = REPORT_KEY;
      payload.s     = SID;
      payload.title = (document.title || '').slice(0, 120);
      payload.page  = location.pathname;
      payload.host  = location.host;
      payload.at    = new Date().toISOString();
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) navigator.sendBeacon(REPORT_URL, body);
      else fetch(REPORT_URL, { method: 'POST', mode: 'no-cors', body: body });
    } catch (e) {}
  }

  function reportFailure(why) {
    if (sentHere) return;
    try {
      if (sessionStorage.getItem('tile_notice_sent')) return;   // already reported this session
      sessionStorage.setItem('tile_notice_sent', '1');
    } catch (e) {}
    sentHere = true;
    var ua = navigator.userAgent || '';
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    send({
      ev:     'failed',
      why:    plainMap ? (why + ', plain map') : why,
      waited: secondsSinceStart(),
      conn:   connection(),
      errs:   errors,
      device: /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop',
      tz:     tz,
      lang:   document.documentElement.getAttribute('lang') || navigator.language || '',
      screen: (screen.width || 0) + 'x' + (screen.height || 0),
      ua:     ua
    });
  }

  /* Only sent if this session reported a failure first, so it always has a row
     to pair with. It also covers the reader who pressed Try again and got a
     working map on the second go: that arrives as a recovery with reloaded set,
     because the seconds then count from the reload and not from the original
     attempt. A plain map is not a recovery and is never reported as one. */
  function reportRecovery() {
    if (recoverySent || plainMap) return;
    var prior = false;
    try { prior = !!sessionStorage.getItem('tile_notice_sent'); } catch (e) {}
    if (!sentHere && !prior) return;
    try {
      if (sessionStorage.getItem('tile_recovery_sent')) { recoverySent = true; return; }
      sessionStorage.setItem('tile_recovery_sent', '1');
    } catch (e) {}
    recoverySent = true;
    send({
      ev:       'recovered',
      after:    secondsSinceStart(),
      reloaded: sentHere ? 0 : 1,
      conn:     connection()
    });
  }

  function show(why) {
    if (shown || settled) return;
    var m = currentMap();
    if (styleReady(m)) return;
    shown = true;
    clearHint();

    var swapped = installPlainMap(m);
    reportFailure(why || 'timeout');
    hideSpinner();
    if (!swapped) reviveWithoutMap();   // with a plain map the page revives itself

    // If even the plain map could not be installed, at least the map area
    // should read as paper rather than as a void.
    if (!swapped) {
      var holder = document.getElementById('map');
      if (holder) holder.style.backgroundColor = PAPER;
    }

    var w = words();
    var rtl = isRTL();

    var box = document.createElement('div');
    box.id = 'tile-notice';
    box.setAttribute('role', 'status');
    box.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    box.style.cssText = [
      'position:fixed', 'top:50%', 'left:50%', 'transform:translate(-50%,-50%)',
      'z-index:1000', 'width:min(92vw,460px)', 'box-sizing:border-box',
      'background:#fffdf7', 'color:#2c2a26', 'border:1px solid #d9cfae',
      'border-radius:10px', 'box-shadow:0 6px 24px rgba(0,0,0,.18)',
      'padding:12px 14px',
      'font:500 14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
      'text-align:' + (rtl ? 'right' : 'left')
    ].join(';');

    var title = document.createElement('div');
    title.textContent = w.t;
    title.style.cssText = 'font-weight:700;margin-bottom:4px;';

    var sub = document.createElement('div');
    sub.style.cssText = 'font-weight:400;opacity:.85;';
    if (REPORT_URL) {
      var line1 = document.createElement('div');
      line1.textContent = w.s;
      sub.appendChild(line1);
    }
    var line2 = document.createElement('div');
    line2.textContent = swapped ? (hasTree() ? w.s4 : w.s5) : w.s3;
    sub.appendChild(line2);

    var row = document.createElement('div');
    row.style.cssText = 'margin-top:10px;display:flex;gap:8px;justify-content:' + (rtl ? 'flex-start' : 'flex-end') + ';';

    var retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = w.b;
    retry.style.cssText = 'font:600 13px/1 inherit;padding:7px 12px;border-radius:7px;border:1px solid #c8bb95;background:#f5edd8;color:#2c2a26;cursor:pointer;';
    retry.onclick = function () { location.reload(); };

    var close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';
    close.style.cssText = 'font:600 16px/1 inherit;padding:6px 11px;border-radius:7px;border:1px solid transparent;background:transparent;color:#2c2a26;cursor:pointer;opacity:.6;';
    close.onclick = function () { if (box.parentNode) box.parentNode.removeChild(box); };

    row.appendChild(retry);
    row.appendChild(close);
    box.appendChild(title);
    box.appendChild(sub);
    box.appendChild(row);
    document.body.appendChild(box);
  }

  function clear() {
    if (!settled) {
      settled = true;
      reportRecovery();
    }
    clearHint();
    var box = document.getElementById('tile-notice');
    if (box && box.parentNode) box.parentNode.removeChild(box);
  }

  function attach(m) {
    try {
      m.on('error', function () {
        errors++;
        if (errors >= ERROR_LIMIT && !styleReady(m) && !plainMap) show('errors');
      });
      m.on('load', function () { if (!plainMap) clear(); else clearHint(); });
      m.on('styledata', function () {
        if (styleReady(m)) { if (!plainMap) clear(); else clearHint(); }
      });
    } catch (e) {}
    hintTimers.push(setTimeout(function () { if (!styleReady(m)) hint('h1'); }, HINT_1_MS));
    hintTimers.push(setTimeout(function () { if (!styleReady(m)) hint('h2'); }, HINT_2_MS));
    setTimeout(function () { if (!styleReady(m)) show('timeout'); }, STYLE_TIMEOUT_MS);
  }

  function look() {
    var m = currentMap();
    if (m) { attach(m); return; }
    hunting += 150;
    if (hunting < FIND_MAP_MS) setTimeout(look, 150);
  }

  function start() {
    buildListNow();
    look();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
