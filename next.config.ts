import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid dev CORS warnings when accessing Next dev server via localhost tooling.
  allowedDevOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.reffortune.com",
      },
    ],
  },
};

export default nextConfig;
