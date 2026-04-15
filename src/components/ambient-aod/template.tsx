"use client";

import * as React from "react";
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/utils";

type AmbientAODProps = {
  children: React.ReactNode;
  idleDelay?: number; // ms
  locale?: string;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  dateClassName?: string;
  timeClassName?: string;
  swipeThreshold?: number;
  parallaxStrength?: number;
  onVisibleChange?: (visible: boolean) => void;
};

export function TemplateAmbientAOD({
  children,
  idleDelay = 10000,
  locale = "id-ID",
  className,
  overlayClassName,
  contentClassName,
  dateClassName,
  timeClassName,
  swipeThreshold = 120,
  parallaxStrength = 18,
  onVisibleChange,
}: AmbientAODProps) {
  const [visible, setVisible] = React.useState(false);
  const [dismissing, setDismissing] = React.useState(false);
  const [now, setNow] = React.useState(new Date());
  const [isMobile, setIsMobile] = React.useState(false);

  const idleTimerRef = React.useRef<number | null>(null);
  const lastTouchEndRef = React.useRef(0);

  const dragControls = useDragControls();

  const overlayY = useMotionValue(0);
  const overlayOpacity = useMotionValue(1);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const bgX = useSpring(useTransform(pointerX, (v) => v), {
    stiffness: 140,
    damping: 20,
    mass: 0.35,
  });
  const bgY = useSpring(useTransform(pointerY, (v) => v), {
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
    if (typeof window === "undefined") return;
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
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        setVisible(false);
        setDismissing(false);
        overlayY.set(0);
        overlayOpacity.set(1);
        resetParallax();
      },
    });
  }, [
    dismissing,
    onVisibleChange,
    overlayOpacity,
    overlayY,
    resetParallax,
    visible,
  ]);

  const nudgeSwipeHint = React.useCallback(() => {
    if (!visible || dismissing) return;

    animate(overlayY, -16, {
      duration: 0.12,
      ease: "easeOut",
      onComplete: () => {
        animate(overlayY, 0, {
          type: "spring",
          stiffness: 320,
          damping: 28,
        });
      },
    });
  }, [dismissing, overlayY, visible]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const coarse =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;

    setIsMobile(coarse);
  }, []);

  React.useEffect(() => {
    const tick = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(tick);
  }, []);

  React.useEffect(() => {
    if (visible) {
      clearIdleTimer();

      overlayY.set(18);
      overlayOpacity.set(0);

      animate(overlayY, 0, {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      });

      animate(overlayOpacity, 1, {
        duration: 0.24,
        ease: "easeOut",
      });
    } else {
      scheduleAOD();
    }

    return clearIdleTimer;
  }, [clearIdleTimer, overlayOpacity, overlayY, scheduleAOD, visible]);

  React.useEffect(() => {
    const handleActivity = () => {
      if (!visible && !dismissing) {
        scheduleAOD();
      }
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

    const nowTs = Date.now();
    if (nowTs - lastTouchEndRef.current < 280) {
      dismissAOD();
    }
    lastTouchEndRef.current = nowTs;
  };

  const startSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!visible || dismissing) return;

    const fromBottomZone = event.clientY >= window.innerHeight * 0.68;
    if (!fromBottomZone) return;

    dragControls.start(event, { distanceThreshold: 8 });
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { y: number } }) => {
    if (info.offset.y < -swipeThreshold) {
      dismissAOD();
      return;
    }

    animate(overlayY, 0, {
      type: "spring",
      stiffness: 380,
      damping: 32,
    });
  };

  const dayDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const time = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-black", className)}>
      <motion.div
        className="relative z-0 min-h-screen will-change-transform"
        style={{ x: bgX, y: bgY }}
        animate={{ scale: visible ? 1.03 : 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
      >
        {children}
      </motion.div>

      {visible && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 select-none overflow-hidden touch-none",
            overlayClassName
          )}
          style={{ y: overlayY, opacity: overlayOpacity }}
          drag="y"
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ top: -180, bottom: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          onDoubleClick={() => {
            if (!isMobile) dismissAOD();
          }}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetParallax}
          onWheel={(e) => {
            if (!isMobile && e.deltaY < 0) {
              nudgeSwipeHint();
            }
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            className={cn(
              "relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-white",
              contentClassName
            )}
            style={{ x: contentX, y: contentY }}
          >
            <div
              className={cn(
                "mb-3 text-center text-sm uppercase tracking-[0.35em] text-white/55",
                dateClassName
              )}
            >
              {dayDate}
            </div>

            <div
              className={cn(
                "text-center text-7xl font-semibold tracking-tight text-white md:text-8xl lg:text-9xl",
                timeClassName
              )}
            >
              {time}
            </div>
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
            <div className="h-1.5 w-24 rounded-full bg-white/30" />
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