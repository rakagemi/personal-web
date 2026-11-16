"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { FLAIRS_IMAGES } from "@/common/constants/flair-images-cursor";
import { useIsMobile } from "@/hooks/use-detect-mobile";

export default function CursorTrail() {
    const isMobile = useIsMobile();
    const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Jangan inisialisasi di mobile atau jika isMobile belum terkonfirmasi false
        if (isMobile !== false) return;

        const flair = wrapperRefs.current.filter(Boolean) as HTMLDivElement[];
        if (!flair.length) return;

        const gap = 100;
        let index = 0;
        const wrapper = gsap.utils.wrap(0, flair.length);

        gsap.defaults({ duration: 1 });

        // Sembunyikan semua flair dulu ke luar viewport
        flair.forEach((el) => {
            gsap.set(el, { x: -9999, y: -9999, opacity: 0 });
        });

        let mousePos = { x: 0, y: 0 };
        let lastMousePos = { x: 0, y: 0 };
        const cachedMousePos = { x: 0, y: 0 };
        let isTickerActive = false;
        let idleTimer: ReturnType<typeof setTimeout> | null = null;

        function playAnimation(shape: HTMLDivElement) {
            const tl = gsap.timeline();
            tl.from(shape, {
                opacity: 0,
                scale: 0,
                ease: "elastic.out(1,0.3)",
            })
                .to(shape, { rotation: gsap.utils.random([-360, 360]) }, "<")
                .to(shape, { y: "+=120vh", ease: "back.in(.4)", duration: 1 }, 0);
        }

        function animateImage() {
            const wrappedIndex = wrapper(index);
            const el = flair[wrappedIndex];

            gsap.killTweensOf(el);
            gsap.set(el, { clearProps: "transform,opacity,scale,rotation" });
            gsap.set(el, {
                opacity: 1,
                x: mousePos.x,
                y: mousePos.y,
                xPercent: -50,
                yPercent: -50,
            });

            playAnimation(el);
            index++;
        }

        function stopTicker() {
            if (isTickerActive) {
                gsap.ticker.remove(imageTrail);
                isTickerActive = false;
            }
        }

        function startTicker() {
            if (!isTickerActive) {
                gsap.ticker.add(imageTrail);
                isTickerActive = true;
            }
            if (idleTimer) clearTimeout(idleTimer);
            // Auto-sleep jika mouse berhenti selama 500ms
            idleTimer = setTimeout(() => {
                stopTicker();
            }, 500);
        }

        function onMouseMove(e: MouseEvent) {
            mousePos = { x: e.clientX, y: e.clientY };
            startTicker();
        }

        function imageTrail() {
            const travelDistance = Math.hypot(
                lastMousePos.x - mousePos.x,
                lastMousePos.y - mousePos.y
            );

            cachedMousePos.x = gsap.utils.interpolate(
                cachedMousePos.x || mousePos.x,
                mousePos.x,
                0.1
            );
            cachedMousePos.y = gsap.utils.interpolate(
                cachedMousePos.y || mousePos.y,
                mousePos.y,
                0.1
            );

            if (travelDistance > gap) {
                animateImage();
                lastMousePos = { ...mousePos };
            }
        }

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            if (idleTimer) clearTimeout(idleTimer);
            stopTicker();
        };
    }, [isMobile]);

    // Di mobile atau saat SSR (isMobile !== false), jangan render elemen DOM apapun
    if (isMobile !== false) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                overflow: "visible",   // ← kunci! child bisa keluar dari bounds
                pointerEvents: "none",
                zIndex: 9999,
            }}
        >
            {FLAIRS_IMAGES.map((src, i) => (
                <div
                    key={i}
                    ref={(el) => { wrapperRefs.current[i] = el; }}
                    style={{
                        position: "absolute",
                        width: "60px",
                        height: "60px",
                        opacity: 0,
                        pointerEvents: "none",
                    }}
                >
                    <Image
                        src={src}
                        alt="cursor"
                        loading="lazy"
                        width={60}
                        height={60}
                        unoptimized
                        draggable={false}
                        style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                </div>
            ))}
        </div>
    );
}