/**
 * Set STATIC_EXPORT=true (via `npm run build:static`) to export the whole site
 * as plain HTML/CSS/JS into the `out/` folder — that is what Cloudflare Pages
 * and other static hosts need. Left unset, the project builds as a normal
 * Next.js app for Vercel.
 */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: isStaticExport ? 'export' : undefined,
  // Local artwork placed in /public/art is optimised automatically by next/image.
  images: {
    // A static host has no image optimiser, so serve the files as they are.
    unoptimized: isStaticExport,
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
