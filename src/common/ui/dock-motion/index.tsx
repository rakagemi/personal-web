"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
    motion,
    MotionValue,
    animate,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import { useRef } from "react";

type SocialLink = {
    name: string;
    url: string;
    image: string;
    image_colour?: string | undefined;
    active?: boolean;
};

const DISTANCE = 130;
const MAGNIFY = 1.75;
const NUDGE = 10;

const SPRING = {
    mass: 0.14,
    stiffness: 260,
    damping: 20,
};

function DockIcon({
    link,
    mouseX,
}: {
    link: SocialLink;
    mouseX: MotionValue<number>;
}) {
    const ref = useRef<HTMLAnchorElement>(null);
    const bounceY = useMotionValue(0);

    const distance = useTransform(mouseX, (x) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return Infinity;
        return x - (rect.left + rect.width / 2);
    });

    const scaleRaw = useTransform(
        distance,
        [-DISTANCE, -50, 0, 50, DISTANCE],
        [1, 1.14, MAGNIFY, 1.14, 1]
    );

    const xRaw = useTransform(
        distance,
        [-DISTANCE, 0, DISTANCE],
        [NUDGE, 0, -NUDGE]
    );

    const yRaw = useTransform(distance, [-DISTANCE, 0, DISTANCE], [0, -10, 0]);
    const iconOpacity = useTransform(distance, [-DISTANCE, 0, DISTANCE], [0.86, 1, 0.86]);

    const scale = useSpring(scaleRaw, SPRING);
    const x = useSpring(xRaw, SPRING);
    const y = useSpring(yRaw, SPRING);

    return (
        <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <motion.div
                        style={{ x, y }}
                        className="relative flex shrink-0 items-end justify-center"
                    >
                        <motion.div
                            style={{ scale, y: bounceY }}
                            className="origin-bottom"
                        >
                            <Link
                                ref={ref}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() =>
                                    animate(bounceY, [0, -14, 0, -6, 0], {
                                        duration: 0.55,
                                        ease: [0.22, 1, 0.36, 1],
                                    })
                                }
                                className={clsx(
                                    "group relative flex h-[50px] w-[50px] items-center justify-center overflow-hidden",
                                    // "border rounded-2xl border-white/20 dark:border-white/10",
                                    // "bg-white/10 dark:bg-white/5",
                                    // "backdrop-blur-2xl",
                                    // "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_24px_rgba(0,0,0,0.14)]",
                                    // "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
                                    // "hover:bg-white/16 dark:hover:bg-white/8",
                                    // "hover:border-white/30 dark:hover:border-white/15",
                                    // "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                )}
                            >
                                {/* <span className="pointer-events-none absolute inset-x-2 top-1 h-5 rounded-full bg-white/20 blur-md" />
                                <span className="pointer-events-none absolute bottom-1 left-1/2 h-2.5 w-8 -translate-x-1/2 rounded-full bg-black/20 blur-md" /> */}

                                <motion.div
                                    style={{ opacity: iconOpacity }}
                                    className="relative z-10 flex h-full w-full items-center justify-center"
                                >
                                    <Image
                                        src={link.image_colour || link.image}
                                        alt={link.name}
                                        width={30}
                                        height={30}
                                        className="object-cover w-full"
                                    />
                                </motion.div>
                            </Link>

                            <span
                                className={clsx(
                                    "pointer-events-none absolute left-1/2 top-[calc(100%+8px)] h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-all duration-300",
                                    link.active
                                        ? "bg-white opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                        : "bg-white/50 opacity-70"
                                )}
                            />
                        </motion.div>
                    </motion.div>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content
                        side="top"
                        sideOffset={12}
                        className="z-50 rounded-xl border border-white/15 bg-neutral-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md"
                    >
                        {link.name}
                        <Tooltip.Arrow className="fill-neutral-900/90" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}

export default function DockMotion({
    links,
}: {
    links: SocialLink[];
}) {
    const mouseX = useMotionValue(Infinity);

    return (
        <div className="relative">
            <div
                onMouseMove={(e) => mouseX.set(e.clientX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className={clsx(
                    "relative flex w-full items-center justify-center md:items-end md:w-fit gap-4 rounded-full md:rounded-4xl",
                    "pl-5 pt-2 sm:pt-4 pb-6",
                    "sm:border sm:border-white/15 sm:dark:border-white/10 sm:backdrop-blur-2xl",
                    "sm:bg-white/8 sm:dark:bg-white/5",
                    "sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_20px_50px_rgba(0,0,0,0.18)]"
                )}
            >
                <span className="pointer-events-none absolute inset-x-6 top-2 h-8 rounded-full bg-white/14 blur-xl" />

                {links.map((link, idx) => (
                    <DockIcon key={idx} link={link} mouseX={mouseX} />
                ))}
            </div>
        </div>
    );
}