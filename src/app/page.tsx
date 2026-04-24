import HomeMainContent from "@/common/ui/home/home-main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Raka Gemi Ibrahim",
  description: "Welcome to my portfolio website! I'm Raka Gemi Ibrahim",
  keywords: ["Raka Gemi Ibrahim", "Frontend Developer", "Next.js", "React", "IBM Indonesia"],
};

export default function Home() {
  return <HomeMainContent />;
}
