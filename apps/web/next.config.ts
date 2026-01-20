import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Auth Avatars
      },
      {
        protocol: 'https',
        hostname: 'mnkweisggxelscoqvwnd.supabase.co', // Supabase Storage
      },
    ],
  },
};

export default nextConfig;
