import * as React from "react";

// Tidak perlu IS_SERVER manual lagi karena useSyncExternalStore menanganinya

export function useMediaQuery(query: string, defaultValue: boolean = false): boolean {
  // 1. Fungsi untuk subscribe ke perubahan (addEventListener)
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      
      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query]
  );

  // 2. Fungsi untuk mengambil nilai saat ini di Client (Browser)
  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  // 3. Fungsi untuk mengambil nilai saat di Server (Next.js SSR)
  const getServerSnapshot = () => {
    return defaultValue;
  };

  // React akan otomatis menyinkronkan ketiganya!
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}