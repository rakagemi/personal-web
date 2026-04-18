import HeroSection from "@/common/ui/home/hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Raka Gemi Ibrahim",
  description: "Welcome to my portfolio website! I'm Raka Gemi Ibrahim",
  keywords: ["Raka Gemi Ibrahim", "Frontend Developer", "Next.js", "React", "IBM Indonesia"],
};

export default function Home() {
  return (
    <div id="home">
        <HeroSection />
      {/* </main> */}
    </div>
  );
}
