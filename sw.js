const CACHE_NAME = 'adiantamentos-v4';
const urlsToCache = [
  '/Adiantamento-/index.html',
  '/Adiantamento-/manifest.json',
  '/Adiantamento-/logo192.png',
  '/Adiantamento-/logo512.png'
];

// Instala e já assume o controle (não fica esperando fechar o app)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Ao ativar, apaga TODOS os caches antigos (v3 e anteriores) e assume o controle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Rede primeiro (busca a versão nova sempre que houver internet);
// se estiver offline, usa o cache. Assim o app se atualiza sozinho.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
