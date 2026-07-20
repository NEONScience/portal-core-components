/* eslint-disable no-underscore-dangle */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevEnv = (process.env.NODE_ENV === 'development');
const isLibTarget = (process.env.PORTAL_CORE_COMPONENTS_TARGET === 'lib');
const isBuildContainer = (process.env.PORTAL_CORE_COMPONENTS_BUILD_CONTAINER === 'true');

const allowedDevOrigins = ['localhost'];
if (process.env.NEXT_PUBLIC_NEON_ALLOWED_DEV_ORIGIN) {
  allowedDevOrigins.push(process.env.NEXT_PUBLIC_NEON_ALLOWED_DEV_ORIGIN);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isDevEnv ? undefined : 'export',
  distDir: 'build',
  basePath: '/core-components',
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
  allowedDevOrigins,
};

export default nextConfig;
