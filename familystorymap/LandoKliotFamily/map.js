// A Perfect Story Map: Family Edition
// map.js: SHARED ENGINE FILE. Identical in every family map.
//
// Everything family-specific lives in family.js, which must load BEFORE this file.
// If you find yourself typing a family name, a branch key or a region name in
// here, it belongs in family.js instead. That is exactly how a previous family's
// names used to survive into a new map.
//
// ⚠️  FAMILY.regions[].key, the region bubbles in index.html, and the `nbhd`
//     field in data.js MUST ALL match exactly. _tools/check-map.js verifies this.

const MAPTILER_KEY   = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER     = FAMILY.map.center;              // [lng, lat]
const MAP_ZOOM       = FAMILY.map.zoom;
const OFFLINE_CENTER = { lat: FAMILY.map.center[1], lng: FAMILY.map.center[0] };
const GUIDE_CITY     = 'Family Journey';
const BLOGGER_NAME   = 'Family Story Map';
const GUIDE_TIMEZONE = FAMILY.map.timezone;

// ─── Story threads: colours and labels, in the order family.js lists them ─────
const CC = {}, CL = {}, THREAD_TINT = {};
FAMILY.threads.forEach(function(t){ CC[t.key] = t.color; CL[t.key] = t.label; THREAD_TINT[t.key] = t.tint; });

// ─── Regions ──────────────────────────────────────────────────────────────────
const NBHD_COLORS = {}, NBHD_LABELS = {}, NBHD_APPROX_CENTERS = {}, NBHD_MIN_RADIUS = {};
FAMILY.regions.forEach(function(r){
  NBHD_COLORS[r.key]         = r.color;
  NBHD_LABELS[r.key]         = r.label;
  NBHD_APPROX_CENTERS[r.key] = r.center;
  // Country-sized regions: without a minimum, a region holding a single place
  // would be drawn at the city-guide default of 80 m and be invisible.
  NBHD_MIN_RADIUS[r.key]     = r.minRadius || 120000;
});

// ─── Region circle override ───────────────────────────────────────────────────
// map-core's buildNbhdCircles() is tuned for city-sized districts; these regions
// span whole countries. Use ALL places per region with a large minimum radius.
function buildNbhdCircles() {
  const circles = [];
  for (const [nbhd, color] of Object.entries(NBHD_COLORS)) {
    const approxCenter = NBHD_APPROX_CENTERS[nbhd];
    const ps = PLACES.filter(p => p.nbhd === nbhd);   // no outlier cut, regions are large by design
    const minR = NBHD_MIN_RADIUS[nbhd] || 80;

    if (ps.length === 0) {
      circles.push({ id:nbhd, lat:approxCenter.lat, lng:approxCenter.lng, radius:minR, color });
    } else {
      const clat = ps.reduce((s,p)=>s+p.lat,0)/ps.length;
      const clng = ps.reduce((s,p)=>s+p.lng,0)/ps.length;
      const maxDist = Math.max(...ps.map(p => _haversineM({lat:clat,lng:clng}, p)));
      const radius = Math.max(maxDist * 1.20, minR);
      circles.push({ id:nbhd, lat:clat, lng:clng, radius, color });
    }
  }
  return circles;
}

// ─── Right-to-left place names ────────────────────────────────────────────────
// MapLibre cannot shape or order Hebrew and Arabic base-map labels without this
// plugin; without it the tile labels render with their letters reversed
// (מונגוליה came out as הילוגנומ). Same call, same guard and same lazy flag that
// already fixed this on the MUZA guide.
function _enableRTLMapText() {
  try {
    if (typeof maplibregl.getRTLTextPluginStatus !== 'function' ||
        maplibregl.getRTLTextPluginStatus() === 'unavailable') {
      maplibregl.setRTLTextPlugin(
        '/assets/vendor/mapbox-gl-rtl-text-0.2.3/mapbox-gl-rtl-text.min.js',
        null,
        true   // lazy: load when RTL text is first needed
      );
    }
  } catch (e) {}
}

// ─── Map initialisation ───────────────────────────────────────────────────────
function initMap() {
  _enableRTLMapText();
  map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    attributionControl: false,
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

  map.on('error', function() {
    // Silent reload: client sees nothing, transient errors self-heal
    setTimeout(function() { location.reload(); }, 2000);
  });

  map.on('load', () => {
    try {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';

      // Every label used to be pinned to name:en here, so the map stayed in
      // English however the reader had set the page. setMapLanguage() in
      // map-core.js does the same job for whichever language is active, and
      // lang.js calls it again on every switch.
      setMapLanguage((typeof LANG !== 'undefined' && LANG) || 'en');

      NBHD_CIRCLES = buildNbhdCircles();
      initMapSources();
      if (map.getSource('trip-route')) {
        map.getSource('trip-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } });
      }

      PLACES.forEach(p => addMarker(p));

      // Open showing the WHOLE journey: Belarus to the Urals to Israel on one
      // screen (Chita stretches it east; the Family Path then refits to the path).
      const storyBounds = new maplibregl.LngLatBounds();
      PLACES.forEach(p => storyBounds.extend([p.lng, p.lat]));
      const _isMobile = window.innerWidth < 768;
      map.fitBounds(storyBounds, {
        padding: _isMobile
          ? { top: 140, bottom: 190, left: 40,  right: 40 }
          : { top: 190, bottom: 230, left: 120, right: 120 },
        duration: 0,
      });

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
// ⚠️ DO NOT call initMap() here


/* ─── LUDARA_TILE_NOTICE_V2 ────────────────────────────────────────────────
   Base map availability notice. Added 8 September 2026, revised 10 September.

   The base map imagery comes from api.maptiler.com, which sits on Cloudflare.
   A network that cannot reach it gets no error from MapLibre at all: the map
   simply never draws and the reader is left looking at an empty rectangle
   with no explanation. This happened on Maria's own home network on
   8 September 2026 and took a whole day to identify.

   Nothing else on the page depends on the tiles. Markers, place cards,
   photographs, search and the story path all keep working, so the right
   behaviour is to say so plainly and carry on, not to fail silently.

   Version 2 answers the question version 1 could not. The notice already
   removes itself if the base map turns up late, but the report had already
   been sent, so a reader who waited eighteen seconds and then had a perfect
   map looked exactly like a reader who never got a map at all. Version 2
   sends a second, tiny message when the map recovers, and records why the
   notice fired, how long it had waited, and what kind of connection the
   reader is on. All of it is already in the browser's own memory. Nothing
   is asked of the reader and no location is collected.

   Self contained on purpose. It adds no files, no styles and no
   dependencies, so it can be dropped into any map unchanged.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var STYLE_TIMEOUT_MS = 15000;  // how long the base map may take before we speak
  var FIND_MAP_MS      = 60000;  // how long to keep looking for the map object
  var ERROR_LIMIT      = 4;      // failed requests that also trigger the notice
  var PAPER            = '#f5edd8';

  // Quiet reporting, off until a URL is filled in below.
  // Point it at a Google Apps Script web app that writes a row to a sheet and
  // mails Maria a daily digest. The URL is just a script id: it carries no
  // email address and no phone number, so nothing personal is exposed to the
  // reader. Fires at most once per browser session, plus one recovery ping.
  var REPORT_URL = 'https://script.google.com/macros/s/AKfycbzOtGuFCSX0ut-fzRYh_OgODb9BkMtQ1ZLJlD1s5rCZI77KitIbJYR0CGeWmRcWJ6svYg/exec';   // the /exec URL of the Ludara map alert Apps Script
  var REPORT_KEY = 'lud-91ycv8xzlczp';   // must match SECRET inside that script

  var TEXT = {
    en: { t: 'The background map is temporarily not working.', s: 'Ludara.AI is notified of this.', s3: 'You can still load all the place cards.', b: 'Try again' },
    he: { t: 'מפת הרקע אינה פועלת כרגע.', s: 'קיבלנו על כך התראה.', s3: 'עדיין אפשר לפתוח את כל כרטיסי המקומות.', b: 'נסו שוב' },
    ru: { t: 'Фоновая карта временно не работает.', s: 'Мы получили уведомление об этом.', s3: 'Карточки всех мест по-прежнему открываются.', b: 'Попробовать снова' },
    ar: { t: 'خريطة الخلفية لا تعمل مؤقتا.', s: 'لقد تم إبلاغنا بذلك.', s3: 'لا يزال بإمكانك فتح جميع بطاقات الأماكن.', b: 'حاول مرة أخرى' }
  };

  var T0 = Date.now();
  var shown = false, settled = false, errors = 0, hunting = 0;
  var sentHere = false, recoverySent = false;

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

  function secondsSinceStart() {
    return Math.round((Date.now() - T0) / 1000);
  }

  function currentMap() {
    try { if (typeof map !== 'undefined' && map) return map; } catch (e) {}
    try { if (window.map) return window.map; } catch (e) {}
    return null;
  }

  function styleReady(m) {
    try { return !!(m && m.isStyleLoaded && m.isStyleLoaded()); } catch (e) { return false; }
  }

  function words() {
    var code = '';
    try { if (typeof LANG !== 'undefined' && LANG) code = String(LANG); } catch (e) {}
    if (!code) code = document.documentElement.getAttribute('lang') || 'en';
    code = code.toLowerCase().slice(0, 2);
    return TEXT[code] || TEXT.en;
  }

  function hideSpinner() {
    var el = document.getElementById('loading');
    if (el) el.style.display = 'none';
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
      why:    why,                    // 'timeout' or 'errors'
      waited: secondsSinceStart(),    // seconds the reader had waited
      conn:   connection(),
      errs:   errors,
      device: /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop',
      tz:     tz,
      lang:   document.documentElement.getAttribute('lang') || navigator.language || '',
      screen: (screen.width || 0) + 'x' + (screen.height || 0),
      ua:     ua
    });
  }

  /* The whole point of version 2. Only sent if this session reported a
     failure first, so it always has a row to pair with. It also covers the
     reader who pressed Try again and got a working map on the second go:
     that arrives as a recovery with reloaded set, because the seconds then
     count from the reload and not from the original attempt. */
  function reportRecovery() {
    if (recoverySent) return;
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

  /* The page builds its list, filters and favourites inside map.on('load'),
     which never fires when the style cannot be fetched. So the reader was
     left with an empty panel as well as an empty map. These four functions
     touch only the DOM, so we can run them ourselves and give back the
     places, the filter chips and the saved list. */
  function reviveWithoutMap() {
    var fns = ['applyFilters', 'renderList', 'initFavourites', 'alignNbhdBar'];
    for (var i = 0; i < fns.length; i++) {
      try {
        var f = window[fns[i]];
        if (typeof f === 'function') f();
      } catch (e) {}
    }
  }

  function show(why) {
    if (shown || settled) return;
    var m = currentMap();
    if (styleReady(m)) return;
    shown = true;

    reportFailure(why || 'timeout');
    hideSpinner();
    reviveWithoutMap();

    // Make the empty map read as paper rather than a void.
    var holder = document.getElementById('map');
    if (holder) holder.style.backgroundColor = PAPER;

    var w = words();
    var rtl = ['he', 'ar'].indexOf((document.documentElement.getAttribute('lang') || 'en').toLowerCase().slice(0, 2)) !== -1;

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
    line2.textContent = w.s3;
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
    var box = document.getElementById('tile-notice');
    if (box && box.parentNode) box.parentNode.removeChild(box);
  }

  function attach(m) {
    try {
      m.on('error', function () {
        errors++;
        if (errors >= ERROR_LIMIT && !styleReady(m)) show('errors');
      });
      m.on('load', clear);
      m.on('styledata', function () { if (styleReady(m)) clear(); });
    } catch (e) {}
    setTimeout(function () { if (!styleReady(m)) show('timeout'); }, STYLE_TIMEOUT_MS);
  }

  function look() {
    var m = currentMap();
    if (m) { attach(m); return; }
    hunting += 150;
    if (hunting < FIND_MAP_MS) setTimeout(look, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', look);
  } else {
    look();
  }
})();
