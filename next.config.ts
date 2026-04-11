import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["pancidiuw.vercel.app"],
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
    ],
  },
};

export default nextConfig;
