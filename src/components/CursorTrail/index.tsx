"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { FLAIRS_IMAGES } from "@/common/constants/flair-images-cursor";

export default function CursorTrail() {
    const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const flair = wrapperRefs.current.filter(Boolean) as HTMLDivElement[];
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

        function onMouseMove(e: MouseEvent) {
            mousePos = { x: e.clientX, y: e.clientY };
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
        gsap.ticker.add(imageTrail);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            gsap.ticker.remove(imageTrail);
        };
    }, []);

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
                        loading="eager"
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