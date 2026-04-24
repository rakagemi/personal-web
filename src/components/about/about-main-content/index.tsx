"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { PortfolioCard } from "@/common/ui/about/portofolio-card";
import { portfolioCompanies } from "@/common/json/portofolio";
import CursorTrail from "@/components/CursorTrail";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import ArchitectBackground from "@/common/ui/architecture-background";
import ParallaxImage from "@/common/ui/parallax-background";

gsap.registerPlugin(ScrollTrigger);

// Semua panel: hero + portfolio
const ALL_PANELS = [
  { slug: "__hero__", isHero: true },
  ...portfolioCompanies.map((c) => ({ ...c, isHero: false })),
];

export default function AboutMainContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const panelEls = gsap.utils.toArray<HTMLElement>(".panel", containerRef.current);
      if (!panelEls.length) return;

      panelEls.forEach((panel, i) => {
        const content = panel.querySelector<HTMLElement>(".panel-content");
        if (!content || i === 0) return;

        gsap.fromTo(
          content,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ─── Snap global ───────────────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: containerRef.current,   // ← tambahkan trigger eksplisit
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: 1 / (ALL_PANELS.length - 1),
          duration: { min: 0.4, max: 0.7 },
          delay: 0.2,
          ease: "power2.inOut",
        },
      });

      ScrollTrigger.refresh();
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div id="about">
      <main
        ref={containerRef}
        style={{ height: `${ALL_PANELS.length * 100}vh` }}
      >

        {ALL_PANELS.map((item, i) => (
          <div
            key={item.slug}
            className="panel"
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              width: "100%",
              overflow: "hidden",
              zIndex: i + 1,
            }}
          >
            {item.isHero ? (
              <div className="panel-content relative h-full flex flex-col items-center justify-center bg-[#0e100f] text-white text-center px-6">
                <ParallaxImage
                    imageUrl={"/assets/c1fc9d7f6ae08d56f2b84e81799790a5.gif"}
                    intensity={0.04}
                    gyroIntensity={0.06}
                    lerpSpeed={0.030}
                    debug={false}
                  />
                <CursorTrail />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative flex items-center justify-center mb-8 z-20"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="absolute"
                  >
                    <svg
                      width={120}
                      height={120}
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
                  </motion.div>
                  <div
                    className="
                      relative z-10 overflow-hidden rounded-2xl w-18 h-18
                      bg-neutral-700/40
                      shadow-[0_12px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]
                      backdrop-blur-2xl backdrop-saturate-150"
                  >
                    <Image src="/assets/image/unnamed.jpg" loading="eager" className="object-cover" width={80} height={80} alt="logo" />
                  </div>
                  <motion.div
                    animate={{ y: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 text-cyan-500"
                  >
                    <Sparkles size={24} />
                  </motion.div>
                </motion.div>
                <motion.h1
                  className="text-5xl z-50 md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-r from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  Portfolio
                </motion.h1>
                <motion.p
                  className="z-50 text-neutral-300 text-lg md:text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Scroll down to explore
                </motion.p>
                <motion.div
                  className="mt-12 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [0, 10, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-sm text-neutral-200 font-black tracking-widest uppercase">
                    Scroll
                  </span>
                  <svg
                    className="w-5 h-5 text-white-100 font-black"
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
                </motion.div>
              </div>
            ) : (
              <div className="bg-neutral-900 panel-content h-full w-full flex items-center justify-center">
                <ArchitectBackground theme={"dark"} />
                <div className="w-full max-w-4xl px-8">
                  <PortfolioCard company={item as typeof portfolioCompanies[0]} />
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}