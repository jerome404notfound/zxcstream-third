"use client";

import { useCallback } from "react";

let canOpenAd = true;

export function useGlobalAdLink() {
  const adLink = useCallback(() => {
    if (!canOpenAd) return;

    const adUrl =
      "https://snowmansphereabrasive.com/pyepvwc4?key=3b8db78578d352ef8dfbf252e46812cd";
    window.open(adUrl, "_blank");
    canOpenAd = false;

    setTimeout(() => {
      canOpenAd = true;
    }, 60000); // 20 seconds
  }, []);

  return adLink;
}
