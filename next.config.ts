import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Enable static generation optimizations
  output: 'standalone',
  
  // Enable React strict mode for better performance
  reactStrictMode: true,
  
  // Allow ESLint warnings during build (don't fail on warnings)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'olrieidgokcnhhymksnf.supabase.co' },
      { protocol: 'https', hostname: 'media-cdn.tripadvisor.com' },
      { protocol: 'https', hostname: 'dynamic-media-cdn.tripadvisor.com' },
     
      // Activity image domains
      { protocol: 'https', hostname: 'cdn.getyourguide.com' },
      { protocol: 'https', hostname: 'img.getyourguide.com' },
      { protocol: 'https', hostname: 'media.getyourguide.com' },
      { protocol: 'https', hostname: 'static.getyourguide.com' },
      { protocol: 'https', hostname: 'cdn.viator.com' },
      { protocol: 'https', hostname: 'media.viator.com' },
      { protocol: 'https', hostname: 'images.viator.com' },
      { protocol: 'https', hostname: 'cdn.tiqets.com' },
      { protocol: 'https', hostname: 'images.tiqets.com' },
      { protocol: 'https', hostname: 'media.tiqets.com' },
      // Additional CDN domains that might be used
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
  },

  // Turbopack configuration
  turbopack: {
    root: process.cwd(),
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports for better tree shaking
    optimizePackageImports: [
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-slot',
      'lucide-react',
    ],
  },

  // Turbopack optimizations (replaces webpack)
  // Turbopack handles bundling, tree shaking, and code splitting automatically

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/lovable-uploads/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
