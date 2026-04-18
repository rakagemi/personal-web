'use client';

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { SlideInButton } from "@/components/SlideInButton";
import { SOCIAL_LINKS } from "@/common/constants/social-media";
import BackgroundSection from "@/common/ui/background";
import { LiquidGlassCard } from "@/common/ui/card-liquid-glass";
import ExpertiseContent from "@/components/home/expertise";
import DockMotion from "@/common/ui/dock-motion";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Footer from "@/common/ui/footer";
import IntroductionContent from "@/components/home/introduction-content";

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
        <main className="relative">
            <BackgroundSection
                opacity={isDark ? "100" : "80"}
                animationMode="initial-only"
            />
            <section className="relative w-full min-h-screen overflow-hidden flex items-center">
                <div className="relative z-10 container mx-auto px-6 md:px-10 pt-40 pb-20 max-w-7xl w-full">
                    <LiquidGlassCard glass={"thin"} animated={true} spotlight={"soft"} entranceDelay={0.5}>
                        <div className="lg:p-8 p-2 flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1 + 0.2 }}
                                className=""
                            >
                                <IntroductionContent isDark={isDark} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1 + 0.5 }}
                                className="md:mt-4 flex flex-col justify-between gap-12 lg:gap-8 lg:flex-row lg:items-center"
                            >
                                <ExpertiseContent />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -2, scale: 1.02 }}
                                transition={{ duration: 0.8, delay: 1 + 0.7 }}
                                className="md:mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-center"
                            >
                                <DockMotion links={SOCIAL_LINKS} />
                                <SlideInButton
                                    initialText="Know me better"
                                    hoverText="Let's Go!"
                                    icon={<ArrowUpRight size={18} />}
                                    onClick={() => handleDownloadResume()}
                                    initialFill=""
                                    hoverFill="bg-gradient-to-r from-blue-500 to-purple-500"
                                    initialTextColor="text-neutral-800 dark:text-neutral-200"
                                    hoverTextColor="text-white"
                                    hasBorder={false}
                                    className="gw-btn flex items-center gap-2 cursor-pointer transition-all duration-300 py-7 lg:py-5 px-10 lg:px-8"
                                />
                            </motion.div>
                        </div>
                    </LiquidGlassCard>
                </div>
            </section>
            <Footer />
        </main>
    );
}