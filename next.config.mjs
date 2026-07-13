/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i9.ytimg.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "mir-s3-cdn-cf.behance.net" },
      { protocol: "https", hostname: "*.behance.net" },
      { protocol: "https", hostname: "*.convex.cloud" },
      { protocol: "https", hostname: "*.convex.site" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
};

export default nextConfig;
