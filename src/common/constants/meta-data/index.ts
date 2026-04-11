import type { Metadata } from "next";

export const siteMetadata: Metadata = {
    title: {
        default: "pancidiuw",
        template: "%s | Raka Gemi Ibrahim ", // Jika nanti ada halaman /blog, judulnya otomatis "Blog | Raka Gemi Ibrahim "
    },
    description: "Portfolio website of Raka Gemi Ibrahim , a passionate Frontend Developer specializing in React and Next.js.",
    applicationName: "Raka Gemi Ibrahim  Portfolio",
    authors: [{ name: "Raka Gemi Ibrahim ", url: "https://github.com/rakagemi" }],
    creator: "Raka Gemi Ibrahim ",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://pancidiuw.vercel.app/",
        siteName: "Raka Gemi Ibrahim Portfolio",
        images: [{
            url: "https://pancidiuw.vercel.app/logo-meta.png",
            width: 1200,
            height: 630,
        }],
    },
    verification: {
        google: "#",
    },
};