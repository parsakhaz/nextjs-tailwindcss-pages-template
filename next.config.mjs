/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Temporarily for development
  },
  // ESLint will be run separately
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
