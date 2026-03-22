import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Compiler optimizations ────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // strip console.log in prod
  },

  // ── Image optimization ────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ── Aggressive HTTP caching headers ──────────────────────
  async headers() {
    return [
      {
        // Cache all static assets for 1 year
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache public folder assets for 7 days
        source: '/(.*)\\.(ico|png|jpg|jpeg|svg|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ]
  },

  // ── Experimental performance features ────────────────────
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'react-hot-toast',
      'react-countup',
    ],
  },
};

export default nextConfig;