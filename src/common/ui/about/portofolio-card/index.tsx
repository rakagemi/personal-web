"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PortfolioCompany } from "@/common/type/portofolio-companny";
import Image from "next/image";
import React, { useState } from "react";
import { getFallbackImage } from "@/utils";

export function PortfolioCard({ company }: { company: PortfolioCompany }) {
  const [pressed, setPressed] = useState(false);

  React.useEffect(() => {
    if (!pressed) return;

    const timeout = window.setTimeout(() => {
      setPressed(false);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [pressed]);

  const getCompanyImage = company.image_dark_url || getFallbackImage;

  return (
    <>
      <motion.article
        onTapStart={() => setPressed(true)}
        whileTap={{
          scale: 0.94,
          y: 1.5,
        }}
        animate={{
          scale: pressed ? 0.97 : 1,
          y: pressed ? 1 : 0,
          filter: pressed
            ? "saturate(0.98) brightness(0.985)"
            : "saturate(1) brightness(1)",
        }}
        whileHover={{
          y: -2,
          scale: 1.025,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
          type: "spring",
          stiffness: 420,
          damping: 26,
          mass: 0.7,
        }}
        className="gw-card group h-full overflow-hidden border border-white/10"
      >
        <Link
          href={`/about/${company.slug}`}
          className="block h-full"
          aria-label={`Buka portfolio ${company.name}`}
        >
          <div className="flex h-full flex-col sm:p-2">
            <header className="mb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="relative flex flex-row items-center gap-2 mb-4">
                    <div className="relative z-20 h-10 w-10 overflow-hidden rounded-xl shadow-lg border-white/10 bg-white/5 p-2 backdrop-blur-md">
                      <Image
                        src={getCompanyImage}
                        alt="Company Logo"
                        fill
                        sizes="100svh"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="block text-sm sm:text-xl font-semibold tracking-tight text-white md:text-2xl">
                      {company.name}
                    </h3>
                  </div>

                  <p className="mt-2 hidden text-sm text-white/55 md:block">
                    {company.role} · {company.period}
                  </p>
                </div>

                <span className="contact-badge gw-btn mb-4 inline-table sm:inline-flex items-start sm:items-center rounded-full border border-blue-500/30 bg-white-500/10 sm:px-3 py-1 text-[11px] sm:text-sm font-medium text-blue-200 backdrop-blur-xl transition-colors">
                  Open
                </span>
              </div>

              <p className="mt-1 hidden max-w-xl text-sm leading-6 text-white/70 md:block line-clamp-3">
                {company.summary}
              </p>
            </header>

            <section aria-label={`Preview asset ${company.name}`} className="mt-auto">
              <div className="grid grid-cols-3 gap-3">
                {company.assets.slice(0, 3).map((asset) => {
                  const getAssetImage = asset.src?.trim() || getFallbackImage;

                  return (
                    <figure
                      key={asset.id}
                      className="aspect-4/3 overflow-hidden rounded-lg bg-white/5"
                    >
                      <Image
                        loading="eager"
                        src={getAssetImage}
                        alt={asset.alt}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </figure>
                  );
                })}
              </div>
            </section>
          </div>
        </Link>
      </motion.article>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={{
          opacity: pressed ? 0.12 : 0,
        }}
        transition={{
          duration: 0.18,
          ease: "easeOut",
        }}
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
        }}
      />
    </>
  );
}