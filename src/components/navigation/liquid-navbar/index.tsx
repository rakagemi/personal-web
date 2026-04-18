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

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon} from "lucide-react";
import { NAV_ITEMS } from "@/common/constants/navigation";
import { LGIcon } from "@/common/ui/icon";
import { ThemeToggleContainer } from "@/common/ui/mobile-nav-toogle-theme";
import AnimatedContent from "@/components/animated-content";

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
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isShrunk, setIsShrunk] = useState(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const { scrollY } = useScroll();
    const lenis = useLenis();

    // Mencegah Hydration Error pada icon tema
    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setMounted(true);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, []);

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

    return (
        <div className="pointer-events-none relative z-50">
            <div className="pointer-events-auto">
                <Navbar isShrunk={isShrunk}>
                    {/* --- DESKTOP NAVIGATION --- */}
                    <NavBody isShrunk={isShrunk}>
                        <NavbarLogo theme={theme === "dark" ? "light" : "dark"} />
                        <NavItems items={NAV_ITEMS} onItemClick={handleItemClick} />
                        {/* Tambahkan Theme Toggle di kanan Desktop */}
                        <div className="flex items-center gap-4 relative z-50 pointer-events-auto">
                            <ThemeToggleButton theme={theme} setTheme={setTheme} mounted={mounted} />
                        </div>
                    </NavBody>

                    {/* --- MOBILE NAVIGATION --- */}
                    <MobileNav isShrunk={isShrunk}>
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
                                        <LGIcon className={isActive ? "bg-blue-500! border-blue-500 transition-colors duration-500" : ""} key={item.name} href={item.link}>
                                            <Icon className={isActive ? "text-white! transition-colors duration-300" : ""} size={30} />
                                        </LGIcon>
                                    );
                                })}
                            </div>
                        </MobileNavMenu>
                    </MobileNav>
                </Navbar>
            </div>
        </div>
    );
}