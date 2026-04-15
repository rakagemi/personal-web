'use client';

import { Hand, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { SlideInButton } from "@/components/SlideInButton";
import { SOCIAL_LINKS } from "@/common/constants/social-media";
import BackgroundSection from "@/common/ui/background";
import Image from "next/image";
import { LiquidGlassCard } from "../../card-liquid-glass";
import Expertise from "../../expertise";
import DockMotion from "../../dock-motion";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import ScrambleIntroText from "../scramble-quotes-hero";

const emptySubscribe = () => () => { };

function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
}

export default function HeroSection() {
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();
    const isDark = resolvedTheme === "dark";

    const handleDownloadResume = () => {
        if (typeof document !== "undefined") {
            const link = document.createElement('a');
            link.href = '/assets/cv/cv_raka_2026_ats.pdf';
            link.download = 'Raka_Gemi_Ibrahim_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    if (!mounted) return null;

    return (
        <section className="relative w-full min-h-screen overflow-hidden flex items-center">
            <BackgroundSection
                opacity="100"
                animationMode="initial-only"
            />
            {/*  KONTEN HERO: Dibungkus container agar tetap rapi di tengah, dan diberi z-10 agar di atas background */}
            <div className="relative z-10 container mx-auto px-6 md:px-10 pt-40 pb-20 max-w-7xl w-full">
                <LiquidGlassCard glass={"thin"} animated={true} spotlight={"soft"} entranceDelay={0.5}>
                    <div className="lg:p-8 p-4 flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            <p className="dark:text-neutral-300 flex items-center gap-3 text-lg text-neutral-800 font-medium">
                                <span className="inline-flex items-center gap-1">
                                    <Hand className="animate-wave-animation text-blue-500 dark:text-blue-300" size={28} />
                                </span>
                                Hey! I&apos;m Raka Gemi Ibrahim,
                            </p>
                        </motion.div>
                        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8 md:gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1 + 0.2 }}
                            >
                                <h1 className="text-neutral-950 dark:text-neutral-200 text-3xl text-center sm:text-left sm:text-5xl md:text-6xl font-extrabold text-pretty leading-none">
                                    Software <br className="hidden md:relative" /> Engineer
                                </h1>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.3 }}
                                className="flex items-center justify-center gap-2 md:gap-4 pt-2 md:pt-0"
                            >
                                <div className="shrink-0 opacity-100 w-5 sm:w-7 h-auto">
                                    <Image
                                        src={
                                            isDark
                                                ? "/assets/icon/white-curly-bracket.svg"
                                                : "/assets/icon/black-curly-bracket.svg"
                                        }
                                        width={30}
                                        height={30}
                                        alt="curly-brackets"
                                        style={{ width: "auto", height: "auto" }}
                                    />
                                </div>
                                <div className="w-fit max-w-full md:max-w-225">
                                    <ScrambleIntroText
                                        delay={2}
                                        replayEvery={5}
                                        speed="slow"
                                    />
                                </div>
                                <div className="shrink-0 rotate-180 opacity-100 w-5 sm:w-7 h-auto">
                                    <Image
                                        src={
                                            isDark
                                                ? "/assets/icon/white-curly-bracket.svg"
                                                : "/assets/icon/black-curly-bracket.svg"
                                        }
                                        width={30}
                                        height={30}
                                        alt="curly-brackets"
                                        style={{ width: "auto", height: "auto" }}
                                    />
                                </div>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 + 0.6 }}
                            className="md:mt-4 flex flex-col justify-between gap-12 lg:gap-8 lg:flex-row lg:items-center"
                        >
                            <Expertise />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                            transition={{ duration: 0.8, delay: 1 + 0.9 }}
                            className="md:mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-center"
                        >
                            <DockMotion links={SOCIAL_LINKS} />
                            <SlideInButton
                                initialText="Know me better"
                                hoverText="Let's Go!"
                                icon={<ArrowUpRight size={18} />}
                                onClick={() => handleDownloadResume()}
                                initialFill="bg-white/10 dark:bg-white/5"
                                hoverFill="bg-gradient-to-r from-blue-500 to-purple-500"
                                initialTextColor="text-neutral-800 dark:text-neutral-200"
                                hoverTextColor="text-white"
                                hasBorder={false}
                                className="flex items-center gap-2 cursor-pointer transition-all duration-300 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_rgba(0,0,0,0.10)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_28px_rgba(0,0,0,0.16)] backdrop-blur-xl lg:py-5 px-10 lg:px-8"
                            />
                        </motion.div>
                    </div>
                </LiquidGlassCard>
            </div>
        </section>
    );
}