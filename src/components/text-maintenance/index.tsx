"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { motion } from "motion/react";
import Image from "next/image"

const messages = [
    "Our robots are doing yoga... 🧘",
    "Bribing the database with coffee... ☕",
    "Teaching AI to parallel park... 🚗",
    "Polishing pixels one by one... ✨",
    "ETA: Probably soon™ 🐌"
]

export default function FilmCreditsPage() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const ctx = gsap.context(() => {
            const credits = gsap.utils.toArray(".credit")
            const replay = gsap.utils.toArray(".replay")

            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

            tl.fromTo(
                credits,
                { y: 120, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.35,
                    duration: 1,
                    ease: "power2.out"
                }
            ).to(
                credits,
                {
                    y: -120,
                    opacity: 0,
                    stagger: 0.25,
                    duration: 0.8,
                    ease: "power2.in"
                },
                "+=1.2"
            )

            gsap.fromTo(
                replay,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
            )
        }, container)

        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full bg-transparent z-10 text-white overflow-hidden relative flex items-center justify-center"
        >
            <div className="w-full max-w-3xl text-center">
                <div className="space-y-10">
                    <div>
                        <p className="credit text-sm md:text-xl text-white/45 tracking-wide uppercase">
                            SYSTEM STATUS
                        </p>
                        <p className="credit mt-4 uppercase text-2xl md:text-4xl font-bold text-white">
                            <span className="inline-flex items-center gap-3 leading-none">
                                <span>Our</span>
                                <span className="inline-flex items-center justify-center w-[44px] h-[44px] md:w-[56px] md:h-[56px] shrink-0 overflow-hidden rounded-xl">
                                    <motion.span
                                                                    animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                    className="absolute">
                                        <svg
                                    width={100}
                                    height={100}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth={1}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <defs>
                                        <linearGradient id="settings-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#fbbf24" />
                                            <stop offset="50%" stopColor="#f97316" />
                                            <stop offset="100%" stopColor="#ea580c" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        stroke="url(#settings-grad)"
                                        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                                    />
                                    <circle stroke="url(#settings-grad)" cx="12" cy="12" r="3" />
                                </svg>
                                    </motion.span>
                                    <Image
                                        src="/assets/image/unnamed.jpg"
                                        alt="logo"
                                        width={56}
                                        height={56}
                                        loading="eager"
                                        className="object-cover w-full h-full relative z-10"
                                    />
                                </span>
                                <span>are doing workout... 🏋️‍♂️</span>
                            </span>
                        </p>
                    </div>

                    <div>
                        <p className="credit text-sm md:text-xl text-white/45 tracking-wide uppercase">
                            CURRENT TASK
                        </p>
                        <p className="credit mt-4 uppercase text-2xl md:text-4xl font-bold text-white">
                            Bribing the database with coffee... ☕
                        </p>
                    </div>

                    <div>
                        <p className="credit text-sm md:text-xl text-white/45 tracking-wide uppercase">
                            PROCESS IN PROGRESS
                        </p>
                        <p className="credit mt-4 uppercase text-2xl md:text-4xl font-bold text-white">
                            Teaching AI to parallel park... 🚗
                        </p>
                    </div>

                    <div>
                        <p className="credit text-sm md:text-xl text-white/45 tracking-wide uppercase">
                            CURRENTLY POLISHING
                        </p>
                        <p className="credit mt-4 uppercase text-2xl md:text-4xl font-bold text-white">
                            Polishing pixels one by one... ✨
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}