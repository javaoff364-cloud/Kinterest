const VERSION = "kinterest-shell-v3";
const IMAGE_CACHE = "kinterest-images-v2";
const SHELL = ["/", "/offline", "/icon.svg", "/manifest.webmanifest"];
const IMAGE_HOSTS = new Set(["images.unsplash.com", "images.pexels.com", "cdn.pixabay.com"]);
const PUBLIC_PAGES = ["/", "/explore", "/search", "/collections", "/category", "/photo"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![VERSION, IMAGE_CACHE].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.pathname.startsWith("/api/")) return;

  const isOptimizedImage = url.origin === self.location.origin && url.pathname === "/_next/image";
  const isRemotePhoto = IMAGE_HOSTS.has(url.hostname);
  if (request.destination === "image" && (isOptimizedImage || (url.origin === self.location.origin && !url.pathname.startsWith("/_next/")) || isRemotePhoto)) {
    event.respondWith(caches.open(IMAGE_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response.clone());
        const keys = await cache.keys();
        if (keys.length > 100) await cache.delete(keys[0]);
      }
      return response;
    }));
    return;
  }

  if (url.origin !== self.location.origin || request.mode !== "navigate") return;
  const isPublic = PUBLIC_PAGES.some((path) => path === "/" ? url.pathname === "/" : url.pathname === path || url.pathname.startsWith(path + "/"));
  if (!isPublic) {
    event.respondWith(fetch(request).catch(async () => (await caches.match("/offline"))));
    return;
  }
  event.respondWith(fetch(request).then((response) => {
    if (response.ok) caches.open(VERSION).then((cache) => cache.put(request, response.clone()));
    return response;
  }).catch(async () => (await caches.match(request)) || (await caches.match("/offline"))));
});
