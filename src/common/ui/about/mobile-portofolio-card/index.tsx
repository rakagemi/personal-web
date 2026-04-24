"use client";

import Link from "next/link";
import type { PortfolioCompany } from "@/common/type/portofolio-companny";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { getFallbackImage } from "@/utils";
import { IOSIcon } from "../../icon/ios";

export function MobilePortfolioCard({
  company,
}: {
  company: PortfolioCompany;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const imageSrc =
    (isDark ? company.image_dark_url : company.image_url)?.trim() ||
    getFallbackImage;

  return (
    <Link
      href={`/about/${company.slug}` || "#"}
      className="flex flex-col items-center gap-3"
      aria-label={company.name}
    >
      <IOSIcon
        src={imageSrc}
        alt={company.name}
        // bgClassName="bg-neutral-100 dark:bg-white/5"
        sizeClassName="size-[72px]"
      />

      <p className="max-w-22 truncate text-center text-xs font-medium text-neutral-700 dark:text-neutral-200">
        {company.name}
      </p>
    </Link>
  );
}