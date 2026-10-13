import type { MetadataRoute } from 'next';
import { STORE_URL } from '@/data/store';

const BASE = STORE_URL.replace(/\/+$/, '');

/** Generated once at build time — works on Vercel and in static export mode. */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
