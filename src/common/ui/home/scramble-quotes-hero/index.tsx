"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

type ScrambleIntroTextProps = {
    delay?: number;
    replayEvery?: number | null;
    speed?: "slow" | "medium" | "fast";
};

const SPEED_PRESETS = {
    slow: {
        partDuration: 1.2,
        stagger: 0.18,
        scrambleSpeed: 0.25,
        revealDelay: 0.2,
    },
    medium: {
        partDuration: 0.9,
        stagger: 0.12,
        scrambleSpeed: 0.45,
        revealDelay: 0.1,
    },
    fast: {
        partDuration: 0.65,
        stagger: 0.08,
        scrambleSpeed: 0.8,
        revealDelay: 0.04,
    },
} as const;

export default function ScrambleIntroText({
    delay = 1.45,
    replayEvery = 5,
    speed = "medium",
}: ScrambleIntroTextProps) {
    const rootRef = useRef<HTMLParagraphElement | null>(null);

    useGSAP(
        () => {
            const root = rootRef.current;
            if (!root) return;

            const parts = gsap.utils.toArray<HTMLElement>(
                root.querySelectorAll(".scramble-part")
            );

            const preset = SPEED_PRESETS[speed];
            const finalTexts = parts.map((el) => el.dataset.text || "");
            let replayCall: gsap.core.Tween | null = null;
            let activeTl: gsap.core.Timeline | null = null;

            const playScramble = () => {
                activeTl?.kill();

                parts.forEach((el, i) => {
                    el.textContent = finalTexts[i];
                });

                activeTl = gsap.timeline({
                    defaults: { ease: "none" },
                    onComplete: () => {
                        if (replayEvery && replayEvery > 0) {
                            replayCall = gsap.delayedCall(replayEvery, playScramble);
                        }
                    },
                });

                parts.forEach((el, index) => {
                    activeTl!.fromTo(
                        el,
                        { opacity: 0.45 },
                        {
                            opacity: 1,
                            duration: preset.partDuration,
                            scrambleText: {
                                text: finalTexts[index],
                                chars: "upperAndLowerCase",
                                speed: preset.scrambleSpeed,
                                revealDelay: preset.revealDelay,
                                tweenLength: true,
                            },
                        },
                        index * preset.stagger
                    );
                });
            };

            replayCall = gsap.delayedCall(delay, playScramble);

            return () => {
                replayCall?.kill();
                activeTl?.kill();
                gsap.killTweensOf(parts);
            };
        },
        { scope: rootRef }
    );

    return (
        <div className="relative w-full max-w-full md:max-w-4xl">
            <p
                aria-hidden="true"
                className="
                    invisible
                    pointer-events-none
                    text-[11px] md:text-xl
                    leading-5 md:leading-7
                    font-medium text-center
                    whitespace-normal
                    [text-wrap:normal]"
            >
                <span>Transforming ideas into</span>{" "}
                <span className="text-blue-300">
                    interactive and seamless digital
                </span>{" "}
                <span>experiences with cutting-edge</span>{" "}
                <span className="text-blue-300">
                    frontend development.
                </span>
            </p>

            {/* Animated layer */}
            <p
                ref={rootRef}
                className="
                    absolute inset-0
                    text-[11px] md:text-xl
                    leading-5 md:leading-7
                    text-neutral-300
                    font-medium text-center
                    whitespace-normal
                    [text-wrap:normal]"
            >
                <span className="scramble-part" data-text="Transforming ideas into">
                    Transforming ideas into
                </span>{" "}
                <span
                    className="scramble-part text-blue-300"
                    data-text="interactive and seamless digital"
                >
                    interactive and seamless digital
                </span>{" "}
                <span
                    className="scramble-part"
                    data-text="experiences with cutting-edge"
                >
                    experiences with cutting-edge
                </span>{" "}
                <span
                    className="scramble-part text-blue-300"
                    data-text="frontend development."
                >
                    frontend development.
                </span>
            </p>
        </div>
    );
}