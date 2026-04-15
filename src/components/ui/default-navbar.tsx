"use client";
import { cn } from "@/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
  isShrunk?: boolean;
  delay?: number;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  isShrunk?: boolean;
  delay?: number;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { name: string; link: string }
  ) => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  isShrunk?: boolean;
  delay?: number;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  delay?: number;
}

export const Navbar = ({
  children,
  className,
  isShrunk,
  delay = 0,
}: NavbarProps) => {
  return (
    <div className={cn("fixed inset-x-0 top-4 z-50 w-full", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ isShrunk?: boolean; delay?: number }>,
              { isShrunk, delay }
            )
          : child
      )}
    </div>
  );
};

export const NavBody = ({
  children,
  className,
  isShrunk,
  delay = 0,
}: NavBodyProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        backdropFilter: isShrunk ? "blur(3px)" : "blur(0px)",
        boxShadow: isShrunk ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
        width: isShrunk ? "62%" : "80%",
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 30,
        delay,
      }}
      className={cn(
        "relative z-60 mx-auto hidden flex-row items-center justify-between self-start rounded-full px-4 py-2 lg:flex border transition-colors duration-300",
        isShrunk ? "border-white/10" : "bg-transparent border-transparent",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium dark:text-white transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          onMouseEnter={() => setHovered(idx)}
          onClick={(e) => onItemClick && onItemClick(e, item)}
          className="relative px-4 py-2 dark:text-white text-neutral-500 hover:text-white cursor-pointer"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered-default"
              className="absolute inset-0 h-full w-full rounded-full bg-blue-500 dark:bg-neutral-800"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </Link>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({
  children,
  className,
  isShrunk,
  delay = 0,
}: MobileNavProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        width: "90%",
        paddingRight: "16px",
        paddingLeft: "16px",
        borderRadius: "2rem",
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 30,
        delay,
      }}
      className={cn(
        "relative z-50 mx-auto flex flex-col items-center justify-between px-0 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.15)] lg:hidden border backdrop-blur-xl! transition-colors duration-300",
        "bg-white/10 border-white/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => {
  return (
    <div className={cn("flex w-full flex-row items-center justify-between", className)}>
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
  delay = 0,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay }}
          className={cn(
            "relative z-50 mx-auto flex flex-col items-center justify-between px-0 py-2 lg:hidden border transition-colors duration-300",
            "bg-transparent border-transparent",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="text-black dark:text-white" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-black dark:text-white" onClick={onClick} />
  );
};

export const NavbarLogo = ({ theme }: { theme: string }) => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <Image
        src={"/favicon.svg"}
        width={30}
        height={30}
        alt="logo"
        draggable={false}
        className="object-contain"
        loading="eager"
      />
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "button",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType<{ children?: React.ReactNode }>;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (React.ComponentPropsWithoutRef<"a"> |
  React.ComponentPropsWithoutRef<"button">)) => {
  const baseStyles =
    "px-4 py-2 rounded-md bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-x-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: "bg-transparent shadow-none dark:text-white",
    dark: "bg-black text-white shadow-xl",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-inner",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};