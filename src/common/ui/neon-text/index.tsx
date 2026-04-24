"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

interface GlowTextProps {
    text: string;
    className?: string;
    glowIntensity?: number; // 5-20px recommended
    delay?: number;
    duration?: number;
    staggerDelay?: number;
}

export default function NeonText({
    text,
    className = "",
    glowIntensity = 10,
    delay = 0,
    duration = 0.05,
    staggerDelay = 0.15,
}: GlowTextProps) {
    const ref = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        if (!ref.current) return;

        // Ambil computed color dari element (dari Tailwind class)
        const style = window.getComputedStyle(ref.current);
        const textColor = style.color; // "rgb(34, 197, 94)" untuk text-green-500

        gsap.registerPlugin(SplitText);

        const split = new SplitText(ref.current, { type: "chars" });

        const tl = gsap.timeline({ delay });

        split.chars.forEach((ch, i) => {
            tl.set(ch, { opacity: 0 })
                .to(ch, { opacity: 1, duration }, i * staggerDelay)
                .to(ch, { opacity: 0.3, duration: 0.03 }, i * staggerDelay + duration)
                .to(ch, {
                    opacity: 1,
                    textShadow: `0 0 ${glowIntensity}px ${textColor}`,
                    duration: 0.1
                }, i * staggerDelay + duration + 0.03);
        });

        return () => {
            split.revert();
        };
    }, { scope: ref });

    return (
        <span ref={ref} className={className}>
            {text}
        </span>
    );
}