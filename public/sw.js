const CACHE_NAME = "zxc-stream-v2.24";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/favicon-96x96.png",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/next.svg",
  "/vercel.svg",
  "/file.svg",
  "/globe.svg",
  "/window.svg",
  "/fonts/havelock-bold.otf",
  "/fonts/Quicksand-Regular.ttf",
];

// Install event - cache resources with better error handling
self.addEventListener("install", (event) => {
  console.log("SW installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");

      // Cache files one by one to see which one fails
      return Promise.allSettled(
        urlsToCache.map((url) =>
          cache
            .add(url)
            .then(() => {
              console.log(`✅ Cached: ${url}`);
            })
            .catch((error) => {
              console.error(`❌ Failed to cache ${url}:`, error);
            })
        )
      ).then(() => {
        console.log("✅ Caching process completed!");
      });
    })
  );
});

// Rest of your service worker code stays the same...
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("SW activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/web-app-manifest-192x192.png",
      badge: "/web-app-manifest-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
