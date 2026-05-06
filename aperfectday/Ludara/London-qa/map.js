// A Perfect Day — London (neutral city guide)
// map.js — guide-specific config
// v4 — May 2026: New six-category structure: art, shop, royal, film, dining, pub

const MAPTILER_KEY      = 'V3bgGWhyO1Rik6g1non6';
const MAP_CENTER        = [-0.1278, 51.5074];   // [longitude, latitude]
const MAP_ZOOM          = 12;
const OFFLINE_CENTER    = { lat: 51.5074, lng: -0.1278 };
const GUIDE_CITY        = 'London';
const BLOGGER_NAME      = 'A Perfect Day';
const GUIDE_TIMEZONE    = 'Europe/London';

// ─── Category colours ─────────────────────────────────────────────────────────
const CC = {
  'art':    '#e8724a',   // terracotta — galleries & design
  'shop':   '#9a7b5a',   // warm tan — retail & markets
  'royal':  '#6090c8',   // royal blue — Crown connections
  'film':   '#4a5578',   // dark slate — movie locations
  'dining': '#f0c060',   // golden amber — fine dining
  'pub':    '#8b6bb1',   // purple — pubs & bars
};

// ─── Category labels ──────────────────────────────────────────────────────────
const CL = {
  'art':    'Art & Design',
  'shop':   'Shop',
  'royal':  'Royal London',
  'film':   'From the Movies',
  'dining': 'Fine Dining',
  'pub':    'Pubs & Bars',
};

// ─── Neighbourhood colours ────────────────────────────────────────────────────
const NBHD_COLORS = {
  'westminster':   '#e8724a',
  'southbank':     '#f0c060',
  'borough':       '#6b9e6e',
  'city':          '#6090c8',
  'covent-garden': '#c08060',
  'camden':        '#9080a8',
  'notting-hill':  '#50906a',
  'kensington':    '#d4a043',
  'greenwich':     '#4a90d9',
  'shoreditch':    '#e85b7a',
};

// ─── Neighbourhood display labels ─────────────────────────────────────────────
const NBHD_LABELS = {
  'westminster':   'Westminster',
  'southbank':     'South Bank',
  'borough':       'Borough & Bermondsey',
  'city':          'The City',
  'covent-garden': 'Covent Garden & Soho',
  'camden':        'Camden & King\'s Cross',
  'notting-hill':  'Notting Hill',
  'kensington':    'Kensington',
  'greenwich':     'Greenwich',
  'shoreditch':    'Shoreditch & Spitalfields',
};

// ─── Neighbourhood approximate centres ───────────────────────────────────────
const NBHD_APPROX_CENTERS = {
  'westminster':   { lat: 51.5012, lng: -0.1340 },
  'southbank':     { lat: 51.5065, lng: -0.1085 },
  'borough':       { lat: 51.5020, lng: -0.0840 },
  'city':          { lat: 51.5095, lng: -0.0875 },
  'covent-garden': { lat: 51.5122, lng: -0.1290 },
  'camden':        { lat: 51.5370, lng: -0.1420 },
  'notting-hill':  { lat: 51.5165, lng: -0.2010 },
  'kensington':    { lat: 51.4970, lng: -0.1740 },
  'greenwich':     { lat: 51.4820, lng: -0.0030 },
  'shoreditch':    { lat: 51.5230, lng: -0.0750 },
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

  map.on('error', function(e) {
    var msg = e.error ? e.error.message : JSON.stringify(e);
    if (msg && (msg.includes('Failed to fetch') || msg.includes('fetch') ||
                msg.includes('NetworkError') || msg.includes('Load failed'))) {
      console.warn('Map tile fetch failed (transient):', msg);
      return;
    }
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;top:50%;left:5%;right:5%;transform:translateY(-50%);background:#900;color:#fff;padding:15px;border-radius:8px;z-index:999999;font-size:12px;font-family:monospace;cursor:pointer;';
    d.textContent = 'Map error: ' + msg + ' (tap to dismiss)';
    d.onclick = function() { d.remove(); };
    document.body.appendChild(d);
    setTimeout(function() { if (d.parentNode) d.remove(); }, 8000);
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
// ⚠️ DO NOT call initMap() here
