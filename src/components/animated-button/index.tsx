"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Padauk } from "next/font/google";

gsap.registerPlugin(useGSAP);

type CloneRevealButtonsProps = {
    children: React.ReactNode;
    className?: string;
};

export default function AnimatedButton({
    children,
    className = "",
}: CloneRevealButtonsProps) {
    const rootRef = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            const root = rootRef.current;
            if (!root) return;

            const items = Array.from(
                root.querySelectorAll<HTMLElement>(".clone-reveal-item")
            );

            if (items.length < 2) return;

            requestAnimationFrame(() => {
                const MOVE_DURATION = 0.48;
                const FADE_DURATION = 0.22;
                const OVERLAP = 0.18;
                const GAP = 0.12;

                const rects = items.map((el) => el.getBoundingClientRect());

                items.forEach((el, i) => {
                    el.style.opacity = i === 0 ? "1" : "0";
                });

                const masterTl = gsap.timeline({ delay: 0.4 });

                for (let i = 0; i < items.length - 1; i++) {
                    const source = items[i];
                    const target = items[i + 1];
                    const sourceRect = rects[i];
                    const targetRect = rects[i + 1];

                    const clone = source.cloneNode(true) as HTMLElement;
                    clone.removeAttribute("style");

                    Object.assign(clone.style, {
                        position: "fixed",
                        left: `${sourceRect.left}px`,
                        top: `${sourceRect.top}px`,
                        width: `${sourceRect.width}px`,
                        height: `${sourceRect.height}px`,
                        boxSizing: "border-box",
                        margin: "0",
                        padding: "0",
                        pointerEvents: "none",
                        zIndex: "9999",
                        opacity: "0",
                        transform: "translate3d(0,0,0)",
                        transformOrigin: "left center",
                    });

                    document.body.appendChild(clone);

                    const dx = targetRect.left - sourceRect.left;
                    const dy = targetRect.top - sourceRect.top;

                    masterTl
                        .set(clone, { opacity: 1 })
                        .to(clone, {
                            x: dx,
                            y: dy,
                            duration: MOVE_DURATION,
                            ease: "power2.inOut",
                        })
                        .set(target, { opacity: 0 }, `-=${OVERLAP}`)
                        .to(
                            target,
                            { opacity: 1, duration: FADE_DURATION, ease: "power1.out" },
                            `-=${OVERLAP}`
                        )
                        .to(
                            clone,
                            {
                                opacity: 0,
                                duration: FADE_DURATION,
                                ease: "power1.out",
                                onComplete: () => clone.remove(),
                            },
                            "<"
                        )
                        .to({}, { duration: GAP });
                }
            });
        },
        { scope: rootRef }
    );

    return (
        <div
            ref={rootRef}
            className={className}
            // style={{ position: "relative", display: "inline-flex" }}
        >
            {
                React.Children.map(children, (child, index) => (
                    <div
                        key={index}
                        className="clone-reveal-item relative"
                        style={{ display: "inline-flex" }}
                    >
                        {child}
                    </div>
                ))}
        </div>
    );
}