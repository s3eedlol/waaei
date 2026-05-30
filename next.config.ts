import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA", destination: "/articles" },
      { source: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA/:path*", destination: "/articles/:path*" },
    ];
  },
};

export default nextConfig;
