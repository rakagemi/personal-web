"use client";

import { cn } from "@/utils";
import { HTMLMotionProps, motion } from "motion/react";
import React from "react";

interface SlideInButtonProps extends HTMLMotionProps<"button"> {
  initialText: React.ReactNode;
  hoverText: React.ReactNode;
  initialFill?: string;
  hoverFill?: string;
  hasBorder?: boolean;
  borderColor?: string;
  initialTextColor?: string;
  hoverTextColor?: string;
  icon?: React.ReactNode;
}

export function SlideInButton({
  initialText,
  hoverText,
  initialFill = "",
  hoverFill = "bg-blue-500",
  hasBorder = true,
  borderColor = "border-neutral-800",
  initialTextColor = "text-neutral-300",
  hoverTextColor = "text-white",
  icon,
  className,
  ...props
}: SlideInButtonProps) {

  // PERBAIKAN ANIMASI PANTULAN (BOUNCE)
  // Damping kita turunkan drastis ke 15 (sebelumnya 30) untuk membiarkan energinya memantul.
  // Stiffness kita naikkan ke 350 agar hentakannya lebih cepat dan terasa solid.
  const bouncyTransition = {
    type: "spring" as const,
    stiffness: 350,
    damping: 60,
    mass: 1
  };

  return (
    <motion.button
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 0.95 }} // Diperhalus sedikit scale-nya saat di-klik
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-medium transition-colors active:scale-95",
        initialFill,
        hasBorder && `border ${borderColor}`,
        className
      )}
      {...props}
    >
      {/* 1. Latar Belakang (Efek Bertahap & Bounce)
        Trik Rahasia:
        - Kita buat tingginya melebihi tombol (-bottom-[50%]) agar saat dia memantul ke atas,
          bagian bawah tombol tidak bocor/bolong.
        - Kita gunakan animasi borderRadius dari 100% (melengkung) ke 0% (rata) untuk efek mengisi bertahap.
      */}
      <motion.div
        variants={{
          initial: { y: "100%", borderRadius: "100% 100% 0 0" },
          hover: { y: "0%", borderRadius: "0% 0% 0 0" },
        }}
        transition={bouncyTransition}
        className={cn("absolute inset-x-0 -bottom-[50%] top-0 z-0", hoverFill)}
      />

      {/* Wadah Teks & Icon */}
      <div className="relative z-10 flex items-center justify-center overflow-hidden">

        {/* 2. Teks & Icon Asli: Ikut memantul ke atas */}
        <motion.span
          variants={{
            initial: { y: "0%" },
            hover: { y: "-150%" },
          }}
          transition={bouncyTransition}
          className={cn("flex items-center gap-2", initialTextColor)}
        >
          {initialText}
          {icon && <span className="inline-flex">{icon}</span>}
        </motion.span>

        {/* 3. Teks & Icon Pengganti: Ikut memantul dari bawah */}
        <motion.span
          variants={{
            initial: { y: "150%" },
            hover: { y: "0%" },
          }}
          transition={bouncyTransition}
          className={cn("absolute flex items-center gap-2 font-bold", hoverTextColor)}
        >
          {hoverText}
          {icon && <span className="inline-flex">{icon}</span>}
        </motion.span>
      </div>
    </motion.button>
  );
}