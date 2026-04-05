/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow all sources for local development
    // In production, lock this down to your CDN domain(s)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Allow unoptimized local images (useful when deploying static builds)
    unoptimized: false,
  },
};

export default nextConfig;
