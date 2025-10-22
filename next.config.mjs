const isProd = process.env.NODE_ENV === 'production';
const repo = 'elpriorat-web';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',                 // fa `next export`
  images: { unoptimized: true },    // requerit a GitHub Pages
  basePath: isProd ? `/${repo}` : '',// necessari en Project Pages
  assetPrefix: isProd ? `/${repo}/` : '',
  trailingSlash: true               // ajuda amb rutes estàtiques
};

export default nextConfig;

