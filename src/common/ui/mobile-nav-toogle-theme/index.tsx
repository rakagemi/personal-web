"use client";

import { cn } from "@/utils";
import { HTMLMotionProps, motion } from "motion/react";
import React from "react";

interface ThemeToggleContainerProps extends HTMLMotionProps<"div"> {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    mounted: boolean;
    className?: string;
}

export function ThemeToggleContainer({
    theme,
    setTheme,
    mounted,
    className,
    ...props
}: ThemeToggleContainerProps) {
    if (!mounted) return null;

    // Bounce transition inspired from SlideInButton
    const bouncyTransition = {
        type: "spring" as const,
        stiffness: 350,
        damping: 60,
        mass: 1
    };

    const isLight = theme === "light";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                "relative w-full p-4 mt-2 mb-4 gap-4 rounded-[64px] flex items-center justify-start text-neutral-600 dark:text-neutral-300",
                isLight ? "bg-transparent border-neutral-300 hover:bg-neutral-200" : "bg-transparent border-neutral-800 hover:bg-neutral-700 dark:bg-transparent! backdrop-blur-xl! dark:border-transparent",
                className
            )}
            {...props}
        >
            {/* Sliding White Background - Shifts left/right with bounce */}
            <motion.div
                className={cn(
                    "absolute inset-0 w-[50%] bg-white/20 shadow-2xl rounded-[64px] z-10 border-white/50",
                )}
                variants={{
                    light: { x: "0%" },
                    dark: { x: "100%" }
                }}
                initial={isLight ? "dark" : "light"}
                animate={isLight ? "dark" : "light"}
                transition={bouncyTransition}
            />

            {/* Content wrapper - higher z-index */}
            <div className="relative z-10 flex items-center gap-4 w-full">
                {/* Dark Theme Button */}
                <motion.button
                    className="relative z-20 px-3 rounded-full bg-transparent border-2 border-transparent  flex items-center justify-center transition-all duration-200"
                    onClick={() => setTheme("dark")}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                >
                    {/* Moon Icon or Dark indicator */}
                    <span className="text-3xl">🌙</span>
                </motion.button>

                {/* Light Theme Button */}
                <motion.button
                    className="ml-auto relative z-20 px-3 rounded-full bg-transparent border-2 border-transparent  flex items-center justify-center transition-all duration-200"
                    onClick={() => setTheme("light")}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                >
                    {/* Sun Icon or Light indicator */}
                    <span className="text-3xl">☀️</span>
                </motion.button>

                {/* Theme Text */}
                {/* <span className="font-medium select-none">Theme</span> */}

            </div>
        </motion.div>
    );
}