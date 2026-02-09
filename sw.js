const CACHE_NAME = "setup-organizer-v17";
const ASSETS = [
  "./",
  "./index.html",
  "./app.html",
  "./manifest.json",
  "./icon.svg",
  "./sw.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).then((res) => {
        try{
          const url = new URL(req.url);
          if (url.origin === location.origin && req.method === "GET") {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
          }
        }catch{}
        return res;
      }).catch(() => cached);
    })
  );
});
