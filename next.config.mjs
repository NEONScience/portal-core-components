const isLibTarget = (process.env.PORTAL_CORE_COMPONENTS_TARGET === 'lib');

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
  typescript: {
    tsconfigPath: isLibTarget ? './tsconfig.lib.json' : './tsconfig.json',
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
