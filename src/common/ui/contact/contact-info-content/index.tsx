'use client'

import { useRef } from "react";
import { IconMail, IconMapPin } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin);

export default function ContactInfoContent({ }) {
    const contactInfoRef = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            const splitText = (selector: string) => {
                const elements = gsap.utils.toArray<HTMLElement>(selector);

                elements.forEach((el) => {
                    const text = el.textContent || "";
                    el.setAttribute("data-text", text);

                    el.innerHTML = text
                        .split("")
                        .map((char) =>
                            char === " "
                                ? `<span class="char inline-block">&nbsp;</span>`
                                : `<span class="char inline-block">${char}</span>`
                        )
                        .join("");
                });
            };

            splitText(".title-line-split");

            gsap.set(".contact-badge", { y: 16, opacity: 0, filter: "blur(8px)" });
            gsap.set(".contact-title", { y: 36, opacity: 0, filter: "blur(12px)" });
            gsap.set(".contact-item", { y: 28, opacity: 0 });
            gsap.set(".contact-icon", { scale: 0.88, opacity: 0, rotate: -8 });

            gsap.set(".title-line-split .char", {
                opacity: 1,
                y: 0,
                rotate: 0,
                transformOrigin: "50% 70%",
                display: "inline-block",
            });

            let idleInterval: number | null = null;
            const chars = gsap.utils.toArray<HTMLElement>(".title-line-split .char");

            const startIdleFx = () => {
                if (idleInterval) window.clearInterval(idleInterval);

                idleInterval = window.setInterval(() => {
                    if (!chars.length) return;

                    const target = chars[Math.floor(Math.random() * chars.length)];

                    gsap.fromTo(
                        target,
                        { rotate: 0, y: 0 },
                        {
                            rotate: 360,
                            y: -4,
                            duration: 0.9,
                            ease: "back.out(1.8)",
                            yoyo: true,
                            repeat: 1,
                        }
                    );
                }, 2600);
            };

            const stopIdleFx = () => {
                if (idleInterval) {
                    window.clearInterval(idleInterval);
                    idleInterval = null;
                }
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: contactInfoRef.current,
                    start: "top 78%",
                    toggleActions: "play none none reverse",
                    onEnter: startIdleFx,
                    onEnterBack: startIdleFx,
                    onLeaveBack: stopIdleFx,
                },
            });

            tl.to(".contact-badge", {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.55,
                ease: "power2.out",
            })
                .to(
                    ".contact-title",
                    {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 0.8,
                        ease: "power3.out",
                    },
                    "-=0.2"
                )
                .fromTo(
                    ".title-line-split .char",
                    {
                        y: 24,
                        opacity: 0,
                        rotateX: -90,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        duration: 0.6,
                        stagger: 0.025,
                        ease: "power3.out",
                    },
                    "-=0.55"
                )
                .to(
                    ".contact-item",
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.65,
                        stagger: 0.12,
                        ease: "power3.out",
                    },
                    "-=0.2"
                )
                .to(
                    ".contact-icon",
                    {
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                        duration: 0.55,
                        stagger: 0.12,
                        ease: "back.out(1.7)",
                    },
                    "<"
                );

            return () => {
                stopIdleFx();
            };
        },
        { scope: contactInfoRef }
    );

    return (
        <div
            ref={contactInfoRef}
            className="lg:col-span-2 flex flex-col sm:flex-row md:flex-col justify-center gap-8">
            <div className="">
                <div className="contact-badge mb-4 inline-flex items-center rounded-full border border-blue-500/30 bg-white-500/10 px-3 py-1 text-sm font-medium text-blue-400 backdrop-blur-xl transition-colors">
                    Get in Touch
                </div>
                <h1 className="contact-title text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 transition-colors">
                    <span className="title-line-split block leading-[0.95]">Let&apos;s Build</span>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">
                        Together.
                    </span>
                </h1>
                <div className="w-full relative">
                    <p
                        className="
                            text-white/90
                            text-lg leading-relaxed
                            "
                    >
                        Have a project in mind, a freelance opportunity, or just want to chat about
                        web development? I&apos;d love to hear from you.
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-6 mt-0 sm:mt-4 justify-start sm:justify-center md:justify-start">
                <div className="contact-item flex items-center gap-4 text-neutral-300">
                    <div className="contact-icon gw-badge cursor-default flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] border-white/10 hover:bg-white/8 text-white hover:text-rose-400">
                        <IconMail size={22} />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-300 font-medium transition-colors">Email Me At</p>
                        <p className="font-semibold text-neutral-200 transition-colors">raka.pancid@gmail.com</p>
                    </div>
                </div>
                <div className="contact-item flex items-center gap-4 text-neutral-300">
                    <div className="contact-icon gw-badge group flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] border-white/10 hover:bg-white/8 text-white">
                        <IconMapPin
                            size={22}
                            className="group-hover:stroke-[url(#rainbow-gradient)] group-hover:text-transparent"
                        />
                        <svg width="0" height="0" className="absolute">
                            <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop stopColor="#ef4444" offset="0%" />
                                <stop stopColor="#eab308" offset="25%" />
                                <stop stopColor="#22c55e" offset="50%" />
                                <stop stopColor="#3b82f6" offset="75%" />
                                <stop stopColor="#a855f7" offset="100%" />
                            </linearGradient>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-neutral-300 font-medium transition-colors">Based In</p>
                        <p className="font-semibold text-neutral-200 transition-colors">Jakarta Selatan, Indonesia</p>
                    </div>
                </div>
            </div>
        </div>
    )
}