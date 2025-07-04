const CACHE_NAME = "zxc-stream-v1.1";

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

// UPDATED FETCH EVENT - Different strategies for different content types
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. API Data: Network first, cache fallback
  if (request.url.includes("/api/") || request.url.includes("tmdb.org/3/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request);
        })
    );
  }

  // 2. Images: Cache first with stale-while-revalidate
  else if (
    request.destination === "image" ||
    request.url.includes("image.tmdb.org") ||
    request.url.includes(".jpg") ||
    request.url.includes(".png") ||
    request.url.includes(".webp")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached version immediately
        if (cachedResponse) {
          // Update cache in background (stale-while-revalidate)
          fetch(request)
            .then((freshResponse) => {
              if (freshResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, freshResponse.clone());
                });
              }
            })
            .catch(() => {
              // Network failed, but we have cached version
            });

          return cachedResponse;
        }

        // No cached version, fetch from network
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }

  // 3. Critical Updates: Network only (always fresh)
  else if (
    request.url.includes("/critical/") ||
    request.url.includes("/user/") ||
    request.url.includes("/auth/")
  ) {
    event.respondWith(
      fetch(request).catch(() => {
        // Only fallback to cache for GET requests
        if (request.method === "GET") {
          return caches.match(request);
        }
        throw new Error("Network unavailable");
      })
    );
  }

  // 4. App Shell: Cache first, update in background
  else {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Update cache in background
          fetch(request)
            .then((freshResponse) => {
              if (freshResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, freshResponse.clone());
                });
              }
            })
            .catch(() => {
              // Network failed, but we have cached version
            });

          return cachedResponse;
        }

        // No cached version, fetch from network
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
