import { notFound } from "next/navigation";
import { portfolioCompanies } from "@/common/json/portofolio";
import { Metadata } from "next";
import { PortofolioMainContent } from "@/components/about/portofolio-main-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = portfolioCompanies.find((item) => item.slug === slug);

  if (!company) {
    return {
      title: "Portofolio - Not Found",
      description: "Company portfolio not found.",
    };
  }

  return {
    title: `Portofolio - ${company.name}`,
    icons: {
        icon: '/favicon.svg',
    },
    description:
      "Portfolio website of Raka Gemi Ibrahim, a passionate Frontend Developer specializing in React and Next.js.",
    keywords: [
      "Raka Gemi Ibrahim",
      "Frontend Developer",
      "Next.js",
      "React",
      "IBM Indonesia",
    ],
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const company = portfolioCompanies.find((item) => item.slug === slug);
  if (!company) return notFound();

  return <PortofolioMainContent company={company} />;
}