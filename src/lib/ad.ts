import { useCallback } from "react";

export function useSimpleAdLink(cooldownMs = 40000) {
  return useCallback(() => {
    const lastAdTime = localStorage.getItem("lastAdTime");
    const now = Date.now();

    if (lastAdTime) {
      const timeSinceLastAd = now - Number.parseInt(lastAdTime);
      if (timeSinceLastAd < cooldownMs) {
        const remainingSeconds = Math.ceil(
          (cooldownMs - timeSinceLastAd) / 1000
        );
        console.log(`Please wait ${remainingSeconds} more seconds`);
        return false;
      }
    }

    const adLinks = ""
      //mine "https://snowmansphereabrasive.com/pyepvwc4?key=3b8db78578d352ef8dfbf252e46812cd";
    window.open(adLinks, "_blank");
    localStorage.setItem("lastAdTime", now.toString());
    return true;
  }, [cooldownMs]);
}
