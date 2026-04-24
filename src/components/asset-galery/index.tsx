"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioCompany } from "@/common/type/portofolio-companny";
import { AssetLightbox } from "../asset-lightbox";
import Image from "next/image";
import { getFallbackImage } from "@/utils";

export function AssetGallery({ company }: { company: PortfolioCompany }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const assets = company.assets || [];
  const handleClose = () => {
    setHoveredIndex(null); // Reset hover
    setActiveIndex(null);
  };

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (activeIndex === null) {
    setHoveredIndex(null);
  }// Lightbox tidak aktif

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          handleClose(); // Tutup lightbox
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev === null ? null : prev === 0 ? assets.length - 1 : prev - 1
          );
          break;
        case 'ArrowRight':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev === null ? null : prev === assets.length - 1 ? 0 : prev + 1
          );
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, assets.length]);

  return (
    <>
      <div className="relative">
      <ul
        onMouseLeave={() => setHoveredIndex(null)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-8"
      >
        {company.assets.map((asset, index) => {
          const isHovered = hoveredIndex === index;
          const hasHover = hoveredIndex !== null;
          const getAssetImage = asset.src?.trim() || getFallbackImage;

          return (
            <li
            key={asset.id}
              className="break-inside-avoid"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <motion.button
                layoutId={`asset-${asset.id}`}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className={`group cursor-zoom-in relative w-full overflow-hidden rounded-3xl
                  bg-white/5 p-5 text-left backdrop-blur-xl
                  shadow-[0_12px_35px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out
                  ${hasHover && !isHovered ? "opacity-45 brightness-60" : "opacity-100"}
                  ${isHovered
                    ? "shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
                    : "hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                  }`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />

                <figure className="relative overflow-hidden rounded-[18px]">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-[18px]">
                    <Image
                      loading="eager"
                      src={getAssetImage}
                      alt={asset.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className={`object-cover transition duration-500 ease-out cursor-zoom-in
                        ${isHovered ? "scale-[1.04]" : "scale-100"}
                      `}
                    />
                    <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
                  </div>
                  <figcaption className="sr-only">{asset.title}</figcaption>
                </figure>
              </motion.button>
            </li>
          );
        })}
      </ul>
      </div>
      <AnimatePresence>
        {activeIndex !== null && (
          <AssetLightbox
            assets={company.assets}
            activeIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
            onChange={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}