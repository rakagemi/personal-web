"use client";
import { motion } from "motion/react";
import { Settings, Wrench, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Maintenance() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-white dark:bg-neutral-950 overflow-hidden selection:bg-blue-500/30">

            {/* Background Glow Effects (Efek Cahaya di belakang) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-300/60 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-75 h-75 bg-purple-300 dark:bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative flex items-center justify-center mb-8"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                        className="absolute text-neutral-800 dark:text-neutral-800/50"
                    >
                        <Settings size={120} strokeWidth={1} />
                    </motion.div>
                    <div
                          className="
                            relative z-10 overflow-hidden rounded-2xl w-18 h-18
                            bg-white/18 dark:bg-neutral-700/40
                            shadow-[0_12px_40px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.35)]
                            dark:shadow-[0_12px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]
                            backdrop-blur-2xl backdrop-saturate-150"
                        >
                        {/* <Wrench size={40} className="text-white" /> */}
                        <Image src="/assets/image/unnamed.jpg" className="object-cover" width={80} height={80} alt="logo" />
                    </div>
                    <motion.div
                        animate={{ y: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 text-blue-400"
                    >
                        <Sparkles size={24} />
                    </motion.div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-neutral-500 dark:text-neutral-300 backdrop-blur-md"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        System Upgrade in Progress
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold text-neutral-600 dark:text-white mb-6 tracking-tight">
                        We are currently <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                            under maintenance
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed">
                        I&apos;m currently upgrading the portfolio to bring you a better experience.
                        Everything will be back online shortly. Thank you for your patience!
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="w-64 max-w-full h-1 bg-neutral-800 rounded-full overflow-hidden"
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1/2 h-full bg-linear-to-r from-transparent via-blue-500 to-transparent rounded-full"
                    />
                </motion.div>
            </div>
        </div>
    )
}