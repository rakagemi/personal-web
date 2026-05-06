
import { CLIENT_ENV } from "@/utils/environment/client";
import type { Metadata } from "next";

export const siteMetadata: Metadata = {
    title: {
        default: "pancidiuw",
        template: "%s  ", // Jika nanti ada halaman /blog, judulnya otomatis "Blog | Raka Gemi Ibrahim "
    },
    description: "Portfolio website of Raka Gemi Ibrahim , a passionate Frontend Developer specializing in React and Next.js.",
    applicationName: "Raka Gemi Ibrahim  Portfolio",
    authors: [{ name: "Raka Gemi Ibrahim ", url: "https://github.com/rakagemi" }],
    creator: "Raka Gemi Ibrahim ",
    icons: {
        icon: [
            { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: { url: '/assets/favicon/apple-icon.png', sizes: '180x180' },
    },
    manifest: '/site.webmanifest',
    openGraph: {
        type: "website",
        locale: "en_US",
        url: `${CLIENT_ENV.url}`,
        siteName: "Raka Gemi Ibrahim Portfolio",
        images: [{
            url: `${CLIENT_ENV.url}/1420fdb2c1b84a55bc9a61e3050b0fa5.jpg`,
            width: 1200,
            height: 630,
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "pancidiuw",
        description: "Guess What?",
        images: `${CLIENT_ENV.url}/1420fdb2c1b84a55bc9a61e3050b0fa5.jpg`,
        creator: "@pancidiw",
    },
    alternates: {
        canonical: `${CLIENT_ENV.url}`,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
        },
    },
    verification: {
        google: "jqwlfuC07KS7di6uEx61eazbmK2cMHOIXe0mBl8MKR4",
    },
};