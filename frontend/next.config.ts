import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Nếu dùng thêm ảnh từ các nguồn khác như google, hãy thêm vào đây
    ],
  },
};

export default nextConfig;
