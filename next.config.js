// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    images: {
      domains: ['3.112.227.170'], // If you need to load images from your EC2
    },
    // For Windows/WSL development
    webpack: (config) => {
      config.resolve.fallback = { fs: false, net: false, tls: false };
      return config;
    },
  };
  
  module.exports = nextConfig;