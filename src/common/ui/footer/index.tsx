"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SOCIAL_LINKS } from "@/common/constants/social-media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const footerRef = useRef<HTMLElement | null>(null);

    useGSAP(
        () => {
            gsap.set(".footer-line", {
                scaleX: 0,
                transformOrigin: "left center",
                opacity: 0,
            });

            gsap.set(".footer-copy", {
                x: -80,
                opacity: 0,
                filter: "blur(10px)",
            });

            gsap.set(".footer-social", {
                x: -30,
                opacity: 0,
            });

            const tl = gsap.timeline({ paused: true });

            tl.to(".footer-line", {
                scaleX: 1,
                opacity: 1,
                duration: 0.9,
                ease: "power2.out",
            })
                .to(
                    ".footer-copy",
                    {
                        x: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 0.9,
                        ease: "power3.out",
                    },
                    0.12
                )
                .to(
                    ".footer-social",
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.65,
                        stagger: 0.08,
                        ease: "power3.out",
                    },
                    0.2
                );

            ScrollTrigger.create({
                trigger: footerRef.current,
                start: "top bottom-=80px",
                end: "bottom bottom",
                animation: tl,
                toggleActions: "restart none restart reset",
            });
        },
        { scope: footerRef }
    );

    return (
        <footer
            ref={footerRef}
            className="relative z-20 w-full overflow-hidden border-t border-neutral-200/50 bg-white/65 px-6 py-8 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-950/50 dark:shadow-[0_-8px_30px_rgba(0,0,0,0.18)]"
        >
            {/* Highlight tipis agar terasa kaca */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent dark:via-white/20" />

            {/* Shadow lembut agar transisi ke bawah lebih mewah */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/10 to-transparent dark:from-black/30" />

            {/* Line animasi */}
            <div className="footer-line absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-neutral-400/60 to-transparent dark:via-neutral-600/60" />

            <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
                <div className="footer-copy flex flex-col items-center gap-1 text-center md:items-start md:text-left">
                    <p className="text-sm font-medium text-neutral-800/85 dark:text-neutral-200/85">
                        © {currentYear} Raka Gemi Ibrahim. All rights reserved.
                    </p>
                    <p className="text-xs text-neutral-600/75 dark:text-neutral-400/75">
                        Crafted with Next.js, Tailwind CSS, Framer Motion & GSAP.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {SOCIAL_LINKS.map((social) => (
                        <div key={social.name} className="footer-social">
                            <Link
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                className={`group flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-white/25 dark:border-white/10 dark:bg-white/4 dark:hover:bg-white/8 ${social.className}`}
                            >
                                <span className={`transition-transform duration-300 group-hover:scale-110 ${social.className}`}>
                                    {social.icon}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}