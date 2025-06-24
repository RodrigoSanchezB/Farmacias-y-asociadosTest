import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 ignora errores de ESLint al compilar
  },
};
