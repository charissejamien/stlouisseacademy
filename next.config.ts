import type { NextConfig } from "next";

const nextConfig: NextConfig = {
experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set this to 10MB to accommodate multiple photos
    },
  },
};

export default nextConfig;
