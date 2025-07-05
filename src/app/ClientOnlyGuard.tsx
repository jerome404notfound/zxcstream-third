"use client";

import { useEffect, useState } from "react";
import logo from "@/assets/zxzx.png";

export default function ClientOnlyGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hostname = window.location.hostname;

      const isLocal = hostname === "localhost" || hostname === "192.168.1.2";

      const isProd =
        hostname === "zxcstream" || // exact match
        hostname === "zxcstream.pro" || // (optional) subdomain if ever used
        hostname.endsWith(".zxcstream.pro"); // for branches like preview.vercel.app

      if (isLocal || isProd) {
      } else {
        window.location.href = "https://zxcstream.site";
      }

      setIsChecking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] gap-4 bg-background text-sm text-muted-foreground">
        <img
          className="h-16 w-16 object-contain animate-pulse"
          src={logo.src}
          alt="Logo"
        />
        <div className="w-5 h-5 border-3 border-gray-300 border-t-black rounded-full animate-spin" />
        <p className="text-xs">Starting up...</p>
      </div>
    );
  }

  return <>{children}</>;
}
