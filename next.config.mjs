/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: '/core-components-next',
  reactStrictMode: false,
  trailingSlash: true,
  compiler: {
    emotion: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
