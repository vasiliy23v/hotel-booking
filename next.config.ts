import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Убеждаемся, что кастомный Prisma Client правильно разрешается
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
  // Включаем lib/generated в сборку
  transpilePackages: [],
};

export default nextConfig;
