import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

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

// Bind Cloudflare local resources (R2/KV/etc) during `next dev` when available.
// Safe no-op outside the Cloudflare adapter context.
initOpenNextCloudflareForDev();

export default nextConfig;
