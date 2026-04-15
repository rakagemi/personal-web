import { useRef } from "react";
import { IconMail, IconMapPin } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

export function ContactInfoContent({ ref }: { ref: React.Ref<HTMLDivElement> }) {
    const scopeRef = useRef<HTMLDivElement | null>(null);
    const descRef = useRef<HTMLParagraphElement | null>(null);

    useGSAP(
        () => {
            if (!descRef.current) return;

            const el = descRef.current;
            const finalText =
                "Have a project in mind, a freelance opportunity, or just want to chat about web development? I'd love to hear from you.";

            const play = () => {
                el.textContent = finalText;

                gsap.to(el, {
                    duration: 1.2,
                    ease: "none",
                    scrambleText: {
                        text: finalText,
                        chars: "upperAndLowerCase",
                        speed: 3,
                        revealDelay: 0.1,
                        tweenLength: true,
                    },
                });
            };

            play();

            const loop = gsap.delayedCall(5, function repeat() {
                play();
                loop.restart(true);
            });

            return () => {
                loop.kill();
                gsap.killTweensOf(el);
            };
        },
        { scope: scopeRef }
    );

    return (
        <div
            ref={(node) => {
                scopeRef.current = node;
                if (typeof ref === "function") {
                    ref(node);
                }
                if (ref && "current" in ref) {
                    (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
                }
            }}
            className="lg:col-span-2 flex flex-col sm:flex-row md:flex-col justify-center gap-8">
            <div>
                <div className="contact-badge mb-4 inline-flex items-center rounded-full border border-blue-200 bg-black-50 dark:border-blue-500/30 dark:bg-white-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 backdrop-blur-xl transition-colors">
                    Get in Touch
                </div>
                <h1 className="contact-title text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white tracking-tight mb-4 transition-colors">
                    <span className="title-line-split block leading-[0.95]">Let&apos;s Build</span>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
                        Together.
                    </span>
                </h1>
                <div className="w-full">
                    <p
                        ref={descRef}
                        className="contact-desc w-full max-w-[20rem] sm:max-w-sm md:max-w-md lg:max-w-lg text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed transition-colors whitespace-normal break-words text-pretty"
                    >
                        Have a project in mind, a freelance opportunity, or just want to chat about web development? I&apos;d love to hear from you.
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-6 mt-4 justify-start sm:justify-center md:justify-start">
                <div className="contact-item flex items-center gap-4 text-neutral-600 dark:text-neutral-300">
                    <div className="contact-icon flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-white/25 dark:border-white/10 dark:bg-white/4 dark:hover:bg-white/8 text-neutral-500 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400">
                        <IconMail size={22} />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-900/50 dark:text-neutral-400 font-medium transition-colors">Email Me At</p>
                        <p className="font-semibold text-neutral-900/70 dark:text-neutral-200 transition-colors">raka.pancid@gmail.com</p>
                    </div>
                </div>
                <div className="contact-item flex items-center gap-4 text-neutral-600 dark:text-neutral-300">
                    <div className="contact-icon group flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-white/25 dark:border-white/10 dark:bg-white/4 dark:hover:bg-white/8 text-neutral-500 dark:text-neutral-500">
                        <IconMapPin
                            size={22}
                            className="group-hover:stroke-[url(#rainbow-gradient)] group-hover:text-transparent"
                        />
                        <svg width="0" height="0" className="absolute">
                            <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop stopColor="#ef4444" offset="0%" />
                                <stop stopColor="#eab308" offset="25%" />
                                <stop stopColor="#22c55e" offset="50%" />
                                <stop stopColor="#3b82f6" offset="75%" />
                                <stop stopColor="#a855f7" offset="100%" />
                            </linearGradient>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-neutral-900/70 dark:text-neutral-400 font-medium transition-colors">Based In</p>
                        <p className="font-semibold text-neutral-900/70 dark:text-neutral-200 transition-colors">Jakarta Selatan, Indonesia</p>
                    </div>
                </div>
            </div>
        </div>
    )
}