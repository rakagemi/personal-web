"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LiquidGlassCard } from "@/common/ui/card-liquid-glass";
import MacCredentialWindow from "@/components/MarkWindow";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        ScrollTrigger.normalizeScroll(false);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",          // pin duration = 2× viewport heights of scroll
          scrub: 1,
          pin: stickyRef.current, // pin the inner wrapper, not the outer spacer
          anticipatePin: 1,
          preventOverlaps: true,
        },
      });

      // Title: starts centered → slides OUT to the left
      tl.to(
        titleRef.current,
        {
          x: "-110%",
          opacity: 0,
          ease: "power2.inOut",
        },
        0
      );

      // Description: starts off-screen right → slides IN to center
      tl.fromTo(
        descRef.current,
        { x: "110%", opacity: 0 },
        { x: "0%", opacity: 1, ease: "power2.inOut" },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    /**
     * Outer spacer — needs a tall height so GSAP has room to scrub.
     * The sticky wrapper inside stays in view during that scroll distance.
     */
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
      >
        {/* Shared dark background */}
        <div className="absolute inset-0 bg-[#0e100f]" />

        {/* ── TITLE panel ──────────────────────────────────────────────── */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex items-center justify-center px-8 md:px-20"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-pretty mb-4 text-4xl font-black leading-none text-neutral-100 text-left sm:text-5xl md:text-6xl">
                What&apos;s New?
              </h2>
              <p className="text-sm leading-6 text-white/75">
                This project is a job portal website that provides access to 19
                million job opportunities across Indonesia, connecting job
                seekers with employers and facilitating career growth 👜
                <br />
                <br />
                The Letter J on Job Portal 19 million jobs is a Jokes ✌️
                <br />
                <br />
                Made with Nuxt.js, Pinia, Tailwind CSS, Nuxt UI, Vue Motion and
                deployed on Vercel.
              </p>

              {/* Scroll hint */}
              <div className="mt-10 flex items-center gap-2 text-white/40 text-xs">
                <svg
                  className="w-4 h-4 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Scroll to see the project
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── DESCRIPTION panel ────────────────────────────────────────── */}
        <div
          ref={descRef}
          className="absolute inset-0 flex items-center justify-center px-6 md:px-10"
          style={{ willChange: "transform, opacity", transform: "translateX(110%)", opacity: 0 }}
        >
          <div className="relative z-10 w-full max-w-7xl">
            <LiquidGlassCard glass="thin" animated={false} spotlight="soft" entranceDelay={0.5}>
              <section
                className="flex flex-col lg:flex-row gap-6 justify-center items-center max-h-[calc(100svh-7rem)] overflow-y-auto lg:max-h-none lg:overflow-visible"
                style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
                >
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://job-portal-pi-two.vercel.app/"
                  className="w-full h-full sm:h-72 lg:h-100 shrink-0 lg:shrink"
                >
                  <div
                    className="overflow-hidden w-full h-full max-w-6xl rounded-2xl p-6 shadow-2xl hover:shadow-3xl border border-zinc-800 transition-shadow duration-300"
                    style={{
                      background:
                        "radial-gradient(ellipse at top left, rgba(99,102,241,0.06), transparent 60%), #14161f",
                    }}
                  >
                    <div className="transition-transform w-full h-full duration-500 hover:scale-103">
                      <Image
                        src="/assets/freelance/freelance-webapp-job-portal-with-nuxt.png"
                        alt="Job Portal"
                        loading="eager"
                        priority
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>
                </Link>

                <div className="w-full shrink-0 lg:shrink">
                  <MacCredentialWindow />
                </div>
              </section>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}