"use client";

import { Hand } from "lucide-react";
import Image from "next/image";
import ScrambleIntroText from "@/common/ui/home/scramble-quotes-hero";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export default function IntroductionContent() {
    const introductionTitleRef = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            const el = introductionTitleRef.current;
            if (!el) return;

            const role = el.querySelector<HTMLElement>(".introduction-role");
            const word1 = el.querySelector<HTMLElement>(".introduction-role-title-1");
            const word2 = el.querySelector<HTMLElement>(".introduction-role-title-2");

            if (!role || !word1 || !word2) return;

            const splitText = (node: HTMLElement) => {
                if (node.dataset.splitDone === "true") return;

                const text = node.textContent || "";
                node.dataset.splitDone = "true";
                node.innerHTML = text
                    .split("")
                    .map((char) =>
                        char === " "
                            ? `<span class="char inline-block">&nbsp;</span>`
                            : `<span class="char inline-block">${char}</span>`
                    )
                    .join("");
            };

            splitText(word1);
            splitText(word2);

            const chars = el.querySelectorAll<HTMLElement>(".char");

            gsap.set(role, {
                opacity: 0,
                y: 20,
                filter: "blur(10px)",
            });

            gsap.set([word1, word2], {
                opacity: 1,
                y: 0,
                display: "inline-block",
            });

            gsap.set(chars, {
                opacity: 0,
                y: 14,
                rotateX: -90,
                transformOrigin: "50% 70%",
                display: "inline-block",
            });

            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
            });

            tl.to(role, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.7,
            }).to(
                chars,
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.55,
                    stagger: 0.015,
                },
                "-=0.25"
            );

            let idleInterval: number | null = null;

            const startIdleFx = () => {
                if (idleInterval) window.clearInterval(idleInterval);

                idleInterval = window.setInterval(() => {
                    const list = Array.from(chars);
                    if (!list.length) return;

                    const target = list[Math.floor(Math.random() * list.length)];

                    gsap.fromTo(
                        target,
                        { rotate: 0, y: 0 },
                        {
                            rotate: 360,
                            y: -4,
                            duration: 0.8,
                            ease: "back.out(1.8)",
                            yoyo: true,
                            repeat: 1,
                        }
                    );
                }, 2600);
            };

            startIdleFx();

            return () => {
                if (idleInterval) window.clearInterval(idleInterval);
            };
        },
        { scope: introductionTitleRef }
    );

    return (
        <div ref={introductionTitleRef}>
            <p className="flex items-center gap-3 text-lg font-medium text-neutral-200">
                <span className="inline-flex items-center gap-1">
                    <Hand
                        className="animate-wave-animation text-blue-300"
                        size={28}
                    />
                </span>
                Hey! I&apos;m Raka Gemi Ibrahim,
            </p>

            <div className="mt-4 flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-8 lg:space-y-0 md:gap-4">
                <h1 className="introduction-role text-pretty text-center text-2xl font-black leading-none text-neutral-100 sm:text-left sm:text-5xl md:text-6xl">
                    <span className="introduction-role-title-1 inline-block whitespace-nowrap">
                        Software
                    </span>
                    <div className="inline-block lg:hidden">&nbsp;</div>
                    <br className="hidden! lg:block" />
                    <span className="introduction-role-title-2 inline-block whitespace-nowrap">
                        Engineer
                    </span>
                </h1>

                <div className="flex items-center justify-center gap-2 pt-2 md:gap-4 md:pt-0">
                    <div className="h-auto w-5 shrink-0 sm:w-7">
                        <Image
                            priority
                            src={"/assets/icon/white-curly-bracket.svg"}
                            width={30}
                            height={30}
                            loading="eager"
                            alt="curly-brackets"
                            style={{ width: "auto", height: "auto" }}
                        />
                    </div>

                    <div className="w-fit max-w-full md:max-w-225">
                        <ScrambleIntroText delay={2} replayEvery={10} speed="slow" />
                    </div>

                    <div className="h-auto w-5 shrink-0 rotate-180 sm:w-7">
                        <Image
                            priority
                            loading="eager"
                            src={"/assets/icon/white-curly-bracket.svg"}
                            width={30}
                            height={30}
                            alt="curly-brackets"
                            style={{ width: "auto", height: "auto" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}