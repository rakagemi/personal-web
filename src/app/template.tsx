"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";

const SESSION_KEY = "intro_played";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mountRef = useRef<HTMLDivElement>(null);
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
    if (isHome && !alreadyPlayed) setShowSplash(true);
  }, [mounted, pathname]);

  useEffect(() => {
    if (!showSplash) return;
    document.body.style.overflow = "hidden";

    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    // Fog lebih tipis di awal agar galaxy kelihatan, makin dekat makin terang
    scene.fog = new THREE.FogExp2(0x000000, 0.032);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      200
    );
    camera.position.z = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // === STARFIELD ===
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 70;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = -Math.random() * 70;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.07,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // === ANIMATION ===
    const startTime = Date.now();
    const totalDuration = 3000; // lebih singkat
    let animFrameId: number;
    let finished = false;
    let lastOpacity = -1;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Pure cubic ease-in: lambat di awal, akselerasi tajam di akhir
      // Tidak ada fase "plateau" yang menyebabkan kesan delay/berhenti
      const eased = progress * progress * progress;

      // Kamera maju
      camera.position.z = -eased * 72;

      // FOV melebar seiring bergerak — efek "tersedot"
      camera.fov = 75 + eased * 18;
      camera.updateProjectionMatrix();

      // Nuansa gelap → terang: mulai fade dari progress 0.4
      // Semakin mendekati akhir, semakin terang (alpha turun)
      const bgAlpha = progress < 0.4
        ? 1
        : 1 - ((progress - 0.4) / 0.6);
      const clampedAlpha = Math.max(bgAlpha, 0);
      renderer.setClearColor(0x000000, clampedAlpha);

      // Update React state hanya jika berubah signifikan (hindari re-render berlebihan)
      const roundedOpacity = Math.round(clampedAlpha * 100) / 100;
      if (Math.abs(roundedOpacity - lastOpacity) > 0.015) {
        lastOpacity = roundedOpacity;
        setOpacity(roundedOpacity);
      }

      // Bintang makin terang saat mendekati akhir (opacity naik)
      starMat.opacity = 0.6 + eased * 0.4;

      renderer.render(scene, camera);

      if (progress >= 1 && !finished) {
        finished = true;
        sessionStorage.setItem(SESSION_KEY, "true");
        setOpacity(0);
        setTimeout(() => {
          document.body.style.overflow = "";
          setShowSplash(false);
        }, 600);
      }
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [showSplash]);

  if (!mounted) return <div key={pathname || "default"}>{children}</div>;

  return (
    <div key={pathname || "default"}>
      {/* Children — mulai kelihatan saat splash fade */}
      <div
        style={{
          opacity: showSplash ? (opacity < 0.25 ? 1 - opacity * 2 : 0) : 1,
          transition: "opacity 1s ease",
        }}
      >
        {children}
      </div>

      {/* Three.js splash */}
      {showSplash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            opacity: opacity > 0.01 ? 1 : 0,
            transition: "opacity 0.6s ease",
            pointerEvents: "all",
          }}
        >
          <div
            ref={mountRef}
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          />
        </div>
      )}
    </div>
  );
}