import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la construcción
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript durante la construcción
  },
};

export default nextConfig;
