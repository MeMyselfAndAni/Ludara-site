// A Perfect Day — Service Worker v4
// CACHE FIRST everywhere except OSRM routing.
// If a resource is in cache, return it IMMEDIATELY — no network request.
// This prevents the 60-second hang when offline.

var SHELL_CACHE = 'apd-shell-v5';
var TILE_CACHE  = 'apd-tiles-v1';

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

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function(cache) {
      return Promise.allSettled(
        SHELL_FILES.map(function(url) {
          return fetch(url, { cache: 'reload' }).then(function(res) {
            if (res.ok) return cache.put(url, res);
          }).catch(function() {});
        })
      );
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) {
          return k.startsWith('apd-shell-') && k !== SHELL_CACHE;
        }).map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  var url = event.request.url;

  // OSRM routing — never intercept, page handles offline gracefully
  if (url.includes('openstreetmap.de') || url.includes('/routed-')) return;

  // MapTiler tiles — cache first, then network
  if (url.includes('maptiler.com') || url.includes('api.maptiler')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          if (cached) return cached;
          return fetch(event.request).then(function(res) {
            if (res.ok) cache.put(event.request, res.clone());
            return res;
          }).catch(function() {
            return new Response('', { status: 503 });
          });
        });
      })
    );
    return;
  }

  // App shell + CDN + images: CACHE FIRST
  // If in cache: return immediately, background-refresh only if online.
  // If not cached: fetch, cache, return.
  event.respondWith(
    caches.open(SHELL_CACHE).then(function(cache) {
      return cache.match(event.request).then(function(cached) {
        if (cached) {
          if (navigator.onLine) {
            fetch(event.request).then(function(res) {
              if (res && res.ok) cache.put(event.request, res);
            }).catch(function() {});
          }
          return cached;
        }
        return fetch(event.request).then(function(res) {
          if (res && res.ok) cache.put(event.request, res.clone());
          return res;
        }).catch(function() {
          if (event.request.mode === 'navigate') {
            return cache.match('./index.html');
          }
          return new Response('', { status: 503 });
        });
      });
    })
  );
});

self.addEventListener('message', function(event) {
  if (!event.data) return;
  if (event.data.action === 'SAVE_OFFLINE' || event.data.type === 'CACHE_URLS') {
    caches.open(SHELL_CACHE).then(function(cache) {
      Promise.allSettled(
        SHELL_FILES.map(function(url) {
          return fetch(url, { cache: 'reload' }).then(function(res) {
            if (res.ok) return cache.put(url, res);
          }).catch(function() {});
        })
      );
    });
  }
});
