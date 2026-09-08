// A Perfect Day — MUZA, Eretz Israel Museum (Tel Aviv)
// map.js — guide-specific config
// Internal visitor map of the museum campus: pavilions, halls, heritage sites,
// gardens and services, with current exhibitions. Bilingual EN / HE.
//
// Five categories: Pavilions · Exhibition Halls · Heritage · Gardens & Outdoor · Services
// Three campus zones: east (eastern pavilions) · core (central core) · park (western park)
//
// ⚠️  Keys in NBHD_* objects, the zone bubbles in index.html, and the
//      nbhd field in data.js MUST ALL match exactly.

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [34.79595, 32.10210];   // [longitude, latitude] — centre of the museum grounds
const MAP_ZOOM          = 16.6;
const OFFLINE_CENTER    = { lat: 32.10210, lng: 34.79595 };
const GUIDE_CITY        = 'Eretz Israel Museum';
const BLOGGER_NAME      = 'A Perfect Day';
const GUIDE_TIMEZONE    = 'Asia/Jerusalem';
const DISTANCE_UNITS    = 'metric';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'pavilion': '#9e2b25',   // burgundy — permanent collection pavilions
  'hall':     '#c8761b',   // amber — temporary-exhibition halls
  'heritage': '#7a5230',   // brown — archaeology & heritage sites
  'outdoor':  '#3f7d4e',   // green — gardens, park, open-air
  'service':  '#3a6ea5',   // blue — entrance, tickets, shop, café, planetarium
  'restroom': '#5b7b8a',   // slate — public restrooms
  'event':    '#6a4c93',   // violet — current temporary exhibitions
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'pavilion': 'Pavilions',
  'hall':     'Exhibition Halls',
  'heritage': 'Heritage',
  'outdoor':  'Gardens & Outdoor',
  'service':  'Services',
  'restroom': 'Restrooms',
  'event':    'What\'s On',
};

// ─── Zone ("neighbourhood") colours ───────────────────────────────────────────
const NBHD_COLORS = {
  'east': '#9e2b25',
  'core': '#c8761b',
  'park': '#3f7d4e',
};

// ─── Zone display labels ──────────────────────────────────────────────────────
const NBHD_LABELS = {
  'east': 'Eastern Pavilions',
  'core': 'Central Core',
  'park': 'Western Park',
};

// ─── Zone approximate centres ────────────────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'east': { lat: 32.10265, lng: 34.79755 },
  'core': { lat: 32.10230, lng: 34.79575 },
  'park': { lat: 32.10140, lng: 34.79440 },
};

// ─── Basemap label language ──────────────────────────────────────────────────
// Hebrew mode → prefer Hebrew street/place names; English mode → Latin/English.
function setBasemapLang(lang) {
  if (typeof map === 'undefined' || !map || !map.getStyle) return;
  var expr;
  if (lang === 'he')      expr = ['coalesce', ['get', 'name:he'], ['get', 'name'], ['get', 'name:en']];
  else if (lang === 'ru') expr = ['coalesce', ['get', 'name:ru'], ['get', 'name:en'], ['get', 'name']];
  else if (lang === 'ar') expr = ['coalesce', ['get', 'name:ar'], ['get', 'name:en'], ['get', 'name']];
  else                    expr = ['coalesce', ['get', 'name:en'], ['get', 'name']];
  try {
    var layers = map.getStyle().layers || [];
    layers.forEach(function (layer) {
      if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
        try { map.setLayoutProperty(layer.id, 'text-field', expr); } catch (e) {}
      }
    });
  } catch (e) {}
}

// ─── Map initialisation ───────────────────────────────────────────────────────
function initMap() {
  // RTL text plugin — MapLibre cannot shape/order Hebrew & Arabic base-map labels
  // without this; otherwise the tile labels render with letters reversed.
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
  map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    minZoom: 12,
    maxZoom: 19,
    // No maxBounds — the map pans freely in every direction so you can recentre on any pavilion.
    attributionControl: false,
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

  map.on('error', function() {
    // Silent reload — client sees nothing, transient errors self-heal
    setTimeout(function() { location.reload(); }, 2000);
  });

  map.on('load', () => {
    try {
      const loadingEl = document.getElementById('loading');
      if (loadingEl) loadingEl.style.display = 'none';

      if (typeof setBasemapLang === 'function') setBasemapLang(typeof getLang === 'function' ? getLang() : 'he');

      if (typeof applyLang === 'function' && typeof getLang === 'function') applyLang(getLang());
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
