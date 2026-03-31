/* eslint-disable no-underscore-dangle */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isLibTarget = (process.env.PORTAL_CORE_COMPONENTS_TARGET === 'lib');
const isBuildContainer = (process.env.PORTAL_CORE_COMPONENTS_BUILD_CONTAINER === 'true');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: '/core-components-next',
  reactStrictMode: false,
  trailingSlash: false,
  compiler: {
    emotion: true,
  },
  typescript: {
    tsconfigPath: isLibTarget ? './tsconfig.lib.json' : './tsconfig.json',
  },
  turbopack: {
    root: isBuildContainer ? path.join(__dirname, '..', '..') : undefined,
  },
};

export default nextConfig;
