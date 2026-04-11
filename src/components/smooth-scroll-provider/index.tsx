"use client";
import type { LenisRef } from 'lenis/react';
import { ReactLenis } from 'lenis/react';
import { PropsWithChildren } from "react";
import { cancelFrame, frame } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function SmoothScrollProvider({ children }: PropsWithChildren) {
    const lenisRef = useRef<LenisRef>(null)

    useEffect(() => {
        function update(data: { timestamp: number }) {
            const time = data.timestamp
            lenisRef.current?.lenis?.raf(time)
        }

        frame.update(update, true)

        return () => cancelFrame(update)
    }, [])

    return (
        <ReactLenis ref={lenisRef} root options={{ autoRaf: false, lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}