// sw.js — Service Worker for offline map support (MapLibre + MapTiler)
const APP_CACHE  = 'tbilisi-app-v2';
const TILE_CACHE = 'maptiler-tiles-v1';

const APP_FILES = [
  './', './index.html', './data.js', './map.js', './styles.css',
  './photos.js', './ui-card.js', './ui-filter.js', './ui-favourites.js',
  './ui-pdf.js', './ui-stories.js', './favicon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== APP_CACHE && k !== TILE_CACHE)
        .map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Skip non-http requests (chrome-extension etc.)
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // MapTiler tiles + style + fonts + sprites — cache first
  if (url.hostname.includes('maptiler.com') || url.hostname.includes('maplibre')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(res => {
            if (res.ok) cache.put(event.request, res.clone());
            return res;
          }).catch(() => new Response('', { status: 503 }));
        })
      )
    );
    return;
  }

  // Place images — cache as loaded
  if (url.pathname.includes('/images/place-')) {
    event.respondWith(
      caches.open(APP_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(res => {
            if (res.ok) cache.put(event.request, res.clone());
            return res;
          }).catch(() => new Response('', { status: 404 }));
        })
      )
    );
    return;
  }

  // App files — cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res.ok && event.request.method === 'GET') {
          const clone = res.clone();
          caches.open(APP_CACHE).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
