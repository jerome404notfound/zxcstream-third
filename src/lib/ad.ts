"use client";

import { useCallback } from "react";

let canOpenAd = false;

export function useGlobalAdLink() {
  const adLink = useCallback(() => {
    if (!canOpenAd) return;

    const adUrl = "https://theeghumoaps.com/4/8414760";
    window.open(adUrl, "_blank");
    canOpenAd = false;

    setTimeout(() => {
      canOpenAd = true;
    }, 60000); // 20 seconds
  }, []);

  return adLink;
}
