"use client";

import { useIsMobile } from "@/hooks/use-detect-mobile";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface ParallaxImageProps {
  imageUrl: string;
  intensity?: number;
  gyroIntensity?: number;
  lerpSpeed?: number;
  className?: string;
  debug?: boolean;
}

type GyroStatus = "idle" | "pending" | "granted" | "denied" | "unsupported";

export default function ParallaxImage({
  imageUrl,
  intensity = 0.04,
  gyroIntensity = 0.06,
  lerpSpeed = 0.045,
  className = "",
  debug = false,
}: ParallaxImageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const gyroEnabledRef = useRef(false);
  const gyroTargetRef = useRef({ x: 0, y: 0 });
  const baseOrientationRef = useRef<{ gamma: number; beta: number } | null>(null);

  const [gyroStatus, setGyroStatus] = useState<GyroStatus>("idle");
  const [debugInfo, setDebugInfo] = useState("");

  // Detect mobile
const isMobile = useIsMobile()

  // iOS 13+ needs permission via HTTPS + user gesture
  const needsPermission =
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown })
      .requestPermission === "function";

  const onOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      // Calibrate on first event
      if (!baseOrientationRef.current) {
        baseOrientationRef.current = { gamma: e.gamma, beta: e.beta };
        return;
      }

      const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

      const dx = clamp(
        (e.gamma - baseOrientationRef.current.gamma) / 45,
        -1,
        1
      );
      const dy = clamp(
        (e.beta - baseOrientationRef.current.beta) / 45,
        -1,
        1
      );

      gyroTargetRef.current = { x: dx, y: -dy };

      if (debug) {
        setDebugInfo(
          `γ:${e.gamma.toFixed(1)} β:${e.beta.toFixed(1)} | dx:${dx.toFixed(2)} dy:${dy.toFixed(2)}`
        );
      }
    },
    [debug]
  );

  const enableGyro = useCallback(async () => {
    setGyroStatus("pending");

    try {
      // iOS 13+ permission request — MUST be called from a user gesture
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

      // Test if deviceorientation actually fires (Android check)
      let fired = false;
      const testHandler = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null || e.beta !== null) fired = true;
      };
      window.addEventListener("deviceorientation", testHandler, { once: true });
      await new Promise((res) => setTimeout(res, 600));
      window.removeEventListener("deviceorientation", testHandler);

      if (!fired) {
        // Try absolute fallback (some Android browsers)
        window.addEventListener(
          "deviceorientationabsolute",
          onOrientation as EventListener,
          true
        );
      }

      gyroEnabledRef.current = true;
      baseOrientationRef.current = null; // reset calibration
      window.addEventListener("deviceorientation", onOrientation, true);
      setGyroStatus("granted");
    } catch (err) {
      console.error("Gyro error:", err);
      setGyroStatus("denied");
    }
  }, [needsPermission, onOrientation]);

  // Auto-enable on Android (no permission needed, works on HTTP too)
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

    let mesh: THREE.Mesh | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let texture: THREE.Texture | null = null;
    let raf = 0;

    const targetMouse = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);

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
        const g = gyroTargetRef.current;
        currentMouse.x = lerp(currentMouse.x, g.x, lerpSpeed);
        currentMouse.y = lerp(currentMouse.y, g.y, lerpSpeed);
      } else {
        currentMouse.x = lerp(currentMouse.x, targetMouse.x, lerpSpeed);
        currentMouse.y = lerp(currentMouse.y, targetMouse.y, lerpSpeed);
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
  }, [imageUrl, intensity, lerpSpeed]);

  // Cleanup gyro listeners on unmount
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
      {/* iOS: show button because permission requires user gesture */}
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
            : "🌀 Enable motion parallax"}
        </button>
      )}

      {/* Debug overlay — pass debug={true} to use */}
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