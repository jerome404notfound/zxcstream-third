"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Debug function
  const addDebugInfo = (info: string) => {
    console.log(`PWA Debug: ${info}`);
    setDebugInfo((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${info}`,
    ]);
  };

  useEffect(() => {
    // Detect iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    addDebugInfo(`iOS detected: ${isIOSDevice}`);

    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        addDebugInfo("App already installed (standalone mode)");
        return true;
      }

      const iosNavigator = window.navigator as IOSNavigator;
      if (iosNavigator.standalone === true) {
        setIsInstalled(true);
        addDebugInfo("App already installed (iOS standalone)");
        return true;
      }

      addDebugInfo("App not installed");
      return false;
    };

    const installed = checkIfInstalled();

    if (!installed) {
      // For iOS, we can't rely on beforeinstallprompt, so show button after a delay
      if (isIOSDevice) {
        setTimeout(() => {
          setIsInstallable(true);
          addDebugInfo("iOS: Setting installable to true");
        }, 1000);
      }

      // Listen for the beforeinstallprompt event (Android/Desktop)
      const handleBeforeInstallPrompt = (e: Event) => {
        addDebugInfo("beforeinstallprompt event fired");
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
      };

      // Listen for the app being installed
      const handleAppInstalled = () => {
        addDebugInfo("PWA was installed");
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      // Cleanup
      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show manual installation instructions
      setShowIOSInstructions(true);
      addDebugInfo("Showing iOS install instructions");
      return;
    }

    if (!deferredPrompt) {
      addDebugInfo("No deferred prompt available");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      addDebugInfo(`User response: ${outcome}`);

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      addDebugInfo(`Installation error: ${error}`);
      console.error("Error during installation:", error);
    }
  };

  // Don't show button if app is already installed
  if (isInstalled) {
    return (
      <div className="text-sm text-green-600 flex items-center gap-2">
        <Smartphone className="w-4 h-4" />
        App installed
      </div>
    );
  }

  // Show iOS instructions modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="font-semibold mb-4">Install App on iOS</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              <span>1. Tap the Share button</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>2. Scroll down and tap "Add to Home Screen"</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>3. Tap "Add" to install</span>
            </div>
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

  // Show button if installable OR for debugging purposes
  const shouldShowButton =
    isInstallable || (!isInstalled && process.env.NODE_ENV === "development");

  if (!shouldShowButton) {
    return (
      <div className="text-sm text-gray-500">
        <div>Install not available</div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-2">
            <summary className="cursor-pointer">Debug Info</summary>
            <div className="text-xs mt-1 space-y-1">
              {debugInfo.map((info, i) => (
                <div key={i}>{info}</div>
              ))}
              <div>isInstallable: {isInstallable.toString()}</div>
              <div>deferredPrompt: {deferredPrompt ? "available" : "null"}</div>
              <div>isIOS: {isIOS.toString()}</div>
            </div>
          </details>
        )}
      </div>
    );
  }

  return (
    <Button onClick={handleInstallClick} variant="outline">
      <Download className="w-4 h-4" />
      {isIOS ? "Install Instructions" : "Install App"}
    </Button>
  );
}
