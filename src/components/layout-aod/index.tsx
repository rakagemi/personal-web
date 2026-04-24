"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AmbientAOD } from "@/components/ambient-aod";
import darkBg from "@/../public/assets/home/dark-bg-section.jpg";
import dayBg from "@/../public/assets/home/day-bg-section.jpg";
import { CLIENT_ENV } from "@/utils/environment/client";

type LayoutAODProps = {
    children: React.ReactNode;
};

export function LayoutAOD({ children }: LayoutAODProps) {
    const isMaintenance = CLIENT_ENV.maintenanceMode;
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const bgSrc = !mounted
        ? darkBg
        : resolvedTheme === "light"
            ? dayBg
            : darkBg;


    if (isMaintenance == "true") return null

    return (
        <AmbientAOD
            idleDelay={15000}
            // backgroundSrc={bgSrc}
            // backgroundAlt={resolvedTheme === "light" ? "Day skyline" : "Night skyline"}
            enableClockGlow
            enableDepthBackground
            parallaxStrength={18}
            swipeThreshold={120}
        >
            {children}
        </AmbientAOD>
    );
}