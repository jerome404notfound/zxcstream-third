"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function ServiceWorkerUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered:", reg);
          setRegistration(reg);

          // Check for updates
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("New SW installed, update available");
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Listen for messages from SW
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data && event.data.type === "SW_UPDATED") {
              console.log("SW updated and activated");
              // Optionally reload the page automatically
              window.location.reload();
            }
          });

          // Check for waiting SW
          if (reg.waiting) {
            setUpdateAvailable(true);
          }
        })
        .catch((err) => {
          console.error("SW registration failed:", err);
        });

      // Check for updates periodically
      const interval = setInterval(() => {
        if (registration) {
          registration.update();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [registration]);

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell the waiting SW to skip waiting
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      setUpdateAvailable(false);

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <p className="text-sm mb-3">A new version is available!</p>
        <Button
          onClick={handleUpdate}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update Now
        </Button>
      </div>
    </div>
  );
}
