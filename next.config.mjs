const isProduction = (process.env.NODE_ENV === 'production');
const isTest = (process.env.NODE_ENV === 'test');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: '/core-components-next',
  reactStrictMode: false,
  trailingSlash: true,
  experimental: {
    // forceSwcTransforms: !isProduction && !isTest,
  },
};

export default nextConfig;
