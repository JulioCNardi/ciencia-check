/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ciencia-check/shared"],
  serverExternalPackages: ["mysql2"],
};

module.exports = nextConfig;
