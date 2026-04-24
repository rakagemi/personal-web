"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type IOSIconProps = {
    src: string;
    alt: string;
    bgClassName?: string;
    sizeClassName?: string;
};

export function IOSIcon({
    src,
    alt,
    bgClassName = "bg-neutral-900",
    sizeClassName = "size-[72px]",
}: IOSIconProps) {
    const [pressed, setPressed] = React.useState(false);

    React.useEffect(() => {
        if (!pressed) return;

        const timeout = window.setTimeout(() => {
            setPressed(false);
        }, 180);

        return () => window.clearTimeout(timeout);
    }, [pressed]);

    return (
        <motion.div
            onTapStart={() => setPressed(true)}
            whileHover={{
                y: -2,
                scale: 1.025,
            }}
            whileTap={{
                scale: 0.94,
                y: 1.5,
            }}
            animate={{
                scale: pressed ? 0.97 : 1,
                y: pressed ? 1 : 0,
                filter: pressed
                    ? "saturate(0.98) brightness(0.985)"
                    : "saturate(1) brightness(1)",
            }}
            transition={{
                type: "spring",
                stiffness: 420,
                damping: 26,
                mass: 0.7,
            }}
            className={[
                "group relative overflow-hidden gw-btn-icon",
                // "shadow-[0_10px_30px_rgba(0,0,0,0.10),0_2px_10px_rgba(0,0,0,0.06)]",
                // "ring-1 ring-black/5 dark:ring-white/10",
                "select-none",
                bgClassName,
                sizeClassName,
            ].join(" ")}
            style={{
                borderRadius: "22.37%",
            }}
        >
            <div className="relative h-full w-full p-[16%]">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 72px, 72px"
                    className="object-contain"
                    draggable={false}
                />
            </div>

            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                initial={false}
                animate={{
                    opacity: pressed ? 0.12 : 0,
                }}
                transition={{
                    duration: 0.18,
                    ease: "easeOut",
                }}
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
                }}
            />
        </motion.div>
    );
}