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
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'pavilion': 'Pavilions',
  'hall':     'Exhibition Halls',
  'heritage': 'Heritage',
  'outdoor':  'Gardens & Outdoor',
  'service':  'Services',
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
