"use client";

import { useEffect, useRef } from "react";

interface GalaxyIntroProps {
  onFinished: () => void;
  opacity: number;
  setOpacity: (v: number) => void;
}

export default function SplashScreen({ onFinished, opacity, setOpacity }: GalaxyIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animFrameId: number;

    (async () => {
      const THREE = await import("three");

      const mount = mountRef.current;
      if (!mount) return;

      const scene = new THREE.Scene();
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
      const totalDuration = 2000;
      let finished = false;
      let lastOpacity = -1;

      const animate = () => {
        animFrameId = requestAnimationFrame(animate);
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        const eased = progress * progress * progress;

        camera.position.z = -eased * 72;
        camera.fov = 75 + eased * 18;
        camera.updateProjectionMatrix();

        const bgAlpha =
          progress < 0.4 ? 1 : 1 - (progress - 0.4) / 0.6;
        const clampedAlpha = Math.max(bgAlpha, 0);
        renderer.setClearColor(0x000000, clampedAlpha);

        const roundedOpacity = Math.round(clampedAlpha * 100) / 100;
        if (Math.abs(roundedOpacity - lastOpacity) > 0.015) {
          lastOpacity = roundedOpacity;
          setOpacity(roundedOpacity);
        }

        starMat.opacity = 0.6 + eased * 0.4;
        renderer.render(scene, camera);

        if (progress >= 1 && !finished) {
          finished = true;
          setOpacity(0);
          setTimeout(() => {
            document.body.style.overflow = "";
            onFinished();
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

      // Cleanup disimpan di closure untuk diakses saat unmount
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mount as any).__cleanup = () => {
        cancelAnimationFrame(animFrameId);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    })();

    return () => {
      const mount = mountRef.current;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (mount && (mount as any).__cleanup) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mount as any).__cleanup();
      } else {
        cancelAnimationFrame(animFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
  );
}