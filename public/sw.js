/* Service worker for Ruhab's First Birthday.
   - Page (HTML): network first, so a new deploy shows up right away; falls back to the saved page when offline.
   - /assets/ (hashed JS, CSS, fonts): cache first, they never change under the same name.
   - /photos/ and /icons/: cache first, photos are saved the first time they are seen (size-limited).
   Bump VERSION to throw away every saved file. */
const VERSION = "v1";
const SHELL = `ruhab-shell-${VERSION}`;
const ASSETS = `ruhab-assets-${VERSION}`;
const MEDIA = `ruhab-media-${VERSION}`;
const KEEP = [SHELL, ASSETS, MEDIA];
const LIMITS = { [ASSETS]: 60, [MEDIA]: 180 };
const PRECACHE = ["/", "/manifest.webmanifest", "/favicon.ico", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (!KEEP.includes(k)) await caches.delete(k);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

async function trim(name) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - LIMITS[name]; i++) await cache.delete(keys[i]);
}

async function cacheFirst(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) { cache.put(req, res.clone()).then(() => LIMITS[name] && trim(name)); }
  return res;
}

async function page(e) {
  const cache = await caches.open(SHELL);
  try {
    const res = (await e.preloadResponse) || (await fetch(e.request));
    // every path (/, /firsts, ...) is the same single page, so keep one copy under "/"
    if (res.ok) cache.put("/", res.clone());
    return res;
  } catch {
    return (await cache.match("/")) || Response.error();
  }
}

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") return e.respondWith(page(e));
  if (url.pathname.startsWith("/assets/")) return e.respondWith(cacheFirst(request, ASSETS));
  if (url.pathname.startsWith("/photos/") || url.pathname.startsWith("/icons/")) return e.respondWith(cacheFirst(request, MEDIA));
});
