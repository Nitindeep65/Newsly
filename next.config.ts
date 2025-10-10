import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Essential development hosts
      { protocol: 'https', hostname: 'via.placeholder.com', port: '', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/api/image-proxy/**' },

      // Curated major news domains
      { protocol: 'https', hostname: '*.reuters.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.cnn.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'ichef.bbci.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.yahoo.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.theguardian.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i.guim.co.uk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.wsj.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.nytimes.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.washingtonpost.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.abcnews.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.apnews.com', port: '', pathname: '/**' },

      // Common CDN/image hosts
      { protocol: 'https', hostname: '*.amazonaws.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.cloudfront.net', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.googleusercontent.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.wp.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.brightspotcdn.com', port: '', pathname: '/**' },

      // Minimal generic patterns
      { protocol: 'https', hostname: 'images.*', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'static.*', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.*', port: '', pathname: '/**' },
    ],
  },
}

export default nextConfig
