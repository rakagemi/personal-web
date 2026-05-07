"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SplashScreen = dynamic(() => import("@/components/splash-screen"), { ssr: false });

const SESSION_KEY = "intro_played";

/**
 * Deteksi bot (Lighthouse)
 * Dipanggil hanya di sisi client.
 */
function isBot(): boolean {
  if (typeof navigator === "undefined") return true; // SSR → anggap bot
  return /lighthouse/i.test(
    navigator.userAgent
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isHome = pathname === "/";
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "true";

    if (isHome && !alreadyPlayed && !isBot()) {
      document.body.style.overflow = "hidden";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSplash(true);
    }
  }, [mounted, pathname]);

  const handleFinished = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setShowSplash(false);
  };

  if (!mounted) return <div key={pathname || "default"}>{children}</div>;

  return (
    <div key={pathname || "default"}>
      <div
        style={{
          opacity: showSplash ? (opacity < 0.25 ? 1 - opacity * 2 : 0) : 1,
          transition: "opacity 1s ease",
        }}
      >
        {children}
      </div>

      {showSplash && (
        <SplashScreen
          opacity={opacity}
          setOpacity={setOpacity}
          onFinished={handleFinished}
        />
      )}
    </div>
  );
}