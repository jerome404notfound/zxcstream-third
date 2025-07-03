"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

interface PWARequirement {
  name: string;
  met: boolean;
  description: string;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [requirements, setRequirements] = useState<PWARequirement[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkPWARequirements = async () => {
      const reqs: PWARequirement[] = [];

      // Check HTTPS
      const isHTTPS =
        location.protocol === "https:" || location.hostname === "localhost";
      reqs.push({
        name: "HTTPS",
        met: isHTTPS,
        description: "App must be served over HTTPS (or localhost)",
      });

      // Check for manifest
      let hasValidManifest = false;
      try {
        const manifestLink = document.querySelector(
          'link[rel="manifest"]'
        ) as HTMLLinkElement;
        if (manifestLink) {
          const response = await fetch(manifestLink.href);
          if (response.ok) {
            const manifest = await response.json();
            hasValidManifest = !!(
              manifest.name &&
              manifest.start_url &&
              manifest.icons?.length > 0
            );
          }
        }
      } catch (error) {
        console.error("Error checking manifest:", error);
      }

      reqs.push({
        name: "Web App Manifest",
        met: hasValidManifest,
        description: "Valid manifest.json with name, start_url, and icons",
      });

      // Check for service worker
      const hasServiceWorker =
        "serviceWorker" in navigator &&
        (await navigator.serviceWorker.getRegistrations()).length > 0;

      reqs.push({
        name: "Service Worker",
        met: hasServiceWorker,
        description: "Service worker must be registered",
      });

      // Check if already installed
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const iosNavigator = window.navigator as IOSNavigator;
      const isIOSStandalone = iosNavigator.standalone === true;

      reqs.push({
        name: "Not Already Installed",
        met: !isStandalone && !isIOSStandalone,
        description: "App is not already installed",
      });

      setRequirements(reqs);

      // Set installed state
      if (isStandalone || isIOSStandalone) {
        setIsInstalled(true);
      }

      return reqs.every((req) => req.met);
    };

    // Detect iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    checkPWARequirements().then((allRequirementsMet) => {
      if (allRequirementsMet && !isInstalled) {
        if (isIOSDevice) {
          // iOS doesn't fire beforeinstallprompt, so set installable directly
          setIsInstallable(true);
        }
        // For other platforms, wait for beforeinstallprompt
      }
    });

    // Listen for beforeinstallprompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      console.log("No deferred prompt available");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error("Error during installation:", error);
    }
  };

  // Show iOS instructions modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="font-semibold mb-4">Install App on iOS</h3>
          <div className="space-y-3 text-sm">
            <div>1. Tap the Share button in Safari</div>
            <div>2. Scroll down and tap Add to Home Screen</div>
            <div>3. Tap Add to install</div>
          </div>
          <Button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full mt-4"
          >
            Got it
          </Button>
        </div>
      </div>
    );
  }

  if (isInstalled) {
    return (
      <div className="text-sm text-green-600 flex items-center gap-2">
        <CheckCircle className="w-4 h-4" />
        App installed
      </div>
    );
  }

  const allRequirementsMet = requirements.every((req) => req.met);
  const canInstall = isInstallable && (deferredPrompt || isIOS);

  if (canInstall) {
    return (
      <Button onClick={handleInstallClick} className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        {isIOS ? "Install Instructions" : "Install App"}
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Install not available
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDebug(!showDebug)}
      >
        {showDebug ? "Hide" : "Show"} Requirements
      </Button>

      {showDebug && (
        <div className="border rounded-lg p-3 space-y-2 text-sm">
          <div className="font-medium">PWA Requirements:</div>
          {requirements.map((req, i) => (
            <div key={i} className="flex items-start gap-2">
              {req.met ? (
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <div className={req.met ? "text-green-700" : "text-red-700"}>
                  {req.name}
                </div>
                <div className="text-gray-600 text-xs">{req.description}</div>
              </div>
            </div>
          ))}

          <div className="mt-3 pt-2 border-t text-xs text-gray-500">
            <div>
              beforeinstallprompt fired: {deferredPrompt ? "Yes" : "No"}
            </div>
            <div>Platform: {isIOS ? "iOS" : "Other"}</div>
            <div>All requirements met: {allRequirementsMet ? "Yes" : "No"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
