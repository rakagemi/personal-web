"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// Key untuk sessionStorage — per tab, hilang saat tab ditutup
const SESSION_KEY = "intro_played";

function hasPlayedInSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

function markPlayedInSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, "true");
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mountRef = useRef<HTMLDivElement>(null);

  // Inisialisasi dilakukan SETELAH mount untuk avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [brightness, setBrightness] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isHome = pathname === "/";
    const alreadyPlayed = hasPlayedInSession();

    if (isHome && !alreadyPlayed) {
      setShowSplash(true);
    }

  }, [mounted, pathname]);

  // Step 3: Three.js animation — pure deep space, tersedot ke portal
  useEffect(() => {
    if (!showSplash) return;

    document.body.style.overflow = "hidden";

    const mount = mountRef.current;
    if (!mount) return;

    // === SCENE ===
    const scene = new THREE.Scene();
    // Fog pekat hitam — kedalaman luar angkasa
    scene.fog = new THREE.FogExp2(0x000000, 0.045);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      200
    );
    camera.position.z = 0;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // === STARFIELD — bintang-bintang luar angkasa ===
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      // Distribusi bola: bintang tersebar di semua arah
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 80;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = -Math.random() * 80;
      starSizes[i] = Math.random() * 1.5 + 0.3;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // === STAR STREAKS — partikel yang "melesat" saat tersedot ===
    const streakCount = 300;
    const streakPositions = new Float32Array(streakCount * 3);
    for (let i = 0; i < streakCount; i++) {
      streakPositions[i * 3] = (Math.random() - 0.5) * 4;
      streakPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      streakPositions[i * 3 + 2] = -Math.random() * 70 - 5;
    }
    const streakGeo = new THREE.BufferGeometry();
    streakGeo.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3));
    const streakMat = new THREE.PointsMaterial({
      color: 0xddddff,
      size: 0.025,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(streakGeo, streakMat));

    // === TUNNEL GELAP — dinding terowongan luar angkasa, HITAM PEKAT ===
    // Tidak pakai warna biru. Pure monochrome dark.
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 25 }, (_, i) =>
        new THREE.Vector3(
          Math.sin(i * 0.25) * 0.8,  // wobble kecil, hampir lurus
          Math.cos(i * 0.2) * 0.8,
          -i * 3.5
        )
      )
    );

    const tunnelGeo = new THREE.TubeGeometry(curve, 300, 2.2, 12, false);

    // Vertex color: hitam pekat di depan, sangat sedikit abu di kejauhan
    const tunnelColors: number[] = [];
    const posAttr = tunnelGeo.attributes.position;
    const colorObj = new THREE.Color();
    for (let i = 0; i < posAttr.count; i++) {
      const t = i / posAttr.count;
      // Pure dark — hanya lightness kecil, tanpa hue biru
      const lightness = t * 0.12; // max 12% — hampir hitam total
      colorObj.setHSL(0, 0, lightness);
      tunnelColors.push(colorObj.r, colorObj.g, colorObj.b);
    }
    tunnelGeo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(tunnelColors, 3)
    );

    const tunnelMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      vertexColors: true,
    });
    scene.add(new THREE.Mesh(tunnelGeo, tunnelMat));

    // === PORTAL — lubang transparan ke homepage ===
    // Portal itu sendiri invisible (opacity 0), yang kelihatan hanyalah
    // background homepage yang menerobos karena alpha renderer dikurangi
    const portalGeo = new THREE.CircleGeometry(2.2, 128);
    const portalMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const portal = new THREE.Mesh(portalGeo, portalMat);
    portal.position.set(0, 0, -83);
    scene.add(portal);

    // Rim cahaya putih tipis di tepi portal
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const rim = new THREE.Mesh(new THREE.RingGeometry(2.2, 2.8, 128), rimMat);
    rim.position.set(0, 0, -82.9);
    scene.add(rim);

    // Aura luar — putih sangat lembut, bukan biru
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const aura = new THREE.Mesh(new THREE.RingGeometry(2.8, 6, 128), auraMat);
    aura.position.set(0, 0, -82.8);
    scene.add(aura);

    // === DUST MOTES — debu kosmik bergerak ke portal ===
    const dustCount = 150;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 5;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      dustPositions[i * 3 + 2] = -Math.random() * 70;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // === ANIMATION LOOP ===
    const startTime = Date.now();
    // Total durasi: 3.8 detik — cukup dramatis tapi tidak terlalu lama
    const totalDuration = 3800;
    let animFrameId: number;
    let finished = false;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Easing: lambat di awal, lalu akselerasi kuat di akhir (seperti tersedot)
      // Cubic ease-in yang kuat
      const eased = progress < 0.7
        ? (progress / 0.7) * (progress / 0.7) * (progress / 0.7) * 0.4
        : 0.4 + (((progress - 0.7) / 0.3) ** 2) * 0.6;

      const easedClamped = Math.min(eased, 1);

      // Kamera maju ke portal — jarak total ~80 unit
      camera.position.z = -easedClamped * 80;

      // Wobble kamera berkurang seiring mendekati portal
      const wobble = 1 - easedClamped;
      camera.position.x = Math.sin(elapsed * 0.0008) * 0.04 * wobble;
      camera.position.y = Math.cos(elapsed * 0.0006) * 0.03 * wobble;

      // FOV melebar sedikit saat tersedot — efek "ditarik"
      camera.fov = 75 + easedClamped * 20;
      camera.updateProjectionMatrix();

      // Background alpha: hitam pekat → transparan (homepage mulai kelihatan)
      // Mulai transparan di progress 0.65
      const bgAlpha = progress < 0.65
        ? 1
        : 1 - ((progress - 0.65) / 0.35) * 0.95;
      renderer.setClearColor(0x000000, Math.max(bgAlpha, 0.05));

      // Brightness overlay React
      setBrightness(bgAlpha);

      // Portal rim: muncul saat sudah dekat
      const portalVisible = Math.max(0, (easedClamped - 0.3) / 0.7);
      rimMat.opacity = portalVisible * 0.7 * (0.8 + Math.sin(elapsed * 0.004) * 0.2);
      auraMat.opacity = portalVisible * 0.25;

      // Star streaks: semakin cepat saat mendekati portal
      streakMat.opacity = Math.max(0, (easedClamped - 0.5) / 0.5) * 0.6;

      renderer.render(scene, camera);

      if (progress >= 1 && !finished) {
        finished = true;
        markPlayedInSession(); // simpan ke sessionStorage
        setFadeOut(true);
        setTimeout(() => {
          document.body.style.overflow = "";
          setShowSplash(false);
        }, 900);
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
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [showSplash]);

  // Sebelum client mount: render children langsung (SSR safe)
  // Ini penting untuk avoid hydration mismatch
  if (!mounted) {
    return <div key={pathname || "default"}>{children}</div>;
  }

  return (
    <div key={pathname || "default"}>
      {/* Homepage / children — terlihat melalui portal saat splash fade */}
      <motion.div
        initial={{ opacity: showSplash ? 0 : 1, scale: showSplash ? 1.06 : 1 }}
        animate={{
          opacity: !showSplash ? 1 : brightness < 0.25 ? 1 : 0,
          scale: !showSplash ? 1 : 1.06 - (1 - brightness) * 0.06,
        }}
        transition={{
          opacity: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        {children}
      </motion.div>

      {/* Three.js splash layer */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="intro-splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              pointerEvents: "all",
            }}
          >
            {/* Canvas Three.js */}
            <div
              ref={mountRef}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
              }}
            />

            {/* Overlay hitam tambahan di atas canvas — fade out */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "black",
                zIndex: 1,
                pointerEvents: "none",
              }}
              animate={{ opacity: brightness * 0.5 }}
              transition={{ duration: 0.05 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}