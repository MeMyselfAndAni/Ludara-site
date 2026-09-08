// A Perfect Day — ZenKimchi / Seoul
// map.js — guide-specific config
// Only this file + index.html + data.js + images/ live permanently in the guide folder.
//
// ⚠️  CHECKLIST before deploying:
//   [x] MAP_CENTER set to [lng, lat] of Seoul city centre (longitude FIRST)
//   [x] GUIDE_CITY and BLOGGER_NAME filled in
//   [x] CC and CL both present (both required — map-core.js will throw without them)
//   [x] NBHD_COLORS, NBHD_LABELS, NBHD_APPROX_CENTERS all have matching keys
//   [x] Neighbourhood keys here match data.js nbhd values AND index.html bubble IDs
//   [x] initMap() is NOT called at the bottom of this file
//   [x] FAVS_KEY is NOT declared here (it lives in ui-favourites.js)

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [126.9780, 37.5640];   // [longitude, latitude] — central Seoul
const MAP_ZOOM          = 12;
const OFFLINE_CENTER    = { lat: 37.5640, lng: 126.9780 };
const GUIDE_CITY        = 'Seoul';
const BLOGGER_NAME      = 'Joe';
const GUIDE_TIMEZONE    = 'Asia/Seoul';

// ─── Category colours ─────────────────────────────────────────────────────────
// ⚠️ REQUIRED — map-core.js throws "CC is not defined" without this
const CC = {
  'food':     '#e8724a',   // restaurants
  'pub':      '#d4a043',   // chicken hofs, bars
  'market':   '#6b9e6e',   // markets, street food
  'cafe':     '#8b6bb1',   // cafés, dessert
  'landmark': '#6090c8',   // unique experiences (spa, etc.)
  'church':   '#c08060',   // temples (unused but kept for map-core compatibility)
  'soviet':   '#9080a8',   // unused
  'nature':   '#50906a',   // unused
};

// ─── Category labels ──────────────────────────────────────────────────────────
// ⚠️ REQUIRED — map-core.js throws "CL is not defined" without this
const CL = {
  'food':     'Restaurants',
  'pub':      'Chicken & Bars',
  'market':   'Markets & Street Food',
  'cafe':     'Cafés',
  'landmark': 'Experiences',
  'church':   'Temples',
  'soviet':   'Soviet',
  'nature':   'Nature',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'nbhd-mapo':       '#e8724a',
  'nbhd-hongdae':    '#d4a043',
  'nbhd-jongno':     '#6b9e6e',
  'nbhd-euljiro':    '#8b6bb1',
  'nbhd-itaewon':    '#6090c8',
  'nbhd-gangnam':    '#c08060',
  'nbhd-noryangjin': '#50906a',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'nbhd-mapo':       'Mapo & Gongdeok',
  'nbhd-hongdae':    'Hongdae & Mangwon',
  'nbhd-jongno':     'Jongno & Insadong',
  'nbhd-euljiro':    'Euljiro & Myeongdong',
  'nbhd-itaewon':    'Itaewon & Yongsan',
  'nbhd-gangnam':    'Gangnam & Jamsil',
  'nbhd-noryangjin': 'Noryangjin & Yeouido',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'nbhd-mapo':       { lat: 37.5468, lng: 126.9515 },
  'nbhd-hongdae':    { lat: 37.5566, lng: 126.9235 },
  'nbhd-jongno':     { lat: 37.5745, lng: 126.9860 },
  'nbhd-euljiro':    { lat: 37.5640, lng: 126.9900 },
  'nbhd-itaewon':    { lat: 37.5345, lng: 126.9940 },
  'nbhd-gangnam':    { lat: 37.5100, lng: 127.0400 },
  'nbhd-noryangjin': { lat: 37.5145, lng: 126.9430 },
};

// ─── Map initialisation ───────────────────────────────────────────────────────
// ⚠️ DEFINE initMap() here but DO NOT CALL IT.
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

  map.on('error', function(e) {
    var msg = e.error ? e.error.message : JSON.stringify(e);
    if (msg && (msg.includes('Failed to fetch') || msg.includes('fetch') ||
                msg.includes('NetworkError') || msg.includes('Load failed'))) {
      console.warn('Map tile fetch failed (transient):', msg);
      return;
    }
    // Was: a red developer overlay printing the raw error, including the tile
    // URL with the API key in it. Removed 8 September 2026. Readers should
    // never see that, and the tile notice below now explains a failed base map
    // in plain language. Keep this in the console for us.
    console.warn('Map error:', msg);
  });

  map.on('load', () => {
    try {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';

      // Force English labels on all map tiles
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try {
            map.setLayoutProperty(layer.id, 'text-field', [
              'coalesce', ['get', 'name:en'], ['get', 'name'],
            ]);
          } catch(e) { /* safe to ignore */ }
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


/* ─── LUDARA_TILE_NOTICE_V1 ────────────────────────────────────────────────
   Base map availability notice. Added 8 September 2026.

   The base map imagery comes from api.maptiler.com, which sits on Cloudflare.
   A network that cannot reach it gets no error from MapLibre at all: the map
   simply never draws and the reader is left looking at an empty rectangle
   with no explanation. This happened on Maria's own home network on
   8 September 2026 and took a whole day to identify.

   Nothing else on the page depends on the tiles. Markers, place cards,
   photographs, search and the story path all keep working, so the right
   behaviour is to say so plainly and carry on, not to fail silently.

   Self contained on purpose. It adds no files, no styles and no
   dependencies, so it can be dropped into any map unchanged.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var STYLE_TIMEOUT_MS = 15000;   // how long the base map may take before we speak
  var FIND_MAP_MS      = 60000;  // how long to keep looking for the map object
  var ERROR_LIMIT      = 4;      // failed requests that also trigger the notice
  var PAPER            = '#f5edd8';

  // Quiet reporting, off until a URL is filled in below.
  // Point it at a Google Apps Script web app that writes a row to a sheet and
  // mails Maria a daily digest. The URL is just a script id: it carries no
  // email address and no phone number, so nothing personal is exposed to the
  // reader. Fires at most once per browser session.
  var REPORT_URL = 'https://script.google.com/macros/s/AKfycbzOtGuFCSX0ut-fzRYh_OgODb9BkMtQ1ZLJlD1s5rCZI77KitIbJYR0CGeWmRcWJ6svYg/exec';   // the /exec URL of the Ludara map alert Apps Script
  var REPORT_KEY = 'lud-91ycv8xzlczp';   // must match SECRET inside that script

  var TEXT = {
    en: { t: 'The background map is temporarily not working.', s: 'Ludara.AI is notified of this.', s3: 'You can still load all the place cards.', b: 'Try again' },
    he: { t: 'מפת הרקע אינה פועלת כרגע.', s: 'קיבלנו על כך התראה.', s3: 'עדיין אפשר לפתוח את כל כרטיסי המקומות.', b: 'נסו שוב' },
    ru: { t: 'Фоновая карта временно не работает.', s: 'Мы получили уведомление об этом.', s3: 'Карточки всех мест по-прежнему открываются.', b: 'Попробовать снова' },
    ar: { t: 'خريطة الخلفية لا تعمل مؤقتا.', s: 'لقد تم إبلاغنا بذلك.', s3: 'لا يزال بإمكانك فتح جميع بطاقات الأماكن.', b: 'حاول مرة أخرى' }
  };

  var shown = false, settled = false, errors = 0, waited = 0;

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

  function report() {
    if (!REPORT_URL) return;
    try {
      if (sessionStorage.getItem('tile_notice_sent')) return;
      sessionStorage.setItem('tile_notice_sent', '1');
    } catch (e) {}
    try {
      var ua = navigator.userAgent || '';
      var tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e2) {}
      var body = JSON.stringify({
        k: REPORT_KEY,
        title: (document.title || '').slice(0, 120),
        page: location.pathname,
        host: location.host,
        device: /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop',
        tz: tz,
        lang: document.documentElement.getAttribute('lang') || navigator.language || '',
        screen: (screen.width || 0) + 'x' + (screen.height || 0),
        ua: ua,
        at: new Date().toISOString()
      });
      if (navigator.sendBeacon) navigator.sendBeacon(REPORT_URL, body);
      else fetch(REPORT_URL, { method: 'POST', mode: 'no-cors', body: body });
    } catch (e) {}
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

  function show() {
    if (shown || settled) return;
    var m = currentMap();
    if (styleReady(m)) return;
    shown = true;

    report();
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
    close.textContent = '\u00d7';
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
    settled = true;
    var box = document.getElementById('tile-notice');
    if (box && box.parentNode) box.parentNode.removeChild(box);
  }

  function attach(m) {
    try {
      m.on('error', function () {
        errors++;
        if (errors >= ERROR_LIMIT && !styleReady(m)) show();
      });
      m.on('load', clear);
      m.on('styledata', function () { if (styleReady(m)) clear(); });
    } catch (e) {}
    setTimeout(function () { if (!styleReady(m)) show(); }, STYLE_TIMEOUT_MS);
  }

  function look() {
    var m = currentMap();
    if (m) { attach(m); return; }
    waited += 150;
    if (waited < FIND_MAP_MS) setTimeout(look, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', look);
  } else {
    look();
  }
})();
