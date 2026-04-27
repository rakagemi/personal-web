"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

type RollingLoadingProps = {
  text?: string;
  className?: string;
};

export default function RollingLoading({
  text = "Loading...",
  className = "",
}: RollingLoadingProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = root.current;
      if (!container) return;

      const lines = gsap.utils.toArray<HTMLElement>(".rolling-line", container);

      gsap.set(container, { autoAlpha: 1 });

      const width = window.innerWidth;
      const depth = -width / 8;
      const transformOrigin = `50% 50% ${depth}`;

      gsap.set(lines, {
        perspective: 700,
        transformStyle: "preserve-3d",
      });

      const splits = lines.map(
        (line) =>
          new SplitText(line, {
            type: "chars",
            charsClass: "char",
          })
      );

      gsap.set(".char", {
        display: "inline-block",
        transformOrigin,
        backfaceVisibility: "hidden",
      });

      const tl = gsap.timeline({ repeat: -1 });

      splits.forEach((split, index) => {
        tl.fromTo(
          split.chars,
          { rotationX: -90 },
          {
            rotationX: 90,
            stagger: 0.08,
            duration: 0.9,
            ease: "none",
            transformOrigin,
          },
          index * 0.45
        );
      });

      return () => {
        tl.kill();
        splits.forEach((split) => split.revert());
      };
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-black invisible ${className}`}
      aria-live="polite"
      aria-label="Loading"
      role="status"
    >
      <div className="relative h-[24vw] w-full">
        <h1 className="rolling-line absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[18vw] leading-none tracking-[-0.6vw] text-white">
          {text}
        </h1>
        <h1 className="rolling-line absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[18vw] leading-none tracking-[-0.6vw] text-white">
          {text}
        </h1>
        <h1 className="rolling-line absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[18vw] leading-none tracking-[-0.6vw] text-white">
          {text}
        </h1>
        <h1 className="rolling-line absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[18vw] leading-none tracking-[-0.6vw] text-white">
          {text}
        </h1>
      </div>
    </div>
  );
}