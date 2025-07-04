const CACHE_NAME = "zxc-stream-v2.2"; // Updated version to clear old cache

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

// UPDATED FETCH EVENT - Handle different types of requests
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Handle Next.js optimized images (/_next/image) - DON'T cache 402 responses
  if (request.url.includes("/_next/image")) {
    console.log("🖼️ Handling Next.js image:", request.url);
    event.respondWith(
      fetch(request)
        .then((response) => {
          console.log(
            `📸 Image response status: ${response.status} for ${request.url}`
          );

          // Only cache successful responses, NOT 402 errors
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
              console.log("✅ Cached successful image");
            });
          } else if (response.status === 402) {
            // Don't cache 402 responses, and clear any existing cache
            console.log("❌ 402 error - clearing cache for this image");
            caches.open(CACHE_NAME).then((cache) => {
              cache.delete(request);
            });
          }
          return response;
        })
        .catch((error) => {
          console.log("🌐 Network failed for image, trying cache");
          // Network failed, try cache but only if it's not a 402
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse && cachedResponse.status !== 402) {
              console.log("✅ Serving cached image");
              return cachedResponse;
            }
            // No valid cache, let it fail naturally
            console.log("❌ No valid cached image available");
            throw error;
          });
        })
    );
  }

  // Handle direct TMDB images (if any)
  else if (request.url.includes("image.tmdb.org")) {
    console.log("🎬 Handling direct TMDB image:", request.url);
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

  // Handle API calls with network-first strategy
  else if (
    request.url.includes("/api/") ||
    request.url.includes("tmdb.org/3/")
  ) {
    console.log("🔌 Handling API call:", request.url);
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
          console.log("🌐 API network failed, trying cache");
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
