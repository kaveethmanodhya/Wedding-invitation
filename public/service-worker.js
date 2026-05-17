const CACHE_NAME = 'wedding-image-cache-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force new SW to activate immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Clear old caches
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 🔴 STRICT BYPASS: Let browser handle Navigation, Next.js chunks, APIs, AND VIDEOS
  if (
    event.request.mode === 'navigate' || 
    url.pathname.startsWith('/_next/') || 
    url.pathname.startsWith('/api/') || 
    event.request.method !== 'GET' ||
    event.request.destination === 'video' || // Explicitly ignore video requests
    url.pathname.match(/\.(mp4|webm|ogg)$/i) // Ignore video extensions
  ) {
    return; // Bypassing SW cache for video stream support (HTTP 206)
  }

  // ✅ ONLY CACHE IMAGES
  if (event.request.destination === 'image' || url.hostname.includes('res.cloudinary.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Don't cache failed requests
          if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // Fallback if offline and image not cached
          return new Response(''); 
        });
      })
    );
  }
});
