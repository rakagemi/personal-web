import { cn } from "@/utils";
import Link from "next/link";

interface LGIconProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const LGIcon = ({ href, children, className }: LGIconProps) => {
    return (
        <div className="bg-transparent dark:bg-transparent">
        <Link
            href={href}
            className={cn(
                "transition-colors duration-100 cursor-pointer relative z-60 pointer-events-auto flex items-center justify-center w-20 h-20 rounded-full bg-transparent backdrop-blur-sm border border-neutral-300 dark:border-transparent dark:bg-transparent text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-black/10",
                className
            )}
        >
            {children}
        </Link>
        </div>
    );
}