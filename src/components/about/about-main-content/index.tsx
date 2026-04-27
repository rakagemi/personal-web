"use client";

import dynamic from 'next/dynamic';

const PanelPortfolioSection = dynamic(() => import('@/common/ui/about/portfolio-panel'), {
  ssr: false
})

export default function AboutMainContent() {
  return (
    <div id="about">
      <PanelPortfolioSection />
    </div>
  );
}