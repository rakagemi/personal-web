'use client'

import { ContactFormContent } from "@/common/ui/contact/contact-form-content";
import dynamic from "next/dynamic";

const BackgroundSection = dynamic(() => import('@/common/ui/background'), {
  ssr: false
})

const ContactAnimatedContent = dynamic(() => import('@/components/animated-content'), {
  ssr: false
})

const ContactInfoContentSection = dynamic(() => import('@/common/ui/contact/contact-info-content'), {
  ssr: false
})

const FooterSection = dynamic(() => import('@/common/ui/footer'), {
  ssr: false,
});

export default function ContactMainContent({ }) {
    return (
        <div className="min-h-screen h-full relative mx-auto bg-neutral-950 transition-colors duration-300 flex flex-col selection:bg-blue-500/30">
            <BackgroundSection
                backgroundImageBlur={true}
                opacity={"100"}
                animationMode="always"
            />
            <div className="fixed inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-900/20 via-neutral-950 to-neutral-950 pointer-events-none z-0 transition-colors duration-300" />
            <main className="grow container mx-auto px-4 md:px-6 pt-20 pb-40 relative z-10 flex items-center justify-center" id="contact-me">
                <ContactAnimatedContent
                    distance={40}
                    direction="vertical"
                    duration={0.8}
                    delay={0.3}
                    className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-12 pointer-events-auto"
                >
                    <ContactInfoContentSection />
                    <ContactFormContent />
                </ContactAnimatedContent>
            </main>
            <FooterSection />
        </div>
    )
}