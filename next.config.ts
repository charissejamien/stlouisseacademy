import type { NextConfig } from "next";

const nextConfig: NextConfig = {
experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set this to 10MB to accommodate multiple photos
    },
  },
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rqapzgnczwrzszbmevsg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
