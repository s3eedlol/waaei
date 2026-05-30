import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/مقالات", destination: "/articles" },
      { source: "/مقالات/:path*", destination: "/articles/:path*" },
    ];
  },
};

export default nextConfig;
