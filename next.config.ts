import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [process.env.MOBILE_DEV_IP ?? ""],
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pancidiuw.vercel.app",
        port: "",
        pathname: "/logo-meta.png",
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: "https",
        hostname: "assets.codepen.io",
      },
    ],
  },
};

export default nextConfig;
