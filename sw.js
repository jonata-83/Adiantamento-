const CACHE_NAME = 'adiantamentos-v3';
const urlsToCache = [
  '/Adiantamento-/adiantamentos.html',
  '/Adiantamento-/manifest.json',
  '/Adiantamento-/logo192.png',
  '/Adiantamento-/logo512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
