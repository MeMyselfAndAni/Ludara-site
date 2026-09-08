// A Perfect Day — Ludara / Ramat HaSharon
// map.js — guide-specific config

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [34.8395, 32.1466];   // lng, lat
const MAP_ZOOM          = 14;
const OFFLINE_CENTER    = { lat: 32.1466, lng: 34.8395 };
const GUIDE_CITY        = 'Ramat HaSharon';
const BLOGGER_NAME      = 'Ludara';
const GUIDE_TIMEZONE    = 'Asia/Jerusalem';

// ─── Category colours ────────────────────────────────────────────────────────
const CC = {
  'landmark': '#e8724a',
  'food':     '#f0c060',
  'cafe':     '#6b9e6e',
  'pub':      '#8b6bb1',
  'market':   '#c08060',
  'nature':   '#50906a',
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'landmark': 'Landmarks',
  'food':     'Restaurants',
  'cafe':     'Cafés',
  'pub':      'Bars',
  'market':   'Markets',
  'nature':   'Parks & Nature',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'sokolov': '#e8724a',
  'park':    '#50906a',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'sokolov': 'Sokolov & Center',
  'park':    'Parks & North',
};

// ─── Neighbourhood approximate centers ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'sokolov': { lat: 32.145617, lng: 34.839814 },
  'park':    { lat: 32.139039, lng: 34.845795  },
};

// ─── Map init ────────────────────────────────────────────────────────────────
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
    // Ignore transient tile fetch failures — these happen on network hiccups,
    // browser idle, or brief rate limits. Only fatal errors (bad API key etc) need UI.
    if (msg && (msg.includes('Failed to fetch') || msg.includes('fetch') || msg.includes('NetworkError') || msg.includes('Load failed'))) {
      console.warn('Map tile fetch failed (transient):', msg);
      return;
    }
    // Fatal error — show overlay
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:50%;left:5%;right:5%;transform:translateY(-50%);background:#900;color:#fff;padding:15px;border-radius:8px;z-index:999999;font-size:12px;font-family:monospace;cursor:pointer;';
    d.textContent = 'Map error: ' + msg + ' (tap to dismiss)';
    d.onclick = function() { d.remove(); };
    document.body.appendChild(d);
    setTimeout(function() { if (d.parentNode) d.remove(); }, 8000);
  });
  map.on('load', () => {
    try {
      document.getElementById('loading').style.display = 'none';
      map.getStyle().layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          try { map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:en'], ['get', 'name']]); } catch(e) {}
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
      if (el) { el.style.display = 'flex'; el.innerHTML = '<div style="color:red;padding:20px;font-size:12px;font-family:monospace;">ERROR: ' + err.message + '</div>'; }
      console.error('Map load error:', err);
    }
  });
}
// ⚠️ DO NOT call initMap() here


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
  var REPORT_URL = '';   // the /exec URL of the Ludara map alert Apps Script
  var REPORT_KEY = '';   // must match SECRET inside that script

  var TEXT = {
    en: { t: 'The background map is not loading on this network.', s: 'Everything else works. Open any place to read its story.', b: 'Try again' },
    he: { t: '\u05de\u05e4\u05ea \u05d4\u05e8\u05e7\u05e2 \u05d0\u05d9\u05e0\u05d4 \u05e0\u05d8\u05e2\u05e0\u05ea \u05d1\u05e8\u05e9\u05ea \u05d6\u05d5.', s: '\u05db\u05dc \u05d4\u05e9\u05d0\u05e8 \u05e4\u05d5\u05e2\u05dc. \u05d0\u05e4\u05e9\u05e8 \u05dc\u05e4\u05ea\u05d5\u05d7 \u05db\u05dc \u05de\u05e7\u05d5\u05dd \u05d5\u05dc\u05e7\u05e8\u05d5\u05d0 \u05d0\u05ea \u05d4\u05e1\u05d9\u05e4\u05d5\u05e8 \u05e9\u05dc\u05d5.', b: '\u05e0\u05e1\u05d5 \u05e9\u05d5\u05d1' },
    ru: { t: '\u0424\u043e\u043d\u043e\u0432\u0430\u044f \u043a\u0430\u0440\u0442\u0430 \u043d\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442\u0441\u044f \u0432 \u044d\u0442\u043e\u0439 \u0441\u0435\u0442\u0438.', s: '\u0412\u0441\u0451 \u043e\u0441\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442. \u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043b\u044e\u0431\u043e\u0435 \u043c\u0435\u0441\u0442\u043e, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c \u0435\u0433\u043e \u0438\u0441\u0442\u043e\u0440\u0438\u044e.', b: '\u041f\u043e\u043f\u0440\u043e\u0431\u043e\u0432\u0430\u0442\u044c \u0441\u043d\u043e\u0432\u0430' },
    ar: { t: '\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u062e\u0644\u0641\u064a\u0629 \u0644\u0627 \u064a\u062a\u0645 \u062a\u062d\u0645\u064a\u0644\u0647\u0627 \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0634\u0628\u0643\u0629.', s: '\u0643\u0644 \u0634\u064a\u0621 \u0622\u062e\u0631 \u064a\u0639\u0645\u0644. \u0627\u0641\u062a\u062d \u0623\u064a \u0645\u0643\u0627\u0646 \u0644\u0642\u0631\u0627\u0621\u0629 \u0642\u0635\u062a\u0647.', b: '\u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649' }
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
      var body = JSON.stringify({
        k: REPORT_KEY,
        page: location.pathname,
        host: location.host,
        lang: document.documentElement.getAttribute('lang') || '',
        ua: navigator.userAgent,
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
    sub.textContent = w.s;
    sub.style.cssText = 'font-weight:400;opacity:.85;';

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
