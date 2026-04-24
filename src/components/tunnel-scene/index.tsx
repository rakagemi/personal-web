"use client";

import { FLAIRS_IMAGES } from "@/common/constants/flair-images-cursor";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const FLAIR_COUNT          = FLAIRS_IMAGES.length;
const TUNNEL_LENGTH        = 120;
const SPREAD_RADIUS        = 14;
const FLAIR_SIZE           = 3.5;
const ROTATION_SPEED       = 0.0012;
const FLAIR_APPROACH_SPEED = 0.2;

const PARALLAX_X    = 3.5;
const PARALLAX_Y    = 2.2;
const PARALLAX_LERP = 0.055; // desktop mouse smoothing
const GYRO_LERP     = 0.06;  // gyro smoothing (slightly faster feel)

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface FlairObject {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  selfRotSpeed: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pixel starfield canvas texture
// ─────────────────────────────────────────────────────────────────────────────
function buildStarfieldTexture(w: number, h: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);
  const tiers = [
    { count: 900, size: 1, opacity: 0.5  },
    { count: 280, size: 2, opacity: 0.75 },
    { count: 55,  size: 3, opacity: 1.0  },
  ];
  for (const { count, size, opacity } of tiers) {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const b = Math.floor(200 + Math.random() * 55);
      ctx.fillStyle = `rgba(${b},${b},${b},${opacity})`;
      ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
    }
  }
  return new THREE.CanvasTexture(canvas);
}

// ─────────────────────────────────────────────────────────────────────────────
// iOS 13+ requires a user-gesture to call requestPermission().
// Android & older iOS: DeviceOrientationEvent fires without any permission.
// We show a tap-overlay only when requestPermission actually exists.
// ─────────────────────────────────────────────────────────────────────────────
function requestGyroPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    // SSR / Node guard — DeviceOrientationEvent doesn't exist server-side
    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      resolve(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = DeviceOrientationEvent as any;

    // Android / older iOS: no permission API → gyro just works
    if (typeof DOE.requestPermission !== "function") {
      resolve(true);
      return;
    }

    // iOS 13+: must call from a user gesture → show tap overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = [
      "position:fixed;inset:0;z-index:9999",
      "display:flex;align-items:center;justify-content:center",
      "background:rgba(0,0,0,0.78)",
    ].join(";");

    const btn = document.createElement("button");
    btn.innerText = "Tap to enable motion";
    btn.style.cssText = [
      "color:#fff;background:transparent",
      "border:1px solid rgba(255,255,255,0.4)",
      "padding:14px 28px;font-size:15px;border-radius:8px",
      "cursor:pointer;letter-spacing:.05em",
    ].join(";");

    overlay.appendChild(btn);
    document.body.appendChild(overlay);

    btn.addEventListener("click", async () => {
      document.body.removeChild(overlay);
      try {
        const result = await DOE.requestPermission();
        resolve(result === "granted");
      } catch {
        resolve(false);
      }
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function SpaceTunnel() {
  const mountRef  = useRef<HTMLDivElement>(null);
  // Shared input target in [-1, 1] — written by mouse / gyro / touch
  const inputRef  = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const isMobile =
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      "ontouchstart" in window;

    // ── Scene ───────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.016);

    // ── Camera ──────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(72, W / H, 0.1, 400);
    camera.position.set(0, 0, 0);

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // ── Pixel starfield billboard ────────────────────────────────────────────
    const sfTex  = buildStarfieldTexture(1024, 512);
    const sfGeo  = new THREE.PlaneGeometry(380, 190);
    const sfMat  = new THREE.MeshBasicMaterial({ map: sfTex, depthWrite: false, fog: false });
    const sfMesh = new THREE.Mesh(sfGeo, sfMat);
    sfMesh.position.z = -340;
    scene.add(sfMesh);

    // Mid-distance star particles
    const starCount = 1800;
    const starPos   = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 280;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
      starPos[i * 3 + 2] = -(10 + Math.random() * 200);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.5, sizeAttenuation: true, transparent: true, opacity: 0.85,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── Flair sprites ────────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    const flairs: FlairObject[] = [];

    FLAIRS_IMAGES.forEach((src, i) => {
      const texture = loader.load(src);
      texture.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({
        map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      });
      const geo  = new THREE.PlaneGeometry(FLAIR_SIZE, FLAIR_SIZE);
      const mesh = new THREE.Mesh(geo, mat);

      const segment      = TUNNEL_LENGTH / FLAIR_COUNT;
      const initZ        = -(i * segment + Math.random() * segment * 0.7 + 5);
      const orbitRadius  = SPREAD_RADIUS * (0.25 + Math.random() * 0.75);
      const orbitAngle   = (i / FLAIR_COUNT) * Math.PI * 2 + Math.random() * 0.9;
      const orbitSpeed   = (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.006);
      const selfRotSpeed = (Math.random() - 0.5) * 0.035;

      mesh.position.set(Math.cos(orbitAngle) * orbitRadius, Math.sin(orbitAngle) * orbitRadius, initZ);
      scene.add(mesh);
      flairs.push({ mesh, orbitRadius, orbitAngle, orbitSpeed, selfRotSpeed });
    });

    // ────────────────────────────────────────────────────────────────────────
    // INPUT — cleanup registry
    // ────────────────────────────────────────────────────────────────────────
    const cleanupFns: (() => void)[] = [];
    let lerpSpeed = PARALLAX_LERP;

    if (!isMobile) {
      // ── Desktop: mouse ────────────────────────────────────────────────────
      const onMouseMove = (e: MouseEvent) => {
        inputRef.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
        inputRef.current.y =  (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("mousemove", onMouseMove);
      cleanupFns.push(() => window.removeEventListener("mousemove", onMouseMove));

    } else {
      // ── Mobile ────────────────────────────────────────────────────────────
      lerpSpeed = GYRO_LERP;

      // Baseline — captured from the first gyro event so resting position = (0, 0)
      let baseGamma: number | null = null;
      let baseBeta:  number | null = null;
      let gyroFired = false;

      const onOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma === null || e.beta === null) return;

        // Capture resting baseline on very first event
        if (baseGamma === null) baseGamma = e.gamma;
        if (baseBeta  === null) baseBeta  = e.beta;

        gyroFired = true;

        // Delta from baseline, clamped ±40°, normalised to [-1, 1]
        const dg = Math.max(-40, Math.min(40, e.gamma - baseGamma));
        const db = Math.max(-40, Math.min(40, e.beta  - baseBeta));

        inputRef.current.x =  dg / 40; // tilt right → positive X
        inputRef.current.y = -db / 40; // tilt toward user → negative Y (natural)
      };

      // Touch drag — only when gyro has never fired (true fallback)
      let txStart = 0, tyStart = 0, txBase = 0, tyBase = 0;

      const onTouchStart = (e: TouchEvent) => {
        if (gyroFired) return;
        txStart = e.touches[0].clientX;
        tyStart = e.touches[0].clientY;
        txBase  = inputRef.current.x;
        tyBase  = inputRef.current.y;
      };
      const onTouchMove = (e: TouchEvent) => {
        if (gyroFired) return;
        e.preventDefault();
        const dx = (e.touches[0].clientX - txStart) / window.innerWidth;
        const dy = (e.touches[0].clientY - tyStart) / window.innerHeight;
        inputRef.current.x = Math.max(-1, Math.min(1, txBase + dx * 2));
        inputRef.current.y = Math.max(-1, Math.min(1, tyBase + dy * 2));
      };

      mount.addEventListener("touchstart", onTouchStart, { passive: true });
      mount.addEventListener("touchmove",  onTouchMove,  { passive: false });
      cleanupFns.push(
        () => mount.removeEventListener("touchstart", onTouchStart),
        () => mount.removeEventListener("touchmove",  onTouchMove),
      );

      // Request permission (shows overlay on iOS 13+, no-op on Android)
      // then register the deviceorientation listener AFTER permission is granted
      requestGyroPermission().then((granted) => {
        if (granted) {
          window.addEventListener("deviceorientation", onOrientation);
          cleanupFns.push(() => window.removeEventListener("deviceorientation", onOrientation));
        } else {
          console.info("[SpaceTunnel] Gyro unavailable — touch drag active.");
        }
      });
    }

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);
    cleanupFns.push(() => window.removeEventListener("resize", onResize));

    // ── Animate ───────────────────────────────────────────────────────────────
    let camAngle = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth input
      const sm = smoothRef.current;
      const tg = inputRef.current;
      sm.x += (tg.x - sm.x) * lerpSpeed;
      sm.y += (tg.y - sm.y) * lerpSpeed;

      // Camera: slow drift + parallax from input
      camAngle += ROTATION_SPEED;
      camera.position.x = Math.sin(camAngle * 0.6) * 0.35 + sm.x * PARALLAX_X;
      camera.position.y = Math.cos(camAngle * 0.4) * 0.2  - sm.y * PARALLAX_Y;
      camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, -14);

      // Starfield parallax (slower than camera for depth illusion)
      sfMesh.position.x =  sm.x * 7;
      sfMesh.position.y = -sm.y * 5;

      // Flair update
      flairs.forEach((f) => {
        f.orbitAngle    += f.orbitSpeed;
        f.mesh.position.z += FLAIR_APPROACH_SPEED;

        if (f.mesh.position.z > 7) {
          f.mesh.position.z = -(TUNNEL_LENGTH + Math.random() * 14);
          f.orbitAngle = Math.random() * Math.PI * 2;
        }

        f.mesh.position.x = Math.cos(f.orbitAngle) * f.orbitRadius;
        f.mesh.position.y = Math.sin(f.orbitAngle) * f.orbitRadius;
        f.mesh.lookAt(camera.position);
        f.mesh.rotateZ(f.selfRotSpeed);

        const dist = Math.abs(f.mesh.position.z - camera.position.z);
        const mat  = f.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity =
          dist < 6
            ? Math.max(0, dist / 6)
            : dist > TUNNEL_LENGTH * 0.65
            ? Math.max(0, 1 - (dist - TUNNEL_LENGTH * 0.65) / (TUNNEL_LENGTH * 0.35))
            : 1;
        f.mesh.scale.setScalar(
          THREE.MathUtils.clamp(0.35 + (1 - dist / TUNNEL_LENGTH) * 1.9, 0.35, 2.4)
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      cleanupFns.forEach((fn) => fn());
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      sfGeo.dispose(); sfMat.dispose(); sfTex.dispose();
      starGeo.dispose(); starMat.dispose();
      flairs.forEach((f) => {
        f.mesh.geometry.dispose();
        (f.mesh.material as THREE.MeshBasicMaterial).dispose();
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000000",
        position: "relative",
        cursor: "crosshair",
        touchAction: "none",
      }}
    />
  );
}