/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dzibfknxq/image/upload/**',
      },
    ],
  },
};

module.exports = nextConfig;