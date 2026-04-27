"use client";

import { useIsMobile } from "@/hooks/use-detect-mobile";
import { useEffect, useRef, useState, useCallback } from "react";
import { Mesh, PlaneGeometry, ShaderMaterial, Texture } from "three";

interface ParallaxImageProps {
  imageUrl: string;
  intensity?: number;
  gyroIntensity?: number;
  lerpSpeed?: number;
  lerpSpeedY?: number;
  gyroSmoothing?: number;
  className?: string;
  debug?: boolean;
}

type GyroStatus = "idle" | "pending" | "granted" | "denied" | "unsupported";

const THREE = await import('three')

export default function ParallaxImage({
  imageUrl,
  intensity = 0.04,
  gyroIntensity = 0.06,
  lerpSpeed = 0.045,
  lerpSpeedY = 0.028,      // Lebih lambat dari X → geser atas-bawah terasa lebih smooth
  gyroSmoothing = 0.15,    // Pre-smooth gyro sebelum masuk lerp utama
  className = "",
  debug = false,
}: ParallaxImageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const gyroEnabledRef = useRef(false);
  const gyroTargetRef = useRef({ x: 0, y: 0 });
  const gyroSmoothedRef = useRef({ x: 0, y: 0 }); // Buffer smooth gyro
  const baseOrientationRef = useRef<{ gamma: number; beta: number } | null>(null);

  const [gyroStatus, setGyroStatus] = useState<GyroStatus>("idle");
  const [debugInfo, setDebugInfo] = useState("");

  const isMobile = useIsMobile();

  const needsPermission =
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown })
      .requestPermission === "function";

  const onOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      if (!baseOrientationRef.current) {
        baseOrientationRef.current = { gamma: e.gamma, beta: e.beta };
        return;
      }

      const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

      // Dead zone kecil untuk filter noise sensor
      const deadZone = 0.5; // derajat
      const rawDx = e.gamma - baseOrientationRef.current.gamma;
      const rawDy = e.beta - baseOrientationRef.current.beta;

      const filteredDx = Math.abs(rawDx) < deadZone ? 0 : rawDx;
      const filteredDy = Math.abs(rawDy) < deadZone ? 0 : rawDy;

      const dx = clamp(filteredDx / 45, -1, 1);
      const dy = clamp(filteredDy / 45, -1, 1);

      // Pre-smooth target gyro (satu layer lerp sebelum masuk animate loop)
      gyroSmoothedRef.current.x +=
        (dx - gyroSmoothedRef.current.x) * gyroSmoothing;
      gyroSmoothedRef.current.y +=
        (-dy - gyroSmoothedRef.current.y) * gyroSmoothing;

      gyroTargetRef.current = {
        x: gyroSmoothedRef.current.x,
        y: gyroSmoothedRef.current.y,
      };

      if (debug) {
        setDebugInfo(
          `γ:${e.gamma.toFixed(1)} β:${e.beta.toFixed(1)} | dx:${dx.toFixed(2)} dy:${dy.toFixed(2)}`
        );
      }
    },
    [debug, gyroSmoothing]
  );

  const enableGyro = useCallback(async () => {
    setGyroStatus("pending");

    try {
      if (needsPermission) {
        const result = await (
          DeviceOrientationEvent as unknown as {
            requestPermission: () => Promise<"granted" | "denied">;
          }
        ).requestPermission();

        if (result !== "granted") {
          setGyroStatus("denied");
          return;
        }
      }

      let fired = false;
      const testHandler = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null || e.beta !== null) fired = true;
      };
      window.addEventListener("deviceorientation", testHandler, { once: true });
      await new Promise((res) => setTimeout(res, 600));
      window.removeEventListener("deviceorientation", testHandler);

      if (!fired) {
        window.addEventListener(
          "deviceorientationabsolute",
          onOrientation as EventListener,
          true
        );
      }

      gyroEnabledRef.current = true;
      baseOrientationRef.current = null;
      gyroSmoothedRef.current = { x: 0, y: 0 };
      window.addEventListener("deviceorientation", onOrientation, true);
      setGyroStatus("granted");
    } catch (err) {
      console.error("Gyro error:", err);
      setGyroStatus("denied");
    }
  }, [needsPermission, onOrientation]);

  useEffect(() => {
    if (!isMobile || needsPermission) return;

    if (typeof DeviceOrientationEvent === "undefined") {
      const t = setTimeout(() => setGyroStatus("unsupported"), 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => enableGyro(), 0);
    return () => clearTimeout(t);
  }, [isMobile, needsPermission, enableGyro]);

  // Three.js setup
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    mount.appendChild(renderer.domElement);

    let mesh: Mesh | null = null;
    let material: ShaderMaterial | null = null;
    let geometry: PlaneGeometry | null = null;
    let texture: Texture | null = null;
    let raf = 0;

    const targetMouse = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);
    // Buffer kedua khusus Y untuk double-lerp → extra smooth
    const smoothMouseY = { value: 0 };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      if (texture && material) {
        const img = texture.image as HTMLImageElement | HTMLCanvasElement | ImageBitmap;
        if ("width" in img && "height" in img) {
          const imgAspect = img.width / img.height;
          const planeAspect = w / h;
          const scaleX =
            imgAspect > planeAspect ? imgAspect / planeAspect : 1;
          const scaleY =
            imgAspect > planeAspect ? 1 : planeAspect / imgAspect;
          material.uniforms.uScale.value.set(scaleX, scaleY);
        }
      }

      if (mesh) {
        geometry?.dispose();
        geometry = new THREE.PlaneGeometry(2 * (w / h), 2, 32, 32);
        mesh.geometry = geometry;
      }
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (gyroEnabledRef.current) {
        // Pakai gyroIntensity saat gyro aktif
        if (material) material.uniforms.uIntensity.value = gyroIntensity;

        const g = gyroTargetRef.current;

        // X: lerp normal
        currentMouse.x = lerp(currentMouse.x, g.x, lerpSpeed);

        // Y: double-lerp → pre-smooth dulu ke buffer, baru lerp ke currentMouse
        smoothMouseY.value = lerp(smoothMouseY.value, g.y, lerpSpeedY);
        currentMouse.y = lerp(currentMouse.y, smoothMouseY.value, lerpSpeedY);
      } else {
        // Pakai intensity normal saat mouse
        if (material) material.uniforms.uIntensity.value = intensity;

        // Mouse X: lerp normal
        currentMouse.x = lerp(currentMouse.x, targetMouse.x, lerpSpeed);

        // Mouse Y: double-lerp untuk extra smooth
        smoothMouseY.value = lerp(smoothMouseY.value, targetMouse.y, lerpSpeedY);
        currentMouse.y = lerp(currentMouse.y, smoothMouseY.value, lerpSpeedY);
      }

      if (material) material.uniforms.uMouse.value.copy(currentMouse);
      renderer.render(scene, camera);
    };

    const onMove = (e: MouseEvent) => {
      if (gyroEnabledRef.current) return;
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetMouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onLeave = () => {
      if (!gyroEnabledRef.current) targetMouse.set(0, 0);
    };

    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        texture = tex;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);

        const imgAspect = tex.image.width / tex.image.height;
        const planeAspect = w / h;
        const scaleX = imgAspect > planeAspect ? imgAspect / planeAspect : 1;
        const scaleY = imgAspect > planeAspect ? 1 : planeAspect / imgAspect;

        material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: tex },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uIntensity: { value: intensity },
            uScale: { value: new THREE.Vector2(scaleX, scaleY) },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexture;
            uniform vec2 uMouse;
            uniform float uIntensity;
            uniform vec2 uScale;
            varying vec2 vUv;
            void main() {
              vec2 uv = (vUv - 0.5) / uScale + 0.5;
              vec2 p = uv + uMouse * uIntensity;
              gl_FragColor = texture2D(uTexture, p);
            }
          `,
        });

        geometry = new THREE.PlaneGeometry(2 * (w / h), 2, 32, 32);
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        animate();
      },
      undefined,
      () => animate()
    );

    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      mount.removeEventListener("mousemove", onMove);
      mount.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      if (mesh) scene.remove(mesh);
      geometry?.dispose();
      material?.dispose();
      texture?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, [imageUrl, intensity, gyroIntensity, lerpSpeed, lerpSpeedY]);

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener(
        "deviceorientationabsolute",
        onOrientation as EventListener
      );
    };
  }, [onOrientation]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}
    >
      {isMobile && needsPermission && gyroStatus !== "granted" && (
        <button
          onClick={enableGyro}
          style={{
            position: "absolute",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            padding: "10px 20px",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 999,
            fontSize: 13,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {gyroStatus === "pending"
            ? "Requesting…"
            : gyroStatus === "denied"
            ? "⚠️ Motion denied — tap to retry"
            : "🌀 Enable motion!"}
        </button>
      )}

      {isMobile && debug && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 8,
            zIndex: 20,
            padding: "6px 10px",
            background: "rgba(0,0,0,0.75)",
            color: "#00ff88",
            fontFamily: "monospace",
            fontSize: 11,
            borderRadius: 6,
            pointerEvents: "none",
            lineHeight: 1.6,
          }}
        >
          <div>status: {gyroStatus}</div>
          <div>iOS perm: {needsPermission ? "yes" : "no"}</div>
          <div>mobile: {isMobile ? "yes" : "no"}</div>
          <div>{debugInfo || "no events yet"}</div>
        </div>
      )}
    </div>
  );
}