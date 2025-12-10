import type { NextConfig } from 'next'
import withSerwist from '@serwist/next'

// 1. Serwist configuration
const serwistOptions = {
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: false,
  scope: '/',
  registration: {
    strategy: 'registerWhenReady',  // ← THIS IS THE FIX
  },
  // disable: process.env.NODE_ENV === 'development',
}

// 2. Get the Serwist wrapper function
const serwistWrapper = withSerwist(serwistOptions)

// 3. Your Next.js configuration
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

// 4. Apply the wrapper to your config
export default serwistWrapper(nextConfig)