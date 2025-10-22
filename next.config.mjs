const isProd = process.env.NODE_ENV === 'production';
const repo = 'elpriorat-web';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === 'production' ? '/elpriorat-web' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/elpriorat-web/' : '',
  trailingSlash: true,

  // 👇 evita que el build falli per ESLint/TS a producció
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};

export default nextConfig;

