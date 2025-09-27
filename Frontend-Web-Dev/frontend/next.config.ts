import type { NextConfig } from "next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
     unoptimized: true,
    // formats: ["image/webp"],
    // remotePatterns: [
    //   {
    //     protocol: "**",
    //     hostname: "**",
    //     port: "**",
    //     pathname: "/**",
    //   },
    // ],
    domains: ["s3.cloudfly.vn", "files.vnews247.com", "chatwithai.id.vn"],
  },
};

export default nextConfig;
