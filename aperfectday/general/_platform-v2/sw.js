// A Perfect Day — Service Worker
// Caches the app shell (page + JS + CSS) on install so the guide loads
// offline after the very first visit, even without tapping "Save offline".
// Map tiles are cached on demand and persist for offline map use.

var SHELL_CACHE = 'apd-shell-v3';
var TILE_CACHE  = 'apd-tiles-v1';

// All files that make up the app shell.
// These are relative to the SW scope (the guide folder).
var SHELL_FILES = [
  './',
  './index.html',
  './data.js',
  './map.js',
  './photos.js',
  './map-core.js',
  './styles.css',
  './ui-card.js',
  './ui-filter.js',
  './ui-favourites.js',
  './ui-pdf.js',
  './ui-stories.js',
  './favicon.svg',
];

// ── INSTALL: cache the app shell immediately ───────────────────────
self.addEventListener('install', function(event) {
  self.skipWaiting(); // activate new SW immediately without waiting for old tabs
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function(cache) {
      // addAll fails silently per file — use individual puts so one missing
      // image doesn't break the whole cache
      return Promise.allSettled(
        SHELL_FILES.map(function(url) {
          return fetch(url).then(function(res) {
            if (res.ok) return cache.put(url, res);
          }).catch(function() {});
        })
      );
    })
  );
});

// ── ACTIVATE: claim all clients immediately ────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    // Delete old shell caches to free space
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) {
          return k.startsWith('apd-shell-') && k !== SHELL_CACHE;
        }).map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim(); // take control of all open tabs
    })
  );
});

// ── FETCH: serve from cache, fall back to network ─────────────────
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // ── Map tiles (MapTiler) ─────────────────────────────────────────
  // Cache tiles on first use; serve from cache when offline.
  if (url.includes('maptiler.com') || url.includes('api.maptiler')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          if (cached) return cached;
          return fetch(event.request).then(function(response) {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(function() {
            return new Response('', { status: 503, statusText: 'Offline' });
          });
        });
      })
    );
    return;
  }

  // ── OSRM routing ─────────────────────────────────────────────────
  // Don't cache routing requests — they need live data and are handled
  // gracefully by the offline route modal in index.html.
  if (url.includes('openstreetmap.de') || url.includes('osrm')) return;

  // ── External CDN (MapLibre, unpkg) ───────────────────────────────
  // Cache on first use; serve from cache when offline.
  if (url.includes('unpkg.com') || url.includes('cdnjs.')) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          if (cached) return cached;
          return fetch(event.request).then(function(response) {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(function() {
            return new Response('', { status: 503 });
          });
        });
      })
    );
    return;
  }

  // ── App shell + images ───────────────────────────────────────────
  // Cache first, update cache in background (stale-while-revalidate).
  // Falls back to index.html for navigation requests so the page
  // always loads offline.
  event.respondWith(
    caches.open(SHELL_CACHE).then(function(cache) {
      return cache.match(event.request).then(function(cached) {
        var networkFetch = fetch(event.request).then(function(response) {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        }).catch(function() {
          // Network failed — if we had a cached version return it,
          // otherwise return the cached index.html for navigation requests
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return cache.match('./index.html');
          }
          return new Response('', { status: 503 });
        });

        // Return cache immediately if available (fast), update in background
        return cached || networkFetch;
      });
    })
  );
});

// ── MESSAGE: handle saveForOffline trigger ────────────────────────
// The platform's ui-favourites.js sends a message when "Save offline"
// is tapped. We re-cache the shell to pick up any updates.
self.addEventListener('message', function(event) {
  if (!event.data) return;
  if (event.data.action === 'SAVE_OFFLINE' || event.data.type === 'CACHE_URLS') {
    caches.open(SHELL_CACHE).then(function(cache) {
      return Promise.allSettled(
        SHELL_FILES.map(function(url) {
          return fetch(url).then(function(res) {
            if (res.ok) return cache.put(url, res);
          }).catch(function() {});
        })
      );
    });
  }
});
