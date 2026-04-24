
import Maintenance from "@/common/ui/maintenance";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance - Raka Gemi Ibrahim",
  description: "Portfolio website of Raka Gemi Ibrahim , Maintenance System in Progress.",
  keywords: ["Raka Gemi Ibrahim", "Frontend Developer", "Next.js", "React", "IBM Indonesia"],
};

export default function MaintenancePage() {
  return <Maintenance />;
}