const CACHE_NAME = "zxc-stream-v3";
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

// Install event - same as before
self.addEventListener("install", (event) => {
  console.log("SW installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
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

// UPDATED FETCH EVENT - Handle TMDB images differently
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Handle TMDB images with network-first strategy
  if (request.url.includes("image.tmdb.org")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // Cache with expiration (24 hours)
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache as fallback
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If no cache, return a placeholder or error response
            throw new Error("Image not available");
          });
        })
    );
  }

  // Handle API calls with network-first
  else if (
    request.url.includes("/api/") ||
    request.url.includes("tmdb.org/3/")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }

  // Everything else: cache first (your app shell)
  else {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request);
      })
    );
  }
});

// Activate event - same as before
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

// Push notification events - same as before
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
