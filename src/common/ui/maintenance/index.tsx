"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import SpaceTunnel from "@/components/tunnel-scene";

export default function Maintenance() {
    return (
        <main id={'maintenance'}>
            <div className="relative min-h-screen w-full flex items-center justify-center bg-neutral-950 overflow-hidden">
                <div className="absolute inset-0 z-10">
                    <SpaceTunnel />
                </div>
                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "tween", stiffness: 30, damping: 20 }}
                        className="gw-card mx-auto px-4 py-8 flex flex-col items-center text-center relative">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative flex items-center justify-center mb-8"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                className="absolute"
                            >
                                <svg
                                    width={120}
                                    height={120}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth={1}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <defs>
                                        <linearGradient id="settings-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#fbbf24" />
                                            <stop offset="50%" stopColor="#f97316" />
                                            <stop offset="100%" stopColor="#ea580c" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        stroke="url(#settings-grad)"
                                        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                                    />
                                    <circle stroke="url(#settings-grad)" cx="12" cy="12" r="3" />
                                </svg>
                            </motion.div>
                            <div
                                className="
                                relative z-10 overflow-hidden rounded-2xl w-18 h-18
                                bg-neutral-700/40
                                shadow-[0_12px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]
                                backdrop-blur-2xl backdrop-saturate-150"
                            >
                                <Image src="/assets/image/unnamed.jpg" loading="eager" priority className="object-cover" width={80} height={80} alt="logo" />
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
                                className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-neutral-300 backdrop-blur-md"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                Maintenance System in Progress
                            </motion.div>
                            <h1 className="text-2xl md:text-5xl uppercase font-black text-white mb-6 tracking-tight">
                                I&apos;m working out🏋️‍♂️ <br />
                                <span className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    You saw nothing
                                </span>
                                <span>🙏</span>
                            </h1>
                            <p className="text-lg font-medium text-neutral-300">
                                I&lsquo;d be right back.
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
                    </motion.div>
                </div>
            </div>
        </main>
    )
}