'use client'

import { PortfolioCompany } from "@/common/type/portofolio-companny";
import { AssetGallery } from "@/components/asset-galery";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { getFallbackImage } from "@/utils";
import InfiniteCard from "@/components/infinite-card";
import { RayaTechStack } from "@/common/constants/tech-stack/raya";
import dynamic from "next/dynamic";

const emptySubscribe = () => () => { };

function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
}

const Loading = dynamic(() => import('@/components/loading'), {
  ssr: false
})

const KeyReponsiblityScrollHighLight = dynamic(() => import('@/components/scroll-highlight-text'), {
  ssr: false,
})

const ParticleBackgroundSection = dynamic(() => import('@/common/ui/particle-background'), {
  ssr: false
})

export function PortofolioMainContent({ company }: { company: PortfolioCompany }) {
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();
    const isDark = resolvedTheme === "dark";

    if (!mounted) return <Loading text="Loading..." />;

    const getCompanyImage = (isDark ? company.image_dark_url : company.image_url)?.trim() || getFallbackImage;
    return (
        <div id={`portfolio-${company.name}`}>
            <main className="min-h-screen relative bg-neutral-100 dark:bg-neutral-900">
                <ParticleBackgroundSection />
                <article className="relative mx-auto max-w-7xl pt-10 md:pt-20 px-6 py-20 md:px-10">
                    {/* header card */}
                    <header className="gw-card mb-12 rounded-[32px] border border-black/10 dark:border-white/10 p-6 md:p-10">
                        <nav aria-label="Breadcrumb" className="mb-3 md:mb-6 text-[12px] sm:text-sm text-black/50 dark:text-white/50">
                            <ol className="flex items-center gap-2">
                                <li><Link href="/">Home</Link></li>
                                <li>/</li>
                                <li><Link href="/about">Portfolio</Link></li>
                                <li>/</li>
                                <li aria-current="page">{company.name}</li>
                            </ol>
                        </nav>
                        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
                            <section>
                                {/* <NeonText text={company.role} glowIntensity={15} className="mb-3 text-sm uppercase tracking-[0.2em] text-blue-400" /> */}
                                <p className="mb-3 text-[13px] sm:text-sm uppercase tracking-[0.2em] text-blue-400">
                                    {company.role}
                                </p>
                                <h1 className="text-2xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight md:text-5xl">
                                    {company.name}
                                </h1>
                                <p className="mt-5 max-w-2xl text-sm leading-7 text-black/70 dark:text-white/70 md:text-base">
                                    {company.description}
                                </p>
                            </section>
                            {/* side card */}
                            <aside className="relative gw-badge overflow-hidden h-fit rounded-[24px] border border-black/10 dark:border-white/10 p-5">
                                <div className="absolute right-4 top-4 z-20 h-22 w-22 overflow-hidden rounded-xl shadow-lg border-white/10 bg-white/5 p-2 backdrop-blur-md">
                                    <Image
                                        src={getCompanyImage}
                                        alt="Company Logo"
                                        fill
                                        loading="eager"
                                        priority
                                        sizes="100svh"
                                        className="object-cover"
                                    />
                                </div>

                                <dl className="relative z-10 space-y-4 text-sm pr-14">
                                    <div>
                                        <dt className="text-black/45 dark:text-white/45">Periode</dt>
                                        <dd className="mt-1 text-black dark:text-white">{company.period}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-black/45 dark:text-white/45">Lokasi</dt>
                                        <dd className="mt-1 text-black dark:text-white">{company.location}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-black/45 dark:text-white/45">Assets</dt>
                                        <dd className="mt-1 text-black dark:text-white">{company.assets.length} items</dd>
                                    </div>
                                </dl>
                            </aside>
                        </div>
                    </header>
                    {/* PROJECT OVERVIEW */}
                    <section aria-labelledby="project-overview">
                        <div className="w-full flex flex-row gap-2">
                            {/* <h2 className="text-black dark:text-white text-2xl font-medium">
                                Project Overview
                            </h2> */}
                            {/* <div className="relative h-14 w-14 mb-6">
                                <div className="absolute z-20 h-auto w-20 overflow-hidden rounded-xl shadow-lg border-white/10 bg-white/5 p-2 backdrop-blur-md">
                                    <Image src={"/assets/raya/logo-raya.png"} alt="bank-raya" width={100} height={100} className="object-cover" />
                                </div>
                            </div> */}
                        </div>
                    </section>
                    {/* Key Responsibilities */}
                    <section aria-labelledby="key-responsibilities">
                        <Accordion type="single" collapsible className="w-full mb-4" defaultValue="key-responsibilities">
                            <AccordionItem
                                value="key-responsibilities"
                            >
                                <AccordionTrigger>
                                    Key Responsibilities
                                </AccordionTrigger>

                                <AccordionContent className="pb-5">
                                    {/* <ul className=""> */}
                                    {/* {company.key_responsibilities.map((item, index) => (
                                            <li key={index} className="leading-7 text-sm text-black/70 dark:text-white/70 md:text-base">
                                                {item}
                                            </li>
                                        ))} */}
                                    <KeyReponsiblityScrollHighLight
                                        type="list"
                                        items={company.key_responsibilities}
                                        initialColor={isDark ? 'text-black/70' : '#FFFF'}
                                        finalColor={isDark ? 'text-white/70' : '#0a0a0a'}
                                        className="text-sm md:text-base"
                                        stagger={0.3}
                                    />
                                    {/* </ul> */}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>
                    {/* TECH STACK */}
                    <section aria-labelledby="key-tech-stack">
                        <Accordion type="single" collapsible className="w-full mb-4" defaultValue="key-tech-stack">
                            <AccordionItem
                                value="key-tech-stack"
                            >
                                <AccordionTrigger>
                                    Technology
                                </AccordionTrigger>

                                <AccordionContent className="pb-5">
                                    <InfiniteCard items={RayaTechStack} direction="left" speed={0.09} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>
                    {/* ASSET GALLERY */}
                    <section aria-labelledby="asset-gallery">
                        <div className="flex flex-row gap-2 mb-8">
                            <h2 id="asset-gallery" className="text-black dark:text-white text-2xl font-medium">
                                Library
                            </h2>
                        </div>
                        <AssetGallery company={company} />
                    </section>
                </article>
            </main>
        </div>
    )
}