'use client';

import { useMediaQuery } from "@/hooks/use-media-query";
import { BREAKPOINTS } from "@/common/constants/media-query";
import { cn } from "@/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

type BackgroundSectionProps = {
  opacity?: '5' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90' | '100';
  backgroundImage?: string;
  animationMode?: 'always' | 'never' | 'initial-only';
  backgroundImageBlur?: boolean
};

let hasPlayedInitialAnimation = false;

export default function BackgroundSection({
  opacity = '100',
  backgroundImage,
  animationMode = 'initial-only',
  backgroundImageBlur = false
}: BackgroundSectionProps) {
  const isDesktop = useMediaQuery(BREAKPOINTS.md);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const imageLayerRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themeReady = resolvedTheme === "dark" || resolvedTheme === "light";
  const isDark = resolvedTheme === "dark";
  const finalOpacity = Number(opacity) / 100;

  const backgroundImageUrl = isDark
    ? backgroundImage || "/assets/home/dark-bg-section.jpg"
    : backgroundImage || "/assets/home/day-bg-section.jpg";

  useLayoutEffect(() => {
  if (!mounted || !themeReady || !imageLayerRef.current) return;

  const el = imageLayerRef.current;

  const startClip =
    "polygon(0% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)";

  const sweepClip =
    "polygon(0% 0%, 100% 0%, 100% 76%, 88% 88%, 72% 96%, 50% 100%, 28% 96%, 12% 88%, 0% 72%, 0% 0%)";

  const fullClip =
    "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 0%)";

  const shouldSkipAnimation =
    animationMode === "never" ||
    (animationMode === "initial-only" && hasPlayedInitialAnimation);

  const ctx = gsap.context(() => {
    if (shouldSkipAnimation) {
      gsap.set(el, {
        clipPath: fullClip,
        scale: 1,
        filter: "brightness(1)",
        transformOrigin: "center top",
      });
      return;
    }

    gsap.set(el, {
      clipPath: startClip,
      scale: 1.06,
      y: -24,
      filter: isDark ? "brightness(0.9)" : "brightness(0.98)",
      transformOrigin: "center top",
    });

    if (animationMode === "initial-only") {
      hasPlayedInitialAnimation = true;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl.to(el, {
      clipPath: sweepClip,
      duration: 0.95,
      ease: "power4.inOut",
    }).to(
      el,
      {
        clipPath: fullClip,
        scale: 1,
        y: 0,
        filter: "brightness(1)",
        duration: 0.75,
        ease: "power3.out",
      },
      "-=0.25"
    );
  }, imageLayerRef);

  return () => ctx.revert();
}, [mounted, themeReady, isDark, backgroundImageUrl, animationMode]);

  if (!mounted || !themeReady) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className={cn("relative h-full w-full transition-opacity duration-500")}
        style={{ opacity: finalOpacity }}
      >
        <div
          ref={imageLayerRef}
          className="absolute inset-0 will-change-[clip-path,transform,filter]"
        >
          <Image
            src={backgroundImageUrl}
            loading="eager"
            alt="Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
{backgroundImageBlur && (
  <div
    className={cn(
      "absolute inset-0 backdrop-blur-md z-10",  // Base: blur sedang
      isDark
        ? "bg-linear-to-b from-black/30 via-black/20 to-black/10"  // Gelap: black tint kuat
        : "bg-linear-to-b from-white/20 via-white/10 to-transparent"  // Wider: white tint ringan
    )}
  />
)}
        </div>
      </div>
    </div>
  );
}