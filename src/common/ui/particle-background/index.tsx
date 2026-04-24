"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

// Bentuk-bentuk geometris sebagai SVG path
const SHAPES = [
  // circle
  (color: string, size: number) =>
    `ircle r="${size / 2}" fill="${color}" />`,
  // square
  (color: string, size: number) =>
    `<rect x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" fill="${color}" />`,
  // triangle
  (color: string, size: number) =>
    `<polygon points="0,${-size / 2} ${size / 2},${size / 2} ${-size / 2},${size / 2}" fill="${color}" />`,
  // star
  (color: string, size: number) => {
    const s = size / 2;
    return `<polygon points="0,${-s} ${s * 0.2},${-s * 0.2} ${s},${-s * 0.2} ${s * 0.35},${s * 0.25} ${s * 0.6},${s} 0,${s * 0.5} ${-s * 0.6},${s} ${-s * 0.35},${s * 0.25} ${-s},${-s * 0.2} ${-s * 0.2},${-s * 0.2}" fill="${color}" />`;
  },
  // diamond
  (color: string, size: number) =>
    `<polygon points="0,${-size / 2} ${size / 2},0 0,${size / 2} ${-size / 2},0" fill="${color}" />`,
];

const COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#ff6bff", "#ff9a3c", "#00d4ff", "#c77dff",
  "#f72585", "#4cc9f0",
];

// Generate waypoints path yang meliuk-liuk
function generateWaypointPath(w: number, h: number): string {
  const points = [];
  const segments = 8;
  for (let i = 0; i <= segments; i++) {
    const x = (w / segments) * i + (Math.random() - 0.5) * (w / 4);
    const y = h / 2 + Math.sin((i / segments) * Math.PI * 2) * (h / 3) + (Math.random() - 0.5) * (h / 4);
    points.push(`${x},${Math.max(20, Math.min(h - 20, y))}`);
  }
  return `M ${points.join(" L ")}`;
}

export default function ParticleBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const PARTICLE_COUNT = 40;
    const particles: SVGGElement[] = [];

    // Buat partikel
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = gsap.utils.random(8, 24);
      const shapeIndex = Math.floor(Math.random() * SHAPES.length);

      g.innerHTML = SHAPES[shapeIndex](color, size);
      g.style.opacity = "0";
      svg.appendChild(g);
      particles.push(g);
    }

    // Animasi tiap partikel
    particles.forEach((particle, i) => {
      const pathD = generateWaypointPath(w, h);

      // Buat invisible path element
      const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", pathD);
      pathEl.setAttribute("fill", "none");
      pathEl.setAttribute("stroke", "none");
      svg.appendChild(pathEl);

      const delay = (i / PARTICLE_COUNT) * 6 + Math.random() * 2;
      const duration = gsap.utils.random(8, 18);

      gsap.set(particle, { opacity: gsap.utils.random(0.5, 1) });

      gsap.to(particle, {
        duration,
        repeat: -1,
        delay,
        ease: "none",
        motionPath: {
          path: pathEl,
          align: pathEl,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        onRepeat() {
          // Generate path baru tiap loop agar terlihat acak
          const newD = generateWaypointPath(w, h);
          pathEl.setAttribute("d", newD);
        },
      });

      // Rotation mandiri
      gsap.to(particle, {
        rotation: gsap.utils.random([-360, 360]),
        duration: gsap.utils.random(3, 8),
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      // Pulse opacity
      gsap.to(particle, {
        opacity: gsap.utils.random(0.2, 0.5),
        duration: gsap.utils.random(1.5, 4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3,
      });
    });

    // Resize handler
    const handleResize = () => {
      svg.setAttribute("width", String(window.innerWidth));
      svg.setAttribute("height", String(window.innerHeight));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(particles);
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        backgroundColor: "transparent",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  );
}