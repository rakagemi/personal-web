// // components/ambient-aod.tsx
// "use client";

// import * as React from "react";
// import Image, { type StaticImageData } from "next/image";
// import {
//     animate,
//     motion,
//     useDragControls,
//     useMotionValue,
//     useSpring,
//     useTransform,
// } from "motion/react";
// import { cn } from "@/utils";

// type AODBackgroundSrc = string | StaticImageData;

// type AmbientAODProps = {
//     children: React.ReactNode;
//     idleDelay?: number;
//     locale?: string;
//     timeZone?: string;

//     backgroundSrc?: AODBackgroundSrc;
//     backgroundAlt?: string;
//     backgroundPriority?: boolean;
//     backgroundOverlayOpacity?: number;

//     swipeThreshold?: number;
//     parallaxStrength?: number;

//     enableClockGlow?: boolean;
//     enableDepthBackground?: boolean;

//     className?: string;
//     overlayClassName?: string;
//     contentClassName?: string;
//     dateClassName?: string;
//     timeClassName?: string;

//     onVisibleChange?: (visible: boolean) => void;
// };

// export function AmbientAOD({
//     children,
//     idleDelay = 10000,
//     locale,
//     timeZone,

//     backgroundSrc,
//     backgroundAlt = "AOD background",
//     backgroundPriority = true,
//     backgroundOverlayOpacity = 0.46,

//     swipeThreshold = 120,
//     parallaxStrength = 18,

//     enableClockGlow = true,
//     enableDepthBackground = true,

//     className,
//     overlayClassName,
//     contentClassName,
//     dateClassName,
//     timeClassName,

//     onVisibleChange,
// }: AmbientAODProps) {
//     const [visible, setVisible] = React.useState(false);
//     const [dismissing, setDismissing] = React.useState(false);
//     const [now, setNow] = React.useState(new Date());
//     const [isMobile, setIsMobile] = React.useState(false);

//     const [userLocale, setUserLocale] = React.useState("en-US");
//     const [userTimeZone, setUserTimeZone] = React.useState("UTC");

//     const idleTimerRef = React.useRef<number | null>(null);
//     const lastTouchEndRef = React.useRef(0);

//     const dragControls = useDragControls();

//     const overlayY = useMotionValue(24);
//     const overlayOpacity = useMotionValue(0);

//     const pointerX = useMotionValue(0);
//     const pointerY = useMotionValue(0);

//     const bgLayer1X = useSpring(useTransform(pointerX, (v) => v * 0.16), {
//         stiffness: 120,
//         damping: 22,
//         mass: 0.45,
//     });
//     const bgLayer1Y = useSpring(useTransform(pointerY, (v) => v * 0.16), {
//         stiffness: 120,
//         damping: 22,
//         mass: 0.45,
//     });

//     const bgLayer2X = useSpring(useTransform(pointerX, (v) => v * 0.3), {
//         stiffness: 140,
//         damping: 22,
//         mass: 0.42,
//     });
//     const bgLayer2Y = useSpring(useTransform(pointerY, (v) => v * 0.3), {
//         stiffness: 140,
//         damping: 22,
//         mass: 0.42,
//     });

//     const contentX = useSpring(useTransform(pointerX, (v) => v * 0.42), {
//         stiffness: 160,
//         damping: 24,
//         mass: 0.38,
//     });
//     const contentY = useSpring(useTransform(pointerY, (v) => v * 0.42), {
//         stiffness: 160,
//         damping: 24,
//         mass: 0.38,
//     });

//     const clearIdleTimer = React.useCallback(() => {
//         if (idleTimerRef.current) {
//             window.clearTimeout(idleTimerRef.current);
//             idleTimerRef.current = null;
//         }
//     }, []);

//     const scheduleAOD = React.useCallback(() => {
//         clearIdleTimer();
//         idleTimerRef.current = window.setTimeout(() => {
//             setVisible(true);
//             onVisibleChange?.(true);
//         }, idleDelay);
//     }, [clearIdleTimer, idleDelay, onVisibleChange]);

//     const resetParallax = React.useCallback(() => {
//         pointerX.set(0);
//         pointerY.set(0);
//     }, [pointerX, pointerY]);

//     const dismissAOD = React.useCallback(() => {
//         if (!visible || dismissing) return;

//         setDismissing(true);
//         onVisibleChange?.(false);

//         animate(overlayOpacity, 0, {
//             duration: 0.22,
//             ease: "easeOut",
//         });

//         animate(overlayY, -window.innerHeight, {
//             duration: 0.5,
//             ease: [0.22, 1, 0.36, 1],
//             onComplete: () => {
//                 setVisible(false);
//                 setDismissing(false);
//                 overlayY.set(24);
//                 overlayOpacity.set(0);
//                 resetParallax();
//             },
//         });
//     }, [dismissing, onVisibleChange, overlayOpacity, overlayY, resetParallax, visible]);

//     React.useEffect(() => {
//         const coarse =
//             window.matchMedia("(pointer: coarse)").matches ||
//             navigator.maxTouchPoints > 0;

//         setIsMobile(coarse);

//         const resolved = new Intl.DateTimeFormat().resolvedOptions();

//         setUserLocale(locale ?? resolved.locale ?? navigator.language ?? "en-US");
//         setUserTimeZone(timeZone ?? resolved.timeZone ?? "UTC");
//     }, [locale, timeZone]);

//     React.useEffect(() => {
//         const timer = window.setInterval(() => {
//             setNow(new Date());
//         }, 1000);

//         return () => window.clearInterval(timer);
//     }, []);

//     React.useEffect(() => {
//         if (visible) {
//             clearIdleTimer();

//             animate(overlayY, 0, {
//                 duration: 0.52,
//                 ease: [0.22, 1, 0.36, 1],
//             });

//             animate(overlayOpacity, 1, {
//                 duration: 0.32,
//                 ease: "easeOut",
//             });
//         } else {
//             scheduleAOD();
//         }

//         return clearIdleTimer;
//     }, [clearIdleTimer, overlayOpacity, overlayY, scheduleAOD, visible]);

//     React.useEffect(() => {
//         const handleActivity = () => {
//             if (!visible && !dismissing) scheduleAOD();
//         };

//         const events: (keyof WindowEventMap)[] = [
//             "mousemove",
//             "mousedown",
//             "scroll",
//             "keydown",
//             "touchstart",
//             "touchmove",
//             "pointerdown",
//         ];

//         events.forEach((eventName) => {
//             window.addEventListener(eventName, handleActivity, { passive: true });
//         });

//         return () => {
//             events.forEach((eventName) => {
//                 window.removeEventListener(eventName, handleActivity);
//             });
//         };
//     }, [dismissing, scheduleAOD, visible]);

//     const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//         if (!visible || isMobile) return;

//         const nx = (e.clientX / window.innerWidth - 0.5) * 2;
//         const ny = (e.clientY / window.innerHeight - 0.5) * 2;

//         pointerX.set(nx * parallaxStrength);
//         pointerY.set(ny * parallaxStrength);
//     };

//     const handleTouchEnd = () => {
//         if (!visible || !isMobile) return;

//         const ts = Date.now();
//         if (ts - lastTouchEndRef.current < 280) {
//             dismissAOD();
//         }
//         lastTouchEndRef.current = ts;
//     };

//     const startSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
//         if (!visible || dismissing) return;
//         const fromBottomZone = event.clientY >= window.innerHeight * 0.68;
//         if (!fromBottomZone) return;
//         dragControls.start(event, { distanceThreshold: 8 });
//     };

//     const handleDrag = (
//         _: MouseEvent | TouchEvent | PointerEvent,
//         info: { offset: { y: number } }
//     ) => {
//         overlayY.set(Math.min(0, info.offset.y));
//     };

//     const handleDragEnd = () => {
//         const draggedY = overlayY.get();

//         if (draggedY <= -swipeThreshold) {
//             dismissAOD();
//             return;
//         }

//         animate(overlayY, 0, {
//             type: "spring",
//             stiffness: 380,
//             damping: 32,
//         });
//     };

//     const activeLocale = locale ?? userLocale;
//     const activeTimeZone = timeZone ?? userTimeZone;

//     const dayDate = React.useMemo(() => {
//         return new Intl.DateTimeFormat(activeLocale, {
//             weekday: "long",
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//             timeZone: activeTimeZone,
//         }).format(now);
//     }, [activeLocale, activeTimeZone, now]);

//     const time = React.useMemo(() => {
//         return new Intl.DateTimeFormat(activeLocale, {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: false,
//             timeZone: activeTimeZone,
//         }).format(now);
//     }, [activeLocale, activeTimeZone, now]);

//     return (
//         <div className={cn("relative min-h-screen overflow-hidden bg-black", className)}>
//             <motion.div
//                 className="relative z-0 min-h-screen"
//                 animate={{ scale: visible ? 1.015 : 1 }}
//                 transition={{ type: "spring", stiffness: 120, damping: 22 }}
//             >
//                 {children}
//             </motion.div>

//             {visible && (
//                 <motion.div
//                     className={cn(
//                         "fixed inset-0 z-50 overflow-hidden select-none touch-none",
//                         overlayClassName
//                     )}
//                     style={{ y: overlayY, opacity: overlayOpacity }}
//                     drag="y"
//                     dragControls={dragControls}
//                     dragListener={false}
//                     dragConstraints={{ top: -220, bottom: 0 }}
//                     dragElastic={0.04}
//                     dragMomentum={false}
//                     onDrag={handleDrag}
//                     onDragEnd={handleDragEnd}
//                     onDoubleClick={() => {
//                         if (!isMobile) dismissAOD();
//                     }}
//                     onTouchEnd={handleTouchEnd}
//                     onMouseMove={handleMouseMove}
//                     onMouseLeave={resetParallax}
//                 >
//                     <div className="absolute inset-0 bg-black" />

//                     {backgroundSrc ? (
//                         <div className="absolute inset-0 overflow-hidden">
//                             <motion.div
//                                 className="absolute -inset-[12%] will-change-transform"
//                                 style={{ x: bgLayer1X, y: bgLayer1Y }}
//                             >
//                                 <Image
//                                     src={backgroundSrc}
//                                     alt={backgroundAlt}
//                                     fill
//                                     priority={backgroundPriority}
//                                     className="object-cover object-center scale-[1.06]"
//                                 />
//                             </motion.div>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="absolute inset-0 overflow-hidden">
//                                 <motion.div
//                                     className="absolute -inset-[14%] opacity-90 will-change-transform"
//                                     style={{ x: bgLayer1X, y: bgLayer1Y }}
//                                 >
//                                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.18),transparent_20%),radial-gradient(circle_at_80%_78%,rgba(168,85,247,0.18),transparent_24%),linear-gradient(180deg,#09090b_0%,#030712_45%,#000000_100%)]" />
//                                 </motion.div>
//                             </div>

//                             {enableDepthBackground && (
//                                 <div className="absolute inset-0 overflow-hidden">
//                                     <motion.div
//                                         className="absolute -inset-[16%] blur-3xl will-change-transform"
//                                         style={{ x: bgLayer2X, y: bgLayer2Y }}
//                                     >
//                                         <div className="absolute left-[8%] top-[14%] h-52 w-52 rounded-full bg-cyan-400/12" />
//                                         <div className="absolute right-[10%] top-[18%] h-72 w-72 rounded-full bg-fuchsia-500/10" />
//                                         <div className="absolute bottom-[10%] left-[18%] h-60 w-60 rounded-full bg-white/5" />
//                                     </motion.div>
//                                 </div>
//                             )}
//                         </>
//                     )}

//                     <div className="absolute inset-0 overflow-hidden">
//                         <motion.div
//                             className="absolute -inset-[10%] will-change-transform"
//                             style={{ x: bgLayer2X, y: bgLayer2Y }}
//                         >
//                             <div
//                                 className="absolute inset-0"
//                                 style={{
//                                     background: `
//                     radial-gradient(circle at 50% 32%, rgba(255,255,255,0.08), transparent 18%),
//                     radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), transparent 30%),
//                     linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.72) 100%)
//                   `,
//                                 }}
//                             />
//                             <div
//                                 className="absolute inset-0"
//                                 style={{
//                                     background: `rgba(0,0,0,${backgroundOverlayOpacity})`,
//                                 }}
//                             />
//                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.24)_72%,rgba(0,0,0,0.68)_100%)]" />
//                         </motion.div>
//                     </div>

//                     <motion.div
//                         className={cn(
//                             "relative z-10 min-h-screen px-6 text-white",
//                             contentClassName
//                         )}
//                         style={{ x: contentX, y: contentY }}
//                         initial={{ scale: 0.985, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         transition={{
//                             type: "spring",
//                             visualDuration: 0.45,
//                             bounce: 0.2,
//                         }}
//                     >
//                         <div className="flex min-h-screen flex-col items-center justify-start pt-[calc(env(safe-area-inset-top)+7rem)] text-center">
//                             <motion.div
//                                 initial={{ y: 10, opacity: 0 }}
//                                 animate={{ y: 0, opacity: 1 }}
//                                 transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
//                                 className={cn(
//                                     "mb-4 text-center text-sm uppercase tracking-[0.34em] text-white/60 md:text-base",
//                                     dateClassName
//                                 )}
//                             >
//                                 {dayDate}
//                             </motion.div>

//                             <motion.div
//                                 initial={{ y: 18, opacity: 0, filter: "blur(10px)" }}
//                                 animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
//                                 transition={{
//                                     type: "spring",
//                                     visualDuration: 0.5,
//                                     bounce: 0.22,
//                                     delay: 0.08,
//                                 }}
//                                 className={cn(
//                                     "text-center text-9xl font-semibold leading-none tracking-tight md:text-[128px] lg:text-[256px]",
//                                     timeClassName
//                                 )}
//                                 style={{
//                                     textShadow: enableClockGlow
//                                         ? "0 0 12px rgba(255,255,255,0.20), 0 0 30px rgba(255,255,255,0.14), 0 0 64px rgba(255,255,255,0.08)"
//                                         : "none",
//                                 }}
//                             >
//                                 {time}
//                             </motion.div>
//                         </div>

//                         <motion.div
//                             initial={{ opacity: 0, y: 8 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3, delay: 0.18 }}
//                             className="pointer-events-none absolute inset-x-0 bottom-16 text-center text-[11px] tracking-[0.28em] text-white/35 md:text-xs"
//                         >
//                             SWIPE UP TO OPEN
//                         </motion.div>
//                     </motion.div>

//                     <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center">
//                         <motion.div
//                             animate={{ opacity: [0.32, 0.68, 0.32], width: [84, 104, 84] }}
//                             transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
//                             className="h-1.5 rounded-full bg-white/50"
//                         />
//                     </div>

//                     <div
//                         className="absolute inset-x-0 bottom-0 z-20 h-32 cursor-ns-resize touch-none"
//                         onPointerDown={startSwipe}
//                     />
//                 </motion.div>
//             )}
//         </div>
//     );
// }


"use client";

import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/utils";

type AODBackgroundSrc = string | StaticImageData;

type AmbientAODProps = {
  children: React.ReactNode;
  idleDelay?: number;
  locale?: string;
  timeZone?: string;

  backgroundSrc?: AODBackgroundSrc;
  backgroundAlt?: string;
  backgroundPriority?: boolean;
  backgroundOverlayOpacity?: number;

  swipeThreshold?: number;
  parallaxStrength?: number;

  enableClockGlow?: boolean;
  enableDepthBackground?: boolean;

  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  dateClassName?: string;
  timeClassName?: string;

  onVisibleChange?: (visible: boolean) => void;
};

export function AmbientAOD({
  children,
  idleDelay = 10000,
  locale,
  timeZone,

  backgroundSrc,
  backgroundAlt = "AOD background",
  backgroundPriority = true,
  backgroundOverlayOpacity = 0.46,

  swipeThreshold = 120,
  parallaxStrength = 18,

  enableClockGlow = true,
  enableDepthBackground = true,

  className,
  overlayClassName,
  contentClassName,
  dateClassName,
  timeClassName,

  onVisibleChange,
}: AmbientAODProps) {
  const [visible, setVisible] = React.useState(false);
  const [dismissing, setDismissing] = React.useState(false);
  const [now, setNow] = React.useState(new Date());
  const [isMobile, setIsMobile] = React.useState(false);

  const [userLocale, setUserLocale] = React.useState("en-US");
  const [userTimeZone, setUserTimeZone] = React.useState("UTC");

  const idleTimerRef = React.useRef<number | null>(null);
  const lastTouchEndRef = React.useRef(0);

  const dragControls = useDragControls();

  const overlayY = useMotionValue(24);
  const overlayOpacity = useMotionValue(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const bgLayer2X = useSpring(useTransform(pointerX, (v) => v * 0.3), {
    stiffness: 140,
    damping: 22,
    mass: 0.42,
  });
  const bgLayer2Y = useSpring(useTransform(pointerY, (v) => v * 0.3), {
    stiffness: 140,
    damping: 22,
    mass: 0.42,
  });

  const bgX3 = useSpring(useTransform(pointerX, (v) => v), {
    stiffness: 140,
    damping: 20,
    mass: 0.35,
  });
  const bgY3 = useSpring(useTransform(pointerY, (v) => v), {
    stiffness: 140,
    damping: 20,
    mass: 0.35,
  });

  const contentX = useSpring(useTransform(pointerX, (v) => v * 0.4), {
    stiffness: 160,
    damping: 22,
    mass: 0.4,
  });
  const contentY = useSpring(useTransform(pointerY, (v) => v * 0.4), {
    stiffness: 160,
    damping: 22,
    mass: 0.4,
  });

  const clearIdleTimer = React.useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const scheduleAOD = React.useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(() => {
      setVisible(true);
      onVisibleChange?.(true);
    }, idleDelay);
  }, [clearIdleTimer, idleDelay, onVisibleChange]);

  const resetParallax = React.useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const dismissAOD = React.useCallback(() => {
    if (!visible || dismissing) return;

    setDismissing(true);
    onVisibleChange?.(false);

    animate(overlayOpacity, 0, {
      duration: 0.22,
      ease: "easeOut",
    });

    animate(overlayY, -window.innerHeight, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        setVisible(false);
        setDismissing(false);
        overlayY.set(24);
        overlayOpacity.set(0);
        resetParallax();
      },
    });
  }, [dismissing, onVisibleChange, overlayOpacity, overlayY, resetParallax, visible]);

  React.useEffect(() => {
    const coarse =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;

    setIsMobile(coarse);

    const resolved = new Intl.DateTimeFormat().resolvedOptions();

    setUserLocale(locale ?? resolved.locale ?? navigator.language ?? "en-US");
    setUserTimeZone(timeZone ?? resolved.timeZone ?? "UTC");
  }, [locale, timeZone]);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (visible) {
      clearIdleTimer();

      animate(overlayY, 0, {
        duration: 0.52,
        ease: [0.22, 1, 0.36, 1],
      });

      animate(overlayOpacity, 1, {
        duration: 0.32,
        ease: "easeOut",
      });
    } else {
      scheduleAOD();
    }

    return clearIdleTimer;
  }, [clearIdleTimer, overlayOpacity, overlayY, scheduleAOD, visible]);

  React.useEffect(() => {
    if (!visible) {
      resetParallax();
    }
  }, [visible, resetParallax]);

  React.useEffect(() => {
    const handleActivity = () => {
      if (!visible && !dismissing) scheduleAOD();
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "scroll",
      "keydown",
      "touchstart",
      "touchmove",
      "pointerdown",
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
    };
  }, [dismissing, scheduleAOD, visible]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visible || isMobile) return;

    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;

    pointerX.set(nx * parallaxStrength);
    pointerY.set(ny * parallaxStrength);
  };

  const handleTouchEnd = () => {
    if (!visible || !isMobile) return;

    const ts = Date.now();
    if (ts - lastTouchEndRef.current < 280) {
      dismissAOD();
    }
    lastTouchEndRef.current = ts;
  };

  const startSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!visible || dismissing) return;

    const fromBottomZone = event.clientY >= window.innerHeight * 0.68;
    if (!fromBottomZone) return;

    dragControls.start(event, { distanceThreshold: 8 });
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } }
  ) => {
    overlayY.set(Math.min(0, info.offset.y));
  };

  const handleDragEnd = () => {
    const draggedY = overlayY.get();

    if (draggedY <= -swipeThreshold) {
      dismissAOD();
      return;
    }

    animate(overlayY, 0, {
      type: "spring",
      stiffness: 380,
      damping: 32,
    });
  };

  const activeLocale = locale ?? userLocale;
  const activeTimeZone = timeZone ?? userTimeZone;

  const dayDate = React.useMemo(() => {
    return new Intl.DateTimeFormat(activeLocale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: activeTimeZone,
    }).format(now);
  }, [activeLocale, activeTimeZone, now]);

  const time = React.useMemo(() => {
    return new Intl.DateTimeFormat(activeLocale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: activeTimeZone,
    }).format(now);
  }, [activeLocale, activeTimeZone, now]);

  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-black", className)}>
      <motion.div
        initial={false}
        className="relative z-0 min-h-screen"
        style={visible ? { x: bgX3, y: bgY3 } : undefined}
        animate={visible ? { scale: 1.03 } : undefined}
        transition={
          visible
            ? { type: "spring", stiffness: 140, damping: 20 }
            : undefined
        }
      >
        {children}
      </motion.div>

      {visible && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 overflow-hidden select-none touch-none",
            overlayClassName
          )}
          style={{ y: overlayY, opacity: overlayOpacity }}
          drag="y"
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ top: -220, bottom: 0 }}
          dragElastic={0.04}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onDoubleClick={() => {
            if (!isMobile) dismissAOD();
          }}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetParallax}
        >
          {backgroundSrc ? (
            <>
              <div className="absolute inset-0 bg-black" />

              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute -inset-[12%] will-change-transform"
                  style={{ x: bgLayer2X, y: bgLayer2Y }}
                >
                  <Image
                    src={backgroundSrc}
                    alt={backgroundAlt}
                    fill
                    priority={backgroundPriority}
                    className="object-cover object-center scale-[1.06]"
                  />
                </motion.div>
              </div>

              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute -inset-[10%] will-change-transform"
                  style={{ x: bgLayer2X, y: bgLayer2Y }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(circle at 50% 32%, rgba(255,255,255,0.08), transparent 18%),
                        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), transparent 30%),
                        linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.72) 100%)
                      `,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `rgba(0,0,0,${backgroundOverlayOpacity})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.24)_72%,rgba(0,0,0,0.68)_100%)]" />
                </motion.div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            </>
          )}

          <motion.div
            className={cn(
              "relative z-10 min-h-screen px-6 text-white",
              contentClassName
            )}
            style={{ x: contentX, y: contentY }}
            initial={{ scale: 0.985, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              visualDuration: 0.45,
              bounce: 0.2,
            }}
          >
            <div className="flex min-h-screen flex-col items-center justify-start pt-[calc(env(safe-area-inset-top)+7rem)] text-center">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                className={cn(
                  "mb-4 text-center text-sm uppercase tracking-[0.34em] text-white/60 md:text-base",
                  dateClassName
                )}
              >
                {dayDate}
              </motion.div>

              <motion.div
                initial={{ y: 18, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  type: "spring",
                  visualDuration: 0.5,
                  bounce: 0.22,
                  delay: 0.08,
                }}
                className={cn(
                  "text-center text-9xl font-semibold leading-none tracking-tight md:text-[128px] lg:text-[256px]",
                  timeClassName
                )}
                style={{
                  textShadow: enableClockGlow
                    ? "0 0 12px rgba(255,255,255,0.20), 0 0 30px rgba(255,255,255,0.14), 0 0 64px rgba(255,255,255,0.08)"
                    : "none",
                }}
              >
                {time}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              className="pointer-events-none absolute inset-x-0 bottom-16 text-center text-[11px] tracking-[0.28em] text-white/35 md:text-xs"
            >
              SWIPE UP TO OPEN
            </motion.div>
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center">
            <motion.div
              animate={{ opacity: [0.32, 0.68, 0.32], width: [84, 104, 84] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 rounded-full bg-white/50"
            />
          </div>

          <div
            className="absolute inset-x-0 bottom-0 z-20 h-32 cursor-ns-resize touch-none"
            onPointerDown={startSwipe}
          />
        </motion.div>
      )}
    </div>
  );
}