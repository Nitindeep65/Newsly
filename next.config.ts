import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow all external images (unoptimized mode handles this)
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
}

export default nextConfig
