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
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { CLIENT_ENV } from "@/utils/environment/client";

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
      <link rel="icon" href="favicon.png" sizes="any" className="rounded-full" />
      <link
        rel="apple-touch-icon"
        href="/assets/favicon/apple-icon?<generated>"
        type="image/png"
        sizes="sizes=180x180"
      />
      <link rel="icon" type="image/png" sizes="16x16" href="favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="favicon.png" />
      <link rel="manifest" href="site.webmanifest" />
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
            <GoogleTagManager gtmId={CLIENT_ENV.googleTagManagerID || ""} />
            <GoogleAnalytics gaId={CLIENT_ENV.googleAnalyticsID || ""} />
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
