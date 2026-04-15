'use client';

import * as z from "zod";
import AnimatedContent from "@/components/animated-content";
import Footer from "@/common/ui/footer";
import BackgroundSection from "@/common/ui/background";
import gsap from "gsap";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ENV } from "@/utils/environment";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactFormContent } from "@/components/contact/contact-form-content";
import { ContactInfoContent } from "@/components/contact/contact-info-content";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000, "Message is too long."),
});

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactInfoRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const splitText = (selector: string) => {
        const elements = gsap.utils.toArray<HTMLElement>(selector);

        elements.forEach((el) => {
          const text = el.textContent || "";
          el.setAttribute("data-text", text);

          el.innerHTML = text
            .split("")
            .map((char) =>
              char === " "
                ? `<span class="char inline-block">&nbsp;</span>`
                : `<span class="char inline-block">${char}</span>`
            )
            .join("");
        });
      };

      splitText(".title-line-split");

      gsap.set(".contact-badge", { y: 16, opacity: 0, filter: "blur(8px)" });
      gsap.set(".contact-title", { y: 36, opacity: 0, filter: "blur(12px)" });
      gsap.set(".contact-desc", { y: 24, opacity: 0, filter: "blur(8px)" });
      gsap.set(".contact-item", { y: 28, opacity: 0 });
      gsap.set(".contact-icon", { scale: 0.88, opacity: 0, rotate: -8 });

      gsap.set(".title-line-split .char", {
        opacity: 1,
        y: 0,
        rotate: 0,
        transformOrigin: "50% 70%",
        display: "inline-block",
      });

      gsap.set(".title-line-gradient", {
        opacity: 1,
        y: 0,
        clearProps: "all",
      });

      let idleInterval: number | null = null;
      const chars = gsap.utils.toArray<HTMLElement>(".title-line-split .char");

      const startIdleFx = () => {
        if (idleInterval) window.clearInterval(idleInterval);

        idleInterval = window.setInterval(() => {
          if (!chars.length) return;

          const target = chars[Math.floor(Math.random() * chars.length)];

          gsap.fromTo(
            target,
            { rotate: 0, y: 0 },
            {
              rotate: 360,
              y: -4,
              duration: 0.9,
              ease: "back.out(1.8)",
              yoyo: true,
              repeat: 1,
            }
          );
        }, 2600);
      };

      const stopIdleFx = () => {
        if (idleInterval) {
          window.clearInterval(idleInterval);
          idleInterval = null;
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contactInfoRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
          onEnter: startIdleFx,
          onEnterBack: startIdleFx,
          onLeaveBack: stopIdleFx,
        },
      });

      tl.to(".contact-badge", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power2.out",
      })
        .to(
          ".contact-title",
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .fromTo(
          ".title-line-split .char",
          {
            y: 24,
            opacity: 0,
            rotateX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.025,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .fromTo(
          ".title-line-gradient",
          {
            y: 18,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .to(
          ".contact-desc",
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          ".contact-item",
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .to(
          ".contact-icon",
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: "back.out(1.7)",
          },
          "<"
        );

      return () => {
        stopIdleFx();
      };
    },
    { scope: contactInfoRef }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("access_key", `${ENV.formDataKey}`);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);
      formData.append("subject", `New Message from ${data.name} via Portfolio`);

      const response = await fetch(`${ENV.formDataEndpoint}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent successfully!", {
          description: "Thank you for reaching out. I will get back to you soon.",
          position: "top-center",
          // PERBAIKAN: Toast theme support
          className: "bg-white text-neutral-900 border-neutral-200 dark:bg-neutral-950 dark:text-white dark:border-neutral-800 shadow-lg",
        });
        form.reset();
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("Oops! Something went wrong.", {
        description: "Please try again later or contact me directly via email.",
        position: "top-center",
        className: "bg-white text-neutral-900 border-neutral-200 dark:bg-neutral-950 dark:text-white dark:border-neutral-800 shadow-lg",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen h-full relative bg-white dark:bg-neutral-950 transition-colors duration-300 flex flex-col selection:bg-blue-500/30">
      <BackgroundSection opacity={'30'} animationMode="initial-only" />
      <div className="fixed inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-blue-900/20 dark:via-neutral-950 dark:to-neutral-950 pointer-events-none z-0 transition-colors duration-300" />
      <main className="grow container mx-auto px-4 md:px-6 pt-32 pb-20 relative z-10 flex items-center justify-center" id="contact-me">
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={0.8}
          delay={1}
          className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-12"
        >
          <ContactInfoContent ref={contactInfoRef} />
          <ContactFormContent form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </AnimatedContent>
      </main>
      <Footer />
    </div>
  );
}