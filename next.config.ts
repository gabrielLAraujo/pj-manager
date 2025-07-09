import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignorar warnings durante o build
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Ignorar erros de TypeScript durante o build em produção
    ignoreBuildErrors: false,
  },
  experimental: {
    // Configurações experimentais se necessário
  },
};

export default nextConfig;
