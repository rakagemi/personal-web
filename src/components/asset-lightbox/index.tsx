"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Minimize2, Maximize2 } from "lucide-react";
import { useState } from "react";
import type { PortfolioAsset } from "@/common/type/portofolio-asset";

type Props = {
  assets: PortfolioAsset[];
  activeIndex: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function AssetLightbox({
  assets,
  activeIndex,
  onClose,
  onChange,
}: Props) {
  const asset = assets[activeIndex];
  const [scale, setScale] = useState(1);
  const [minimize, setMinimize] = useState(false);

  const prev = () => onChange(activeIndex === 0 ? assets.length - 1 : activeIndex - 1);
  const next = () => onChange(activeIndex === assets.length - 1 ? 0 : activeIndex + 1);

  return (
    <aside
      aria-label="Preview asset"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative h-full w-full"
      >
        <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4">
          <p className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
            {activeIndex + 1} / {assets.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimize((prev) => !prev)}
              className="rounded-full cursor-pointer border transition border-white/10 bg-black/50 hover:bg-black/75 backdrop-blur-lg p-3 text-white"
              aria-label={minimize ? "Maximize footer" : "Minimize footer"}
            >
              {minimize ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button
              onClick={() => setScale((s) => Math.max(1, s - 0.25))}
              className="rounded-full border cursor-pointer transition border-white/10 bg-black/50 hover:bg-black/75 backdrop-blur-lg p-3 text-white"
              aria-label="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={() => setScale((s) => Math.min(3, s + 0.25))}
              className="rounded-full border cursor-pointer transition border-white/10 bg-black/50 hover:bg-black/75 backdrop-blur-lg p-3 text-white"
              aria-label="Zoom in"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={onClose}
              className="rounded-full border cursor-pointer transition border-white/10 bg-black/50 hover:bg-black/75 backdrop-blur-lg p-3 text-white"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="flex h-full items-center justify-center overflow-hidden">
          <motion.img
            key={asset.id}
            src={asset.src}
            alt={asset.alt}
            drag={scale > 1}
            dragConstraints={{ top: -300, bottom: 300, left: -400, right: 400 }}
            animate={{ scale }}
            transition={{ duration: 0.25 }}
            className="max-h-[82vh] max-w-[92vw] cursor-grab object-contain active:cursor-grabbing"
          />
        </div>

        <nav
          aria-label="Asset navigation"
          className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3"
        >
          <button
            onClick={prev}
            className="rounded-full cursor-pointer border border-black/10 bg-black/50 hover:bg-black/75 backdrop-blur-lg p-3 text-white"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={next}
            className="rounded-full cursor-pointer border border-black/10 bg-black/50 hover:bg-black/75 backdrop-blur-lg p-3 text-white"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </nav>

        <AnimatePresence initial={false}>
          {!minimize && (
            <motion.footer
              key="asset-footer"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="pointer-events-none absolute bottom-5 left-1/2 z-20 w-full max-w-2xl -translate-x-1/2 px-4"
            >
              <section className="pointer-events-auto rounded-[28px] border border-white/10 dark:border-black/10 bg-white/50 dark:bg-black/50 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition hover:bg-white/75 hover:dark:bg-black/75">
                <h2 className="text-lg font-medium text-black dark:text-white">{asset.title}</h2>
                <p className="mt-2 text-sm leading-6 text-black/75 dark:text-white/75">
                  {asset.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {asset.tags.map((tag: string) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/10 dark:border-black/10 px-3 py-1 text-xs text-blue-600 dark:text-blue-300"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </section>
            </motion.footer>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
}