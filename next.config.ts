import type { NextConfig } from "next";

const nextConfig: NextConfig = {
experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set this to 10MB to accommodate multiple photos
    },
  },
  allowedDevOrigins: ['trenton-extrapolative-laraine.ngrok-free.dev', 'https://repeal-mutiny-take.ngrok-free.dev'],
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