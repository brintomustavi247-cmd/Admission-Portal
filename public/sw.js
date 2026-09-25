/* ===== SERVICE WORKER v7 • STANDALONE MANIFEST & SHELL FIX ===== */
const CACHE = 'admission-portal-v7';

const NETWORK_FIRST_PATHS = ['/manifest.webmanifest', '/icons/'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll([
        '/',
        '/manifest.webmanifest',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/icons/icon-maskable-512.png'
      ]))
      .catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING' || (e.data && e.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  const url = new URL(req.url);

  // 1. Navigation requests -> Network first with fallback
  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req));
    return;
  }

  // 2. Manifest and icons -> Always fresh from network
  if (NETWORK_FIRST_PATHS.some((p) => url.pathname.startsWith(p))) {
    e.respondWith(networkFirst(req));
    return;
  }

  // 3. Static assets -> Stale while revalidate
  e.respondWith(staleWhileRevalidate(req));
});

function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      if (res && res.ok) {
        const cp = res.clone();
        caches.open(CACHE).then((c) => c.put(req, cp));
      }
      return res;
    })
    .catch(() => caches.match(req).then((m) => m || Response.error()));
}

function staleWhileRevalidate(req) {
  return caches.match(req).then((cached) => {
    const refresh = fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(req, cp));
        }
        return res;
      })
      .catch(() => null);
    return cached || refresh.then((r) => r || Response.error());
  });
}