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
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: true,
});


export const metadata = siteMetadata;

const Head = () => {
  return (
    <head></head>
  )
}

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Analytics />
      <ThemeProvider enableSystem attribute="class" defaultTheme="dark">
        <Toaster />
        <NavigationBar />
        <SmoothScrollProvider>
          <TooltipProvider>
            {children}
            <GoogleAnalytics gaId={CLIENT_ENV.googleAnalyticsID || ""} />
            <GoogleTagManager gtmId={CLIENT_ENV.googleTagManagerID || ""} />
          </TooltipProvider>
        </SmoothScrollProvider>
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
