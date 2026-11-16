"use client";

import type { LenisRef } from "lenis/react";
import { ReactLenis, useLenis } from "lenis/react";
import { PropsWithChildren, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Komponen sinkronisasi scroll: menghubungkan event scroll Lenis ke GSAP ScrollTrigger secara reaktif
function ScrollTriggerSync() {
    useLenis(() => {
        ScrollTrigger.update();
    });

    return null;
}

export default function SmoothScrollProvider({ children }: PropsWithChildren) {
    const lenisRef = useRef<LenisRef>(null);

    useEffect(() => {
        // Masukkan pergerakan frame Lenis ke dalam loop GSAP Ticker resmi
        // time dari GSAP berformat detik, dikonversi ke milidetik (* 1000) untuk Lenis
        const updateTicker = (time: number) => {
            lenisRef.current?.lenis?.raf(time * 1000);
        };

        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(updateTicker);
        };
    }, []);

    return (
        <ReactLenis
            ref={lenisRef}
            root
            autoRaf={false}
            options={{
                lerp: 0.1,
                duration: 1.2,
                smoothWheel: true,
            }}
        >
            <ScrollTriggerSync />
            {children}
        </ReactLenis>
    );
}
