'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegistration
 * Registers the image-caching service worker on the client side.
 * Must be a Client Component because it accesses `navigator`.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register the Service Worker for Image Caching
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log(
              '✅ Service Worker Registered. Images will be cached!',
              registration.scope
            );
          })
          .catch((error) => {
            console.log('❌ Service Worker Registration failed:', error);
          });
      });
    }
  }, []);

  // Renders nothing — purely a side-effect component
  return null;
}
