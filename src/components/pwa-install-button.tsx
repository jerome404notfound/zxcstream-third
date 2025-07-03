"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Smartphone, Monitor, X } from "lucide-react";

// Extend the Navigator interface to include the iOS standalone property
interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

export function PWAInstallButton() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        return;
      }

      // Check for iOS standalone mode with proper typing
      const iosNavigator = window.navigator as IOSNavigator;
      if (iosNavigator.standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();
  }, []);

  // Don't show button if app is already installed
  if (isInstalled) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Download className="w-5 h-5" />
          <span className="hidden lg:block"> Install App</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Install App</DrawerTitle>
          <DrawerDescription>
            Follow the instructions below to install this app on your device
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Tabs defaultValue="android" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="android" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Android
              </TabsTrigger>
              <TabsTrigger value="iphone" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                iPhone
              </TabsTrigger>
              <TabsTrigger value="windows" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Windows
              </TabsTrigger>
            </TabsList>

            <TabsContent value="android" className="mt-4 space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Chrome Browser:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Open this website in Chrome browser</li>
                  <li>Tap the menu button (three dots) in the top right</li>
                  <li>
                    Select &quot;Add to Home screen&quot; or &quot;Install
                    app&quot;
                  </li>
                  <li>Tap &quot;Add&quot; or &quot;Install&quot; to confirm</li>
                  <li>The app will be added to your home screen</li>
                </ol>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Samsung Internet:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Open this website in Samsung Internet</li>
                  <li>Tap the menu button (three lines)</li>
                  <li>
                    Select &quot;Add page to&quot; → &quot;Home screen&quot;
                  </li>
                  <li>Tap &quot;Add&quot; to confirm</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="iphone" className="mt-4 space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Safari Browser:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Open this website in Safari browser</li>
                  <li>
                    Tap the Share button (square with arrow up) at the bottom
                  </li>
                  <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                  <li>Edit the name if desired, then tap &quot;Add&quot;</li>
                  <li>The app will appear on your home screen</li>
                </ol>
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <strong>Note:</strong> This feature only works in Safari
                  browser, not in Chrome or other browsers on iOS.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="windows" className="mt-4 space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Microsoft Edge:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Open this website in Microsoft Edge</li>
                  <li>Click the menu button (three dots) in the top right</li>
                  <li>
                    Select &quot;Apps&quot; → &quot;Install this site as an
                    app&quot;
                  </li>
                  <li>Click &quot;Install&quot; to confirm</li>
                  <li>The app will be added to your Start menu and desktop</li>
                </ol>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Google Chrome:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Open this website in Google Chrome</li>
                  <li>
                    Click the install icon in the address bar (if available)
                  </li>
                  <li>
                    Or click the menu button (three dots) → &quot;More
                    tools&quot; → &quot;Create shortcut&quot;
                  </li>
                  <li>
                    Check &quot;Open as window&quot; and click
                    &quot;Create&quot;
                  </li>
                  <li>The app will be added to your desktop and Start menu</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
