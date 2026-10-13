import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/catalog';
import { STORE_URL } from '@/data/store';

const BASE = STORE_URL.replace(/\/+$/, '');

/** Generated once at build time — works on Vercel and in static export mode. */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/products`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/pc`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/android`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/ios`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/payments`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/support`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${BASE}/products/${product.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
