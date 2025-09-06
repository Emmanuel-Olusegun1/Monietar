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

export default nextConfig; // Use ES module export syntax