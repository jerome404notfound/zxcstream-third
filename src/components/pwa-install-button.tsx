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
type BrowserInstructions = {
  name: string;
  steps: string[];
  note?: string; // Mark 'note' as optional
};

type TabInstruction = {
  value: string;
  browsers: BrowserInstructions[];
};
const pwaInstructions: TabInstruction[] = [
  {
    value: "android",
    browsers: [
      {
        name: "Chrome Browser",
        steps: [
          "Open this website in Chrome browser",
          "Tap the menu button (three dots) in the top right",
          'Select "Add to Home screen" or "Install app"',
          'Tap "Add" or "Install" to confirm',
          "The app will be added to your home screen",
        ],
      },
      {
        name: "Samsung Internet",
        steps: [
          "Open this website in Samsung Internet",
          "Tap the menu button (three lines)",
          'Select "Add page to" → "Home screen"',
          'Tap "Add" to confirm',
        ],
      },
    ],
  },
  {
    value: "iphone",
    browsers: [
      {
        name: "Safari Browser",
        steps: [
          "Open this website in Safari browser",
          "Tap the Share button (square with arrow up) at the bottom",
          'Scroll down and tap "Add to Home Screen"',
          'Edit the name if desired, then tap "Add"',
          "The app will appear on your home screen",
        ],
        note: "Note: This feature only works in Safari browser, not in Chrome or other browsers on iOS.",
      },
    ],
  },
  {
    value: "windows",
    browsers: [
      {
        name: "Microsoft Edge",
        steps: [
          "Open this website in Microsoft Edge",
          "Click the menu button (three dots) in the top right",
          'Select "Apps" > "Install this site as an app"',
          'Click "Install" to confirm',
          "The app will be added to your Start menu and desktop",
        ],
      },
      {
        name: "Google Chrome",
        steps: [
          "Open this website in Google Chrome",
          "Click the install icon in the address bar (if available)",
          'Or click the menu button (three dots) > "More tools" → "Create shortcut"',
          'Check "Open as window" and click "Create"',
          "The app will be added to your desktop and Start menu",
        ],
      },
    ],
  },
];

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
          <DrawerTitle>Install ZXCSTREAM App</DrawerTitle>
          <DrawerDescription>
            Follow the instructions below to install this app on your device
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Tabs
            defaultValue="android"
            className="w-full max-h-96 overflow-auto"
          >
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

            {pwaInstructions.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-4 space-y-4 "
              >
                {tab.browsers.map((browser, i) => (
                  <div key={i} className="space-y-3">
                    <h4 className="font-semibold">
                      {browser.name} ({browser.steps.length} steps)
                    </h4>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
                      {browser.steps.map((step, j) => (
                        <div className="border p-4 rounded-md" key={j}>
                          {j + 1}.&nbsp;{step}
                        </div>
                      ))}
                    </div>
                    {browser?.note && (
                      <div className="p-3 bg-popover rounded-lg text-sm text-blue-800">
                        <strong>Note:</strong> {browser.note}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">
              <X />
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
