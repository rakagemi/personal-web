import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next"
import { siteMetadata } from "@/common/constants/meta-data";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import NavigationBar from "@/components/navigation/liquid-navbar";
import { LayoutAOD } from "@/components/layout-aod";
import { ENV } from "@/utils/environment";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = siteMetadata;

const Head = () => {
  return (
    <head>
      <link
        rel="apple-touch-icon"
        href="/assets/favicon/apple-icon?<generated>"
        type="image/png"
        sizes="sizes=180x180"
      />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon.svg" />
      <link rel="manifest" href="/assets/favicon/site.webmanifest" />
      <link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#5bbad5" />
    </head>
  )
}

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Analytics />
      <ThemeProvider enableSystem attribute="class" defaultTheme="dark">
        <Toaster />
        <NavigationBar />
        <LayoutAOD>
        <SmoothScrollProvider>
          <TooltipProvider>
            {children}
            <GoogleAnalytics gaId={ENV.googleAnalyticsID} />
          </TooltipProvider>
        </SmoothScrollProvider>
        </LayoutAOD>
      </ThemeProvider>
    </body>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <Head />
      <Body>{children}</Body>
    </html>
  );
}
