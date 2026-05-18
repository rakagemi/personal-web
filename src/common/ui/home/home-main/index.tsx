'use client'

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { SlideInButton } from "@/components/SlideInButton";
import { SOCIAL_LINKS } from "@/common/constants/social-media";
import { LiquidGlassCard } from "@/common/ui/card-liquid-glass";
import ExpertiseContent from "@/components/home/expertise";
import DockMotion from "@/common/ui/dock-motion";
import dynamic from "next/dynamic";

const BackgroundSection = dynamic(() => import('@/common/ui/background'), {
    ssr: false,
});
const IntroductionSection = dynamic(() => import('@/components/home/introduction-content'), {
    ssr: false,
})
const NewsContent = dynamic(() => import('@/components/home/news-content'), {
    ssr: false,
})
const FooterSection = dynamic(() => import('@/common/ui/footer'), {
    ssr: false,
});

export default function HomeMainContent() {
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

    return (
        <div id="home">
            <main className="relative">
                <BackgroundSection
                    opacity={"100"}
                    backgroundImage={"/assets/home/dark-bg-section.jpg"}
                    animationMode="always"
                />
                <section className="relative w-full min-h-screen overflow-hidden flex items-center">
                    <div className="relative z-10 container mx-auto px-6 pb-20 md:px-10 pt-30 md:pt-20 max-w-7xl w-full">
                        <LiquidGlassCard glass={"thin"} animated={true} spotlight={"soft"} entranceDelay={0.5}>
                            <div className="lg:p-8 p-2 flex flex-col gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1 + 0.2 }}
                                    className=""
                                >
                                    <IntroductionSection />
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
                                        initialTextColor="text-neutral-200"
                                        hoverTextColor="text-white"
                                        hasBorder={false}
                                        className="gw-btn flex items-center gap-2 cursor-pointer transition-all duration-300 py-7 lg:py-5 px-10 lg:px-8"
                                    />
                                </motion.div>
                            </div>
                        </LiquidGlassCard>
                    </div>
                </section>
                <FooterSection />
            </main>
            <section className="bg-[#0e100f] relative w-full h-full">
                <NewsContent />
            </section>
        </div>
    );
}