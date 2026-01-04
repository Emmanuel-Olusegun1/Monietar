import type { NextConfig } from 'next'
import createSerwistConfig from '@serwist/next';

// Minimal v9 configuration - using import() instead of await
const serwistPromise = import('@serwist/next').then((module) => {
  return module.default({
    swSrc: 'app/sw.ts',
    swDest: '../public/sw.js',
    disable: process.env.NODE_ENV === 'development',
  });
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  trailingSlash: false,
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      }
    }
    
    config.externals = [...(config.externals || []), 
      '@aws-sdk/client-bedrock-runtime'
    ]
    
    return config
  },
}

// Export a promise for Next.js to handle
export default serwistPromise.then((withSerwist) => withSerwist(nextConfig));