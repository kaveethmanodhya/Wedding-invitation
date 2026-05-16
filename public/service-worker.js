const CACHE_NAME = 'wedding-card-image-cache-v1';

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event - Intercept network requests for images
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  // Target Cloudinary URLs and generic image destinations
  if (requestUrl.includes('res.cloudinary.com') || event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        
        // 1. Return from cache if it exists
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. If not in cache, fetch from network and save to cache
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            // Clone the response before putting it in the cache
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
        
      })
    );
  }
});
