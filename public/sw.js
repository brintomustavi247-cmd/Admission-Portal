/* ===== SERVICE WORKER v5 • MANIFEST NETWORK-FIRST FIX ===== */
const CACHE = 'admission-portal-v5'; // ← v4 → v5 (পুরনো ক্যাশ auto-delete হবে)

/* এই path গুলো কখনো ক্যাশ-ফার্স্ট না — সবসময় network-first */
const NETWORK_FIRST_PATHS = ['/manifest.webmanifest', '/icons/'];

self.addEventListener('install', (e) => {
  // core shell প্রিক্যাশ (offline fallback), fail হলেও install আটকাবে না
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png']))
      .catch(() => {})
  );
  self.skipWaiting(); // নতুন SW সাথে সাথে active
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* app চাইলে message পাঠিয়ে force-skip করাতে পারবে */
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  const url = new URL(req.url);

  /* ১) page/navigation = network-first (ফ্রেশ কন্টেন্ট) */
  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req));
    return;
  }

  /* ২) manifest + icons = network-first (PWA metadata সবসময় ফ্রেশ) */
  if (NETWORK_FIRST_PATHS.some((p) => url.pathname.startsWith(p))) {
    e.respondWith(networkFirst(req));
    return;
  }

  /* ৩) বাকি static (hashed js/css, fonts) = cache-first + background revalidate */
  e.respondWith(staleWhileRevalidate(req));
});

/* ---- strategies ---- */
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