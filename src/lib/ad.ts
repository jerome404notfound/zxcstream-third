"use client";

import { useCallback, useEffect, useState } from "react";

const COOLDOWN_MS = 60000; // 60 seconds
const LAST_AD_TIME_KEY = "lastAdTime";

export function useGlobalAdLink() {
  const [canOpenAd, setCanOpenAd] = useState(false);

  // Check localStorage on initial mount
  useEffect(() => {
    const lastTime = localStorage.getItem(LAST_AD_TIME_KEY);
    if (!lastTime || Date.now() - parseInt(lastTime, 10) > COOLDOWN_MS) {
      setCanOpenAd(true);
    } else {
      const remaining = COOLDOWN_MS - (Date.now() - parseInt(lastTime, 10));
      setTimeout(() => setCanOpenAd(true), remaining);
    }
  }, []);

  const adLink = useCallback(() => {
    if (!canOpenAd) return;

    const adUrl =
      "https://snowmansphereabrasive.com/pyepvwc4?key=3b8db78578d352ef8dfbf252e46812cd";
    window.open(adUrl, "_blank");

    const now = Date.now();
    localStorage.setItem(LAST_AD_TIME_KEY, now.toString());
    setCanOpenAd(false);

    setTimeout(() => {
      setCanOpenAd(true);
    }, COOLDOWN_MS);
  }, [canOpenAd]);

  return adLink;
}
