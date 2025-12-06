/** @type {import('next').NextConfig} */
const nextConfig = {
  // IMPORTANT: Remove output: 'export' for Firebase
  // Firebase can serve dynamic Next.js apps
  // output: 'export', // ← REMOVE or COMMENT THIS LINE
  
  // Keep images unoptimized for Firebase
  images: { unoptimized: true },
  
  // Disable trailing slash for Firebase
  trailingSlash: false,
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    
    config.externals = [...(config.externals || []), 
      '@aws-sdk/client-bedrock-runtime'
    ];
    
    return config;
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);