// const CACHE_NAME = "zxc-stream-v2.29";
// const urlsToCache = [
//   "/",
//   "/manifest.json",
//   "/favicon-96x96.png",
//   "/favicon.svg",
//   "/apple-touch-icon.png",
//   "/web-app-manifest-192x192.png",
//   "/web-app-manifest-512x512.png",
//   "/next.svg",
//   "/vercel.svg",
//   "/file.svg",
//   "/globe.svg",
//   "/window.svg",
//   "/fonts/havelock-bold.otf",
//   "/fonts/Quicksand-Regular.ttf",
// ];

// // Install event - cache resources with better error handling
// self.addEventListener("install", (event) => {
//   console.log("SW installing...");
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Opened cache");

//       // Cache files one by one to see which one fails
//       return Promise.allSettled(
//         urlsToCache.map((url) =>
//           cache
//             .add(url)
//             .then(() => {
//               console.log(`✅ Cached: ${url}`);
//             })
//             .catch((error) => {
//               console.error(`❌ Failed to cache ${url}:`, error);
//             })
//         )
//       ).then(() => {
//         console.log("✅ Caching process completed!");
//       });
//     })
//   );
// });

// // Rest of your service worker code stays the same...
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });

// self.addEventListener("activate", (event) => {
//   console.log("SW activating...");
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             console.log("Deleting old cache:", cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       )
//     )
//   );
// });

// self.addEventListener("push", function (event) {
//   if (event.data) {
//     const data = event.data.json();
//     const options = {
//       body: data.body,
//       icon: "/web-app-manifest-192x192.png",
//       badge: "/web-app-manifest-192x192.png",
//       vibrate: [100, 50, 100],
//       data: {
//         dateOfArrival: Date.now(),
//         primaryKey: "2",
//       },
//     };
//     event.waitUntil(self.registration.showNotification(data.title, options));
//   }
// });

// self.addEventListener("notificationclick", function (event) {
//   console.log("Notification click received.");
//   event.notification.close();
//   event.waitUntil(clients.openWindow("/"));
// });
const CACHE_NAME = "zxc-stream-v2.37";
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

// Install event - cache resources and skip waiting
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
        // Force the new service worker to activate immediately
        return self.skipWaiting();
      });
    })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener("activate", (event) => {
  console.log("SW activating...");
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      ),
      // Take control of all clients immediately
      self.clients.claim(),
    ]).then(() => {
      console.log("SW activated and claimed clients");
      // Notify all clients that SW has updated
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "SW_UPDATED" });
        });
      });
    })
  );
});

// Fetch event - network first for HTML, cache first for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For HTML pages, use network-first strategy
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If network request succeeds, update cache and return response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request);
        })
    );
  } else {
    // For assets, use cache-first strategy
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
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
});

// Push notification event
self.addEventListener("push", (event) => {
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

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

// Message event to handle commands from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
