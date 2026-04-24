
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
    verification: {
        google: "jqwlfuC07KS7di6uEx61eazbmK2cMHOIXe0mBl8MKR4",
    },
};