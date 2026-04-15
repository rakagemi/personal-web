'use client';

import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from "framer-motion";
import { cn } from "@/utils";
import React, { useRef, useState } from "react";

export interface TechItem {
    id: string | number;
    name: string;
    icon: React.ReactNode;
}

interface InfiniteCardProps {
    items: TechItem[];
    className?: string;
    speed?: number;
    direction?: "left" | "right";
}

export default function InfiniteCard({
    items,
    className,
    speed = 1.5,
    direction = "left",
}: InfiniteCardProps) {
    const baseX = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    const currentSpeed = useRef(speed);

    // Engine Animasi Kustom yang berjalan setiap frame browser (60fps/120fps)
    useAnimationFrame((t, delta) => {
        // Jika di-hover, target kecepatannya turun jadi 20% (sangat lambat)
        const targetSpeed = isHovered ? speed * 0.2 : speed;

        // Rumus Lerp: Menciptakan efek perlambatan/percepatan yang sangat 'smooth'
        currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.1;

        // Tentukan arah geseran
        const moveBy = direction === "left" ? -currentSpeed.current : currentSpeed.current;

        // Update posisi X (menggunakan delta agar kecepatan stabil meski FPS drop)
        baseX.set(baseX.get() + moveBy * (delta / 1000) * 10);
    });

    // RAHASIA RUANG KOSONG:
    // Karena kita me-render 4 Set (100%), 1 Set setara dengan 25%.
    // Kita pangkas dan putar balik animasinya (wrap) secara instan saat mencapai -25% atau 0%.
    const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

    return (
        <div
            className={cn(
                "relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="flex w-max min-w-full shrink-0 items-center gap-4 py-4 will-change-transform"
                style={{ x }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <div
                        key={`${item.id}-${i}`}

                        className="flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 transition-colors cursor-default border border-white/20 dark:border-white/10
                                    bg-white/10 dark:bg-white/5
                                    backdrop-blur-xl
                                    shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_rgba(0,0,0,0.10)] duration-300 ease-out
                                    hover:bg-white/16 dark:hover:bg-white/8
                                    hover:border-white/30 dark:hover:border-white/15
                                    hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_28px_rgba(0,0,0,0.16)]"
                    >
                        <span className="flex items-center justify-center text-xl">
                            {item.icon}
                        </span>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-300">
                            {item.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}