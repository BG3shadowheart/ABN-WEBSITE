/**
 * Catalog queries, filtering and sorting.
 *
 * Everything here is plain data work — no database, no API, no server state.
 * The same functions run on the server (static pages) and in the browser
 * (the search / filter / sort controls of the catalog explorer).
 */

import {
  PLATFORMS,
  PRODUCTS,
  type Platform,
  type PlatformMeta,
  type Product,
} from '@/data/products';
import { SORT_BDT_PER_USD } from '@/data/store';
import { durationHours } from '@/lib/format';

/* -------------------------------------------------------------------------- */
/* Queries                                                                     */
/* -------------------------------------------------------------------------- */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductsByPlatform(platform: Platform): Product[] {
  return PRODUCTS.filter((product) => product.platform === platform);
}

export function getPlatformMeta(platform: Platform): PlatformMeta {
  const meta = PLATFORMS.find((item) => item.id === platform);
  if (!meta) throw new Error(`Unknown platform: ${platform}`);
  return meta;
}

export function getFeaturedProducts(limit = 6): Product[] {
  const featured = PRODUCTS.filter((product) => product.featured);
  // If the owner has not marked anything as featured, fall back to the first
  // products of each platform so the shelf is never empty.
  if (featured.length > 0) return featured.slice(0, limit);
  return PRODUCTS.slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const samePlatform = getProductsByPlatform(product.platform).filter(
    (candidate) => candidate.slug !== product.slug,
  );

  const sharedTag = samePlatform.filter((candidate) =>
    (candidate.tags ?? []).some((tag) => (product.tags ?? []).includes(tag)),
  );

  const ordered = [...sharedTag, ...samePlatform.filter((item) => !sharedTag.includes(item))];
  return ordered.slice(0, limit);
}

export function getPlatformCounts(): Record<Platform, number> {
  return PLATFORMS.reduce(
    (counts, platform) => {
      counts[platform.id] = getProductsByPlatform(platform.id).length;
      return counts;
    },
    { pc: 0, android: 0, ios: 0 } as Record<Platform, number>,
  );
}

export function getAllSlugs(): string[] {
  return PRODUCTS.map((product) => product.slug);
}

/* -------------------------------------------------------------------------- */
/* Pricing helpers                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The cheapest option of a product, as one entry — so the "from" price shown
 * on a card is always a real pair that belongs to a single duration.
 */
export function getStartingPrice(
  product: Product,
): { duration: string; usd?: number; bdt?: number } | null {
  if (product.prices.length === 0) return null;

  const sorted = [...product.prices].sort(
    (a, b) => comparablePrice(a) - comparablePrice(b),
  );
  const cheapest = sorted[0];

  return { duration: cheapest.duration, usd: cheapest.usd, bdt: cheapest.bdt };
}

/**
 * A single comparable number for sorting a mixed USD / BDT catalog.
 * The conversion rate is only used for ordering — it never changes a
 * displayed price. See SORT_BDT_PER_USD in src/data/store.ts.
 */
export function comparablePrice(price: { usd?: number; bdt?: number }): number {
  if (typeof price.usd === 'number') return price.usd;
  if (typeof price.bdt === 'number') return price.bdt / SORT_BDT_PER_USD;
  return Number.POSITIVE_INFINITY;
}

export function getSortPrice(product: Product): number {
  if (product.prices.length === 0) return Number.POSITIVE_INFINITY;
  return Math.min(...product.prices.map(comparablePrice));
}

export function hasLifetimeOption(product: Product): boolean {
  return product.prices.some((price) => !Number.isFinite(durationHours(price.duration)));
}

/* -------------------------------------------------------------------------- */
/* Filtering + sorting (used by the interactive catalog explorer)              */
/* -------------------------------------------------------------------------- */

export type SortId = 'featured' | 'name' | 'price-asc' | 'price-desc';

export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Featured first' },
  { id: 'name', label: 'Name (A–Z)' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
];

export type DurationFilterId =
  | 'all'
  | 'hourly'
  | 'short'
  | 'weekly'
  | 'monthly'
  | 'long'
  | 'lifetime';

export const DURATION_FILTERS: { id: DurationFilterId; label: string }[] = [
  { id: 'all', label: 'Any duration' },
  { id: 'hourly', label: 'Hourly' },
  { id: 'short', label: 'Up to 3 days' },
  { id: 'weekly', label: 'Up to 7 days' },
  { id: 'monthly', label: 'Up to 30 days' },
  { id: 'long', label: '1 month or longer' },
  { id: 'lifetime', label: 'Lifetime' },
];

function matchesDuration(product: Product, filter: DurationFilterId): boolean {
  if (filter === 'all') return true;

  const hours = product.prices.map((price) => durationHours(price.duration));

  switch (filter) {
    case 'hourly':
      return hours.some((value) => value < 24);
    case 'short':
      return hours.some((value) => value <= 24 * 3);
    case 'weekly':
      return hours.some((value) => value <= 24 * 7);
    case 'monthly':
      return hours.some((value) => value <= 24 * 30);
    case 'long':
      return hours.some((value) => value >= 24 * 30);
    case 'lifetime':
      return hours.some((value) => !Number.isFinite(value));
    default:
      return true;
  }
}

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function matchesQuery(product: Product, query: string): boolean {
  const needle = normalise(query);
  if (!needle) return true;

  const haystack = normalise(
    [product.name, product.slug, product.platform, product.summary, ...(product.tags ?? [])].join(
      ' ',
    ),
  );

  // Every word of the query must appear somewhere in the product text.
  return needle.split(' ').every((word) => haystack.includes(word));
}

export type CatalogFilters = {
  query?: string;
  platform?: Platform | 'all';
  duration?: DurationFilterId;
  sort?: SortId;
};

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const { query = '', platform = 'all', duration = 'all', sort = 'featured' } = filters;

  const filtered = products.filter((product) => {
    if (platform !== 'all' && product.platform !== platform) return false;
    if (!matchesQuery(product, query)) return false;
    if (!matchesDuration(product, duration)) return false;
    return true;
  });

  return sortProducts(filtered, sort);
}

export function sortProducts(products: Product[], sort: SortId): Product[] {
  const list = [...products];

  switch (sort) {
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    case 'price-asc':
      return list.sort((a, b) => getSortPrice(a) - getSortPrice(b));
    case 'price-desc':
      return list.sort((a, b) => getSortPrice(b) - getSortPrice(a));
    case 'featured':
    default:
      return list.sort((a, b) => {
        if (Boolean(b.featured) !== Boolean(a.featured)) return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        return PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b);
      });
  }
}

/* -------------------------------------------------------------------------- */
/* Catalog statistics (derived from the data — never hard-coded)               */
/* -------------------------------------------------------------------------- */

export function getCatalogStats() {
  const durations = new Set<string>();
  let lowestUsd: number | null = null;
  let lowestBdt: number | null = null;

  for (const product of PRODUCTS) {
    for (const price of product.prices) {
      durations.add(price.duration);
      if (typeof price.usd === 'number' && (lowestUsd === null || price.usd < lowestUsd)) {
        lowestUsd = price.usd;
      }
      if (typeof price.bdt === 'number' && (lowestBdt === null || price.bdt < lowestBdt)) {
        lowestBdt = price.bdt;
      }
    }
  }

  return {
    products: PRODUCTS.length,
    platforms: PLATFORMS.length,
    durationLabels: durations.size,
    lowestUsd,
    lowestBdt,
    lifetimeProducts: PRODUCTS.filter(hasLifetimeOption).length,
  };
}

/* -------------------------------------------------------------------------- */
/* Development-time catalog check                                              */
/* -------------------------------------------------------------------------- */

/** Returns a list of problems found in the catalog (empty array = all good). */
export function validateCatalog(): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();

  for (const product of PRODUCTS) {
    if (seen.has(product.slug)) issues.push(`Duplicate slug: "${product.slug}"`);
    seen.add(product.slug);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) {
      issues.push(`Slug should be lowercase-with-dashes: "${product.slug}"`);
    }
    if (product.prices.length === 0) {
      issues.push(`"${product.name}" has no prices.`);
    }
    for (const price of product.prices) {
      if (typeof price.usd !== 'number' && typeof price.bdt !== 'number') {
        issues.push(`"${product.name}" → "${price.duration}" has no price value.`);
      }
    }
  }

  return issues;
}

// Printed once in the terminal while `npm run dev` is running.
if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  const issues = validateCatalog();
  if (issues.length > 0) {
    console.warn('\n[catalog] Please fix these entries in src/data/products.ts:');
    for (const issue of issues) console.warn(`  • ${issue}`);
    console.warn('');
  }
}
