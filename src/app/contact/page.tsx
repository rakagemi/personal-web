import ContactMainContent from "@/common/ui/contact/contact-main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Raka Gemi Ibrahim",
  description: "You can reach me here! I'm Raka Gemi Ibrahim",
  keywords: ["Raka Gemi Ibrahim", "Frontend Developer", "Next.js", "React", "IBM Indonesia"],
};

export default function ContactPage() {
  return <ContactMainContent />;
}