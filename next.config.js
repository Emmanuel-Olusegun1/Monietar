/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  outputFileTracingRoot: __dirname,
  
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

module.exports = nextConfig;