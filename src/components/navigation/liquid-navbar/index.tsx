"use client";

import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/default-navbar";
import { useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { useState, useRef } from "react";
import { useLenis } from "lenis/react";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/common/constants/navigation";
import { LGIcon } from "@/common/ui/icon/liquid-glass";
import { ThemeToggleContainer } from "@/common/ui/mobile-nav-toogle-theme";
import { cn } from "@/utils";
import { CLIENT_ENV } from "@/utils/environment/client";
import {
    motion,
    AnimatePresence,
} from "motion/react";

type ThemeToggleButtonProps = {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    mounted: boolean;
};

function ThemeToggleButton({ theme, setTheme, mounted }: ThemeToggleButtonProps) {
    if (!mounted) return <div className="w-10 h-10" />;

    return (
        <button
            onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
            }}
            className="gw-btn-icon gw-btn-icon-sm cursor-pointer relative z-60 pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:dark:bg-black/35 hover:bg-white/35 hover:backdrop-blur-2xl text-neutral-600 dark:text-neutral-300 transition-colors duration-300"
            aria-label="Toggle Dark Mode"
        >
            {theme === "dark" ? "🌙" : "☀️"}
        </button>
    );
}

export default function NavigationBar() {
    const isMaintenance = CLIENT_ENV.maintenanceMode;
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isShrunk, setIsShrunk] = useState(false);
    const router = useRouter();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);


    const { scrollY } = useScroll();
    const lenis = useLenis();

    useMotionValueEvent(scrollY, "change", (current) => {
        if (current > 100) {
            setIsShrunk(true);
        } else {
            setIsShrunk(false);
        }
    });

    const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { name: string; link: string }) => {
        if (item.link.startsWith("#")) {
            e.preventDefault();
            if (item.link === "#home") {
                lenis?.scrollTo(0);
            } else {
                lenis?.scrollTo(item.link);
            }
        } else {
            router.push(item.link);
        }
    };

    if (isMaintenance == "true") return null
    return (
        <div className="pointer-events-none relative z-50">
            <div className="pointer-events-auto">

                <Navbar>
                    {/* --- DESKTOP NAVIGATION --- */}
                    {/* <NavBody isShrunk={isShrunk}>
                        <NavbarLogo theme={theme === "dark" ? "light" : "dark"} />
                        <NavItems isShrunk={isShrunk} items={NAV_ITEMS} onItemClick={handleItemClick} />
                        <div className="flex items-center gap-4 relative z-50 pointer-events-auto">
                            <ThemeToggleButton theme={theme} setTheme={setTheme} mounted={mounted} />
                        </div>
                    </NavBody> */}

                    {/* --- MOBILE NAVIGATION --- */}
                    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />
                    <MobileNav
                    >
                        <motion.div
                            drag
                            style={{ x, y }}
                            onDragStart={() => { isDragging.current = true; }}
                            dragMomentum={false}
                            dragElastic={0.1}
                            dragConstraints={constraintsRef}
                            onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 100); }}
      className={cn(
        "relative flex items-center overflow-visible px-2 py-2",
        isMobileMenuOpen ? "rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.25)] w-64 justify-end" : ""
      )}
                            whileDrag={{ scale: 1.05 }}
                        >
                            {/* Menu muncul absolute, sejajar toggle */}
                            <MobileNavMenu
                                isOpen={isMobileMenuOpen}
                                onClose={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="flex flex-row gap-3 items-center justify-end">
                                    {NAV_ITEMS.map((item, index) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.link;
                                        return (
                                            <motion.div
                                                key={item.name}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{
                                                    duration: 0.25,
                                                    delay: index * 0.05, // stagger per icon
                                                    ease: "easeOut",
                                                }}
                                            >
                                                <LGIcon
                                                    className={cn(
                                                        "transition-colors duration-500",
                                                        item.mobile_hover_background_color,
                                                        item.mobile_hover_border_color,
                                                        isActive && item.mobile_background_color_active,
                                                        isActive && item.mobile_border_color_active,
                                                        isActive && "shadow-none! border-none!",
                                                    )}
                                                    href={item.link}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            "text-white",
                                                            isActive && "text-white! transition-colors duration-300",
                                                        )}
                                                        size={20}
                                                    />
                                                </LGIcon>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </MobileNavMenu>
                                                                {/* Toggle selalu di kanan, z lebih tinggi */}
                            <MobileNavHeader className="relative z-50">
                                <MobileNavToggle
                                    isOpen={isMobileMenuOpen}
                                    onClick={() => {
                                        if (!isDragging.current) setIsMobileMenuOpen(!isMobileMenuOpen);
                                    }}
                                />
                            </MobileNavHeader>
                        </motion.div>
                    </MobileNav>
                    {/* <MobileNav isShrunk={isShrunk}>
                        <MobileNavHeader>
                            <NavbarLogo theme={theme === "dark" ? "light" : "dark"} />
                            <MobileNavToggle
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        </MobileNavHeader>
                        <MobileNavMenu
                            isOpen={isMobileMenuOpen}
                            onClose={() => setIsMobileMenuOpen(false)}
                        >
                            <ThemeToggleContainer
                                theme={theme}
                                setTheme={setTheme}
                                mounted={mounted}
                            />
                            <div className="w-full flex flex-row gap-4">
                                {NAV_ITEMS.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathname === item.link
                                    return (
                                        <LGIcon
                                            className={cn(
                                                "transition-colors duration-500",
                                                isActive && item.mobile_background_color_active,
                                                isActive && item.mobile_border_color_active,
                                                isActive && "shadow-none! border-none!",
                                            )}
                                            key={item.name}
                                            href={item.link}
                                        >
                                            <Icon
                                                className={cn(
                                                    isActive && "text-white! transition-colors duration-300",
                                                    "text-neutral-800 dark:text-white"
                                                )}
                                                size={30}
                                            />
                                        </LGIcon>
                                    );
                                })}
                            </div>
                        </MobileNavMenu>
                    </MobileNav> */}
                </Navbar>
            </div>
        </div>
    );
}