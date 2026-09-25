// ═══════════════════════════════════════════════════
// SERVICE WORKER — DETERMINADOR v3
// por Víctor Manuel Siu Puyén
// ID: VMSIUP-DET-v3 © 2025
// Estrategia: cache-first con actualización en red
// ═══════════════════════════════════════════════════

const CACHE_NAME = 'determinador-v3-3';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './multa.js',
  './manifest.json',
  './icons/favicon-32.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// INSTALL: precachear todos los assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE: eliminar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// FETCH: sirve desde cache, actualiza en background
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const net = fetch(event.request)
          .then(res => {
            if (res && res.status === 200) cache.put(event.request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || net;
      })
    )
  );
});
