"use client";

import { useEffect, useRef } from "react";

type Theme = "light" | "dark";

interface ArchitectBackgroundProps {
    theme?: Theme;
    className?: string;
}

// ─── Theming (grid & bg only) ─────────────────────────────────────────────────
const THEMES = {
    light: {
        bg: "#F5F4EF",
        gridMinor: "rgba(0,0,0,0.06)",
        gridMajor: "rgba(0,0,0,0.13)",
        gridMajorBold: "rgba(0,0,0,0.22)",
        dot: "rgba(0,0,0,0.20)",
        crosshairAccent: "rgba(0,0,0,0.55)",
        marginLine: "rgba(0,0,0,0.08)",
        annotation: "rgba(0,0,0,0.22)",
    },
    dark: {
        bg: "#0D0E0F",
        gridMinor: "rgba(255,255,255,0.04)",
        gridMajor: "rgba(255,255,255,0.09)",
        gridMajorBold: "rgba(255,255,255,0.18)",
        dot: "rgba(255,255,255,0.18)",
        crosshairAccent: "rgba(255,255,255,0.50)",
        marginLine: "rgba(255,255,255,0.06)",
        annotation: "rgba(255,255,255,0.18)",
    },
} as const;

// ─── Particle color palette (fixed, tidak ikut theme) ─────────────────────────
const PARTICLE_COLORS = [
    { fill: "#3B82F6", stroke: "#1D4ED8", trail: "rgba(59,130,246,0.22)" },
    { fill: "#F59E0B", stroke: "#D97706", trail: "rgba(245,158,11,0.22)" },
    { fill: "#10B981", stroke: "#059669", trail: "rgba(16,185,129,0.22)" },
    { fill: "#EF4444", stroke: "#DC2626", trail: "rgba(239,68,68,0.22)" },
    { fill: "#8B5CF6", stroke: "#7C3AED", trail: "rgba(139,92,246,0.22)" },
    { fill: "#EC4899", stroke: "#DB2777", trail: "rgba(236,72,153,0.22)" },
    { fill: "#06B6D4", stroke: "#0891B2", trail: "rgba(6,182,212,0.22)" },
    { fill: "#F97316", stroke: "#EA580C", trail: "rgba(249,115,22,0.22)" },
];

// ─── Grid constants ────────────────────────────────────────────────────────────
const MINOR_CELL = 20;
const MAJOR_EVERY = 5;
const BOLD_EVERY = 10;

// ─── Particle types ────────────────────────────────────────────────────────────
type ParticleShape = "circle" | "cross" | "square" | "triangle" | "hexagon";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    shape: ParticleShape;
    rotation: number;
    rotSpeed: number;
    opacity: number;
    trail: { x: number; y: number }[];
    phase: number;
    phaseSpeed: number;
    colorIndex: number;
}

const SHAPES: ParticleShape[] = ["circle", "cross", "square", "triangle", "hexagon"];

function makeParticle(W: number, H: number): Particle {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 0.55;
    return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 6,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.55 + Math.random() * 0.40,
        trail: [],
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.008 + Math.random() * 0.012,
        colorIndex: Math.floor(Math.random() * PARTICLE_COLORS.length),
    };
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────
function drawShape(
    ctx: CanvasRenderingContext2D,
    p: Particle,
    fill: string,
    stroke: string
) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;

    const s = p.size;
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    ctx.lineWidth = 1;
    ctx.beginPath();

    switch (p.shape) {
        case "circle":
            ctx.arc(0, 0, s, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case "square":
            ctx.rect(-s, -s, s * 2, s * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case "cross": {
            const arm = s * 1.4;
            const w = s * 0.38;
            ctx.rect(-w, -arm, w * 2, arm * 2);
            ctx.rect(-arm, -w, arm * 2, w * 2);
            ctx.fill();
            ctx.stroke();
            break;
        }
        case "triangle":
            ctx.moveTo(0, -s * 1.2);
            ctx.lineTo(s * 1.05, s * 0.7);
            ctx.lineTo(-s * 1.05, s * 0.7);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case "hexagon":
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i;
                i === 0
                    ? ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s)
                    : ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
    }
    ctx.restore();
}

function drawTrail(
    ctx: CanvasRenderingContext2D,
    p: Particle,
    trailColor: string
) {
    if (p.trail.length < 2) return;
    ctx.save();
    ctx.strokeStyle = trailColor;
    ctx.lineWidth = p.size * 0.35;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(p.trail[0].x, p.trail[0].y);
    for (let i = 1; i < p.trail.length; i++) {
        ctx.globalAlpha = (i / p.trail.length) * p.opacity * 0.6;
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
    }
    ctx.stroke();
    ctx.restore();
}

// ─── Grid draw ────────────────────────────────────────────────────────────────
function drawGrid(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    theme: (typeof THEMES)[Theme]
) {
    const colsMinor = Math.ceil(W / MINOR_CELL) + 1;
    const rowsMinor = Math.ceil(H / MINOR_CELL) + 1;

    for (let c = 0; c < colsMinor; c++) {
        const x = c * MINOR_CELL;
        const isMajor = c % MAJOR_EVERY === 0;
        const isBold = c % BOLD_EVERY === 0;
        ctx.strokeStyle = isBold ? theme.gridMajorBold : isMajor ? theme.gridMajor : theme.gridMinor;
        ctx.lineWidth = isBold ? 1 : isMajor ? 0.65 : 0.4;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
    }
    for (let r = 0; r < rowsMinor; r++) {
        const y = r * MINOR_CELL;
        const isMajor = r % MAJOR_EVERY === 0;
        const isBold = r % BOLD_EVERY === 0;
        ctx.strokeStyle = isBold ? theme.gridMajorBold : isMajor ? theme.gridMajor : theme.gridMinor;
        ctx.lineWidth = isBold ? 1 : isMajor ? 0.65 : 0.4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    // Dots at minor intersections
    ctx.fillStyle = theme.dot;
    for (let c = 0; c < colsMinor; c++) {
        for (let r = 0; r < rowsMinor; r++) {
            if (c % MAJOR_EVERY === 0 || r % MAJOR_EVERY === 0) continue;
            ctx.beginPath();
            ctx.arc(c * MINOR_CELL, r * MINOR_CELL, 0.9, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Crosshairs at bold intersections
    const crossSize = 10;
    ctx.strokeStyle = theme.crosshairAccent;
    ctx.lineWidth = 0.8;
    for (let c = 0; c * MINOR_CELL <= W; c += BOLD_EVERY) {
        for (let r = 0; r * MINOR_CELL <= H; r += BOLD_EVERY) {
            const cx = c * MINOR_CELL;
            const cy = r * MINOR_CELL;
            ctx.beginPath();
            ctx.moveTo(cx - crossSize, cy);
            ctx.lineTo(cx + crossSize, cy);
            ctx.moveTo(cx, cy - crossSize);
            ctx.lineTo(cx, cy + crossSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Margin dashed border
    const margin = 40;
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = theme.marginLine;
    ctx.lineWidth = 0.7;
    ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);
    ctx.setLineDash([]);

    // Corner tick marks
    const tickLen = 12;
    const corners = [
        [margin, margin],
        [W - margin, margin],
        [W - margin, H - margin],
        [margin, H - margin],
    ];
    ctx.strokeStyle = theme.annotation;
    ctx.lineWidth = 1;
    for (const [cx, cy] of corners) {
        const sx = cx === margin ? 1 : -1;
        const sy = cy === margin ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx!, cy!);
        ctx.lineTo(cx! + sx * tickLen, cy!);
        ctx.moveTo(cx!, cy!);
        ctx.lineTo(cx!, cy! + sy * tickLen);
        ctx.stroke();
    }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ArchitectBackground({
    theme = "light",
    className = "",
}: ArchitectBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);
    const stateRef = useRef<{ particles: Particle[] }>({ particles: [] });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const PARTICLE_COUNT = 38;
        const TRAIL_LENGTH = 22;

        let W = 0;
        let H = 0;

        function resize() {
            W = canvas!.offsetWidth;
            H = canvas!.offsetHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas!.width = W * dpr;
            canvas!.height = H * dpr;
            ctx!.scale(dpr, dpr);

            if (stateRef.current.particles.length === 0) {
                stateRef.current.particles = Array.from({ length: PARTICLE_COUNT }, () =>
                    makeParticle(W, H)
                );
            }
        }

        function tick() {
            const t = THEMES[theme];
            ctx!.clearRect(0, 0, W, H);

            ctx!.fillStyle = t.bg;
            ctx!.fillRect(0, 0, W, H);

            drawGrid(ctx!, W, H, t);

            const particles = stateRef.current.particles;
            for (const p of particles) {
                const color = PARTICLE_COLORS[p.colorIndex];

                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > TRAIL_LENGTH) p.trail.shift();

                p.x += p.vx;
                p.y += p.vy;

                p.phase += p.phaseSpeed;
                p.vx += Math.sin(p.phase * 1.3) * 0.004;
                p.vy += Math.cos(p.phase) * 0.004;

                const spd = Math.hypot(p.vx, p.vy);
                if (spd > 1.0) { p.vx /= spd; p.vy /= spd; }

                p.rotation += p.rotSpeed;

                const pad = p.size * 2;
                if (p.x < -pad) { p.x = W + pad; p.trail = []; }
                if (p.x > W + pad) { p.x = -pad; p.trail = []; }
                if (p.y < -pad) { p.y = H + pad; p.trail = []; }
                if (p.y > H + pad) { p.y = -pad; p.trail = []; }

                drawTrail(ctx!, p, color.trail);
                drawShape(ctx!, p, color.fill, color.stroke);
            }

            rafRef.current = requestAnimationFrame(tick);
        }

        resize();
        window.addEventListener("resize", resize);
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={className}
            style={{
                display: "block",
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
            }}
        />
    );
}