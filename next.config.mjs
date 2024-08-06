/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: '/core-components',
  reactStrictMode: false,
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
