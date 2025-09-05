// next.config.ts (Updated)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remove deprecated "domains" configuration
    // domains: ['images.unsplash.com'], // ❌ Deprecated
    
    // Use "remotePatterns" instead ✅
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Add your Cloudflare R2 domain when you set it up
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
      // You can add more patterns as needed
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;