import AboutMainContent from "@/components/about/about-main-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Raka Gemi Ibrahim",
  description: "Portfolio website of Raka Gemi Ibrahim , a passionate Frontend Developer specializing in React and Next.js.",
  keywords: ["Raka Gemi Ibrahim", "Frontend Developer", "Next.js", "React", "IBM Indonesia"],
};

export default function AboutPage() {
  return <AboutMainContent />;
}