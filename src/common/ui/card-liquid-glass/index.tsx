"use client"

import * as React from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "motion/react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/utils"

type GlassLevel = "none" | "thin" | "medium" | "thick"
type SpotlightVariant = "none" | "soft" | "premium"

export interface LiquidGlassCardProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  cardTitle?: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
  badge?: React.ReactNode
  footer?: React.ReactNode
  headerRight?: React.ReactNode
  icon?: LucideIcon
  glass?: GlassLevel
  spotlight?: SpotlightVariant
  animated?: boolean
  entranceDelay?: number
  contentClassName?: string
}

const glassMap: Record<
  GlassLevel,
  {
    root: string
    inner: string
    glow: string
    noise: string
  }
> = {
  none: {
    root: cn(
      "gw-card"
    ),
    inner: "",
    glow: "",
    noise: "opacity-[0.01]",
  },
  thin: {
    root: cn(
      "border-white/10 bg-white/[0.05] backdrop-blur-md",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_24px_rgba(0,0,0,0.14)]"
    ),
    inner: "border-white/10",
    glow: "from-white/10 to-transparent",
    noise: "opacity-[0.03]",
  },
  medium: {
    root: cn(
      "border-white/15 bg-white/[0.08] backdrop-blur-xl",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(255,255,255,0.04),0_12px_34px_rgba(0,0,0,0.20),0_24px_80px_rgba(0,0,0,0.18)]"
    ),
    inner: "border-white/10",
    glow: "from-lime-200/10 to-transparent",
    noise: "opacity-[0.04]",
  },
  thick: {
    root: cn(
      "border-white/20 bg-white/[0.10] backdrop-blur-[22px]",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.20),inset_0_-1px_0_rgba(255,255,255,0.06),0_16px_44px_rgba(0,0,0,0.24),0_28px_100px_rgba(0,0,0,0.22)]"
    ),
    inner: "border-white/15",
    glow: "from-lime-200/15 to-transparent",
    noise: "opacity-[0.05]",
  },
}

const spotlightMap: Record<
  SpotlightVariant,
  {
    size: number
    color: string
    hoverScale: number
    ring: string
  }
> = {
  none: {
    size: 0,
    color: "rgba(255,255,255,0)",
    hoverScale: 1,
    ring: "ring-0",
  },
  soft: {
    size: 180,
    color: "rgba(255,255,255,0.14)",
    hoverScale: 1.012,
    ring: "ring-1 ring-white/10",
  },
  premium: {
    size: 240,
    color: "rgba(255,255,255,0.20)",
    hoverScale: 1.018,
    ring: "ring-1 ring-white/15",
  },
}

const entranceTransition = {
  duration: 0.48,
  ease: [0.22, 1, 0.36, 1] as const,
}

const hoverInTransition = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 0.72,
}

const hoverOutTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 22,
  mass: 0.92,
}

export function LiquidGlassCard({
  cardTitle,
  subtitle,
  children,
  badge,
  footer,
  headerRight,
  icon: Icon,
  glass = "medium",
  spotlight = "premium",
  animated = true,
  entranceDelay = 0,
  className,
  contentClassName,
  onMouseMove,
  onMouseLeave,
  ...props
}: LiquidGlassCardProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null)

  const mx = useMotionValue(180)
  const my = useMotionValue(120)

  const smoothX = useSpring(mx, {
    stiffness: 220,
    damping: 28,
    mass: 0.55,
  })

  const smoothY = useSpring(my, {
    stiffness: 220,
    damping: 28,
    mass: 0.55,
  })

  const currentGlass = glassMap[glass]
  const currentSpotlight = spotlightMap[spotlight]
  const hasHeader = cardTitle || subtitle || badge || headerRight || Icon

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      ${currentSpotlight.size}px circle at ${smoothX}px ${smoothY}px,
      ${currentSpotlight.color},
      transparent 68%
    )
  `

  const handleMouseMove: NonNullable<HTMLMotionProps<"div">["onMouseMove"]> = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)

    onMouseMove?.(e)
  }

  const handleMouseLeave: NonNullable<HTMLMotionProps<"div">["onMouseLeave"]> = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()

    if (rect) {
      mx.set(rect.width * 0.72)
      my.set(rect.height * 0.22)
    }

    onMouseLeave?.(e)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={animated ? { opacity: 0, y: 18, scale: 0.985 } : false}
      animate={
        animated
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                ...entranceTransition,
                delay: entranceDelay,
              },
            }
          : undefined
      }
      whileHover={
        animated
          ? {
              y: -4,
              scale: currentSpotlight.hoverScale,
              transition: hoverInTransition,
            }
          : undefined
      }
      transition={hoverOutTransition}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "gw-card group relative isolate overflow-hidden rounded-[30px] border text-white",
        // "bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04)),linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]",
        "transform-gpu will-change-transform",
        currentGlass.root,
        currentSpotlight.ring,
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-px rounded-[29px] border",
          currentGlass.inner
        )}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
        style={{
          background: spotlightBackground,
        }}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-linear-to-br blur-3xl",
          currentGlass.glow
        )}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] opacity-70"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.02) 38%, transparent 65%)",
        }}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[30px] bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\" viewBox=\"0 0 140 140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"1.1\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"140\" height=\"140\" filter=\"url(%23n)\" opacity=\"1\"/></svg>')] mix-blend-soft-light",
          currentGlass.noise
        )}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 30%, transparent 100%)",
        }}
      />

      <div className="relative z-10 px-0 py-2 sm:p-5 md:p-6">
        {hasHeader && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {(Icon || cardTitle) && (
                <div className="flex items-center gap-3">
                  {Icon && (
                    <motion.div
                      whileHover={
                        animated
                          ? {
                              rotate: -4,
                              scale: 1.04,
                              transition: {
                                type: "spring",
                                stiffness: 340,
                                damping: 20,
                                mass: 0.7,
                              },
                            }
                          : undefined
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    >
                      <Icon className="h-5 w-5 text-white/90" strokeWidth={1.8} />
                    </motion.div>
                  )}

                  {cardTitle && (
                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold tracking-[-0.02em] md:text-xl">
                        {cardTitle}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {subtitle && (
                <p
                  className={cn(
                    "mt-2 text-sm leading-6 text-white/70",
                    !cardTitle && !Icon && "mt-0"
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {(headerRight || badge) && (
              <div className="flex shrink-0 items-center gap-2">
                {headerRight}
                {badge && (
                  <span className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 text-sm font-medium text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    {badge}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className={cn("relative z-10 flex flex-col gap-3", contentClassName)}>
          {children}
        </div>

        {footer && <div className="relative z-10 mt-4">{footer}</div>}
      </div>
    </motion.div>
  )
}