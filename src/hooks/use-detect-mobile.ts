import { useState, useEffect } from "react";

export function useIsMobile() {
  // 1. Inisialisasi dengan null atau undefined untuk menandakan
  //    kita belum tahu statusnya (server-side).
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgentCheck = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const touchCheck = "ontouchstart" in window && navigator.maxTouchPoints > 0;

      setIsMobile(userAgentCheck || touchCheck);
    };

    checkMobile();

    // Opsional: Tambahkan listener jika ingin responsif terhadap resize window
    // window.addEventListener('resize', checkMobile);
    // return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}