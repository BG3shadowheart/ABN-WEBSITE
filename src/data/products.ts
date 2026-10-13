/**
 * ============================================================================
 *  PRODUCT CATALOG
 * ============================================================================
 *  Built-in products are maintained below. Use add-product.bat to append custom
 *  products to custom-products.json without editing this TypeScript file.
 *  Product data is public and compiled into the catalog at build time.
 *
 *  ── HOW TO ADD A NEW PRODUCT ────────────────────────────────────────────
 *  1. Run add-product.bat on Windows to add a custom product, or copy an
 *     existing block to maintain one of the built-in platform lists below.
 *  2. Give it a unique `slug` (lowercase words separated by dashes). The slug
 *     becomes the product URL: /products/your-slug
 *  3. Fill in `name`, `summary` and one `prices` entry per duration.
 *  4. Save. Run `npm run dev` (or `npm run build`) — that's it.
 *
 *  ── RULES THAT KEEP THE STORE HONEST ────────────────────────────────────
 *  • Only list prices that were actually given to you. If you do not know a
 *    price, leave the field out (`bdt` may be omitted when only USD exists).
 *  • A product that exists on two platforms is TWO entries — one per platform.
 *  • `summary`, `details` and `tags` are yours to write; keep them accurate.
 * ============================================================================
 */

import customProductsRaw from './custom-products.json';

/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------ */

export type Platform = 'pc' | 'android' | 'ios';

export type PriceOption = {
  /** Exact duration label as displayed, e.g. '1 Day', '10 Days', 'Lifetime'. */
  duration: string;
  /** Price in US dollars. Omit when the product has no USD price. */
  usd?: number;
  /** Price in Bangladeshi Taka. Omit when the product has no BDT price. */
  bdt?: number;
};

export type Product = {
  /** Unique id used in the URL: /products/<slug> */
  slug: string;
  /** Product name exactly as it should be displayed. */
  name: string;
  platform: Platform;
  /** One short line shown on the product card. */
  summary: string;
  /** Optional longer paragraph for the product page. */
  description?: string;
  /** Optional factual bullet points (keep them true — no promises). */
  details?: string[];
  /** What the product runs on. */
  compatibility?: string;
  /** Every available duration and its exact price. */
  prices: PriceOption[];
  /** Show this product on the homepage "Featured" shelf. */
  featured?: boolean;
  /** Small neutral chips, e.g. 'Bundle', 'Hourly', 'Non-Root'. */
  tags?: string[];
  /**
   * Optional real artwork. Drop a file into /public/art and point to it, e.g.
   * image: '/art/br-mods-pc.jpg'  → it is rendered with next/image (optimised,
   * responsive, lazy). When omitted, the store draws original procedural
   * SVG artwork instead, so no product ever looks empty.
   */
  image?: string;
  /** Optional artwork caption / alt text used when `image` is set. */
  imageAlt?: string;
  /** Optional per-product support link. Falls back to the store support links. */
  supportUrl?: string;
};

/* ---------------------------------------------------------------------------
 * 1. PC  — Windows PCs
 * ------------------------------------------------------------------------ */

const PC_PRODUCTS: Product[] = [
  {
    slug: 'br-mods-pc',
    name: 'BR MODS PC',
    platform: 'pc',
    summary: 'Windows PC build with 1 day, 10 day and 1 month access.',
    compatibility: 'Windows PC',
    prices: [
      { duration: '1 Day', usd: 2, bdt: 250 },
      { duration: '10 Days', usd: 3, bdt: 399 },
      { duration: '1 Month', usd: 5, bdt: 600 },
    ],
    featured: true,
    tags: ['PC build'],
  },
  {
    slug: 'fake-lag-pc',
    name: 'FAKE LAG PC',
    platform: 'pc',
    summary: 'Windows PC build with 1 month or lifetime access.',
    compatibility: 'Windows PC',
    prices: [
      { duration: '1 Month', usd: 3, bdt: 350 },
      { duration: 'Lifetime', usd: 10, bdt: 1200 },
    ],
    tags: ['Lifetime available'],
  },
  {
    slug: 'br-fake-lag-pc-bundle',
    name: 'BR + FAKE LAG PC BUNDLE',
    platform: 'pc',
    summary: 'Windows PC bundle: BR MODS PC together with FAKE LAG PC, 1 month access.',
    compatibility: 'Windows PC',
    details: ['Bundle of BR MODS PC and FAKE LAG PC', '1 month access'],
    prices: [{ duration: '1 Month', usd: 5 }],
    tags: ['Bundle'],
  },
  {
    slug: 'abnormal-aimbot-premium-pc',
    name: 'ABNORMAL AIMBOT PREMIUM PC',
    platform: 'pc',
    summary: 'Windows PC premium build with 1 month or lifetime access.',
    compatibility: 'Windows PC',
    prices: [
      { duration: '1 Month', usd: 3, bdt: 350 },
      { duration: 'Lifetime', usd: 10, bdt: 1200 },
    ],
    tags: ['Premium', 'Lifetime available'],
  },
  {
    slug: 'streamer-pc-fully-hidden-phone-control',
    name: 'STREAMER PC — FULLY HIDDEN PHONE CONTROL',
    platform: 'pc',
    summary: 'Windows PC streamer build with hidden phone control, 1 month or lifetime access.',
    compatibility: 'Windows PC',
    details: ['Controlled from your phone', '1 month or lifetime access'],
    prices: [
      { duration: '1 Month', usd: 12, bdt: 1200 },
      { duration: 'Lifetime', usd: 20, bdt: 2000 },
    ],
    featured: true,
    tags: ['Streamer', 'Lifetime available'],
  },
];

/* ---------------------------------------------------------------------------
 * 2. ANDROID
 * ------------------------------------------------------------------------ */

const ANDROID_PRODUCTS: Product[] = [
  {
    slug: 'br-mods-android',
    name: 'BR MODS ANDROID',
    platform: 'android',
    summary: 'Android build with 1 day, 10 day and 1 month access.',
    compatibility: 'Android',
    prices: [
      { duration: '1 Day', usd: 2, bdt: 250 },
      { duration: '10 Days', usd: 3, bdt: 399 },
      { duration: '1 Month', usd: 4, bdt: 520 },
    ],
    featured: true,
    tags: ['Android build'],
  },
  {
    slug: 'drip-apk-mod',
    name: 'DRIP APK MOD',
    platform: 'android',
    summary: 'Android APK mod with 1 day up to 30 day access.',
    compatibility: 'Android',
    prices: [
      { duration: '1 Day', usd: 0.5, bdt: 60 },
      { duration: '3 Days', usd: 1, bdt: 100 },
      { duration: '7 Days', usd: 1.6, bdt: 180 },
      { duration: '15 Days', usd: 3, bdt: 380 },
      { duration: '30 Days', usd: 5, bdt: 650 },
    ],
    featured: true,
    tags: ['APK'],
  },
  {
    slug: 'drip-proxy',
    name: 'DRIP PROXY',
    platform: 'android',
    summary: 'Android proxy tool with 1 day up to 30 day access.',
    compatibility: 'Android',
    prices: [
      { duration: '1 Day', usd: 0.5, bdt: 59 },
      { duration: '3 Days', usd: 0.9, bdt: 100 },
      { duration: '7 Days', usd: 2, bdt: 250 },
      { duration: '30 Days', usd: 3.9, bdt: 490 },
    ],
    tags: ['Proxy'],
  },
  {
    slug: 'prime-apk-mod',
    name: 'PRIME APK MOD',
    platform: 'android',
    summary: 'Android APK mod with 1 day up to 30 day access.',
    compatibility: 'Android',
    prices: [
      { duration: '1 Day', usd: 0.4, bdt: 50 },
      { duration: '3 Days', usd: 1.9, bdt: 236 },
      { duration: '7 Days', usd: 3.8, bdt: 360 },
      { duration: '30 Days', usd: 4, bdt: 490 },
    ],
    tags: ['APK'],
  },
  {
    slug: 'drip-r00t-android',
    name: 'DRIP R00T ANDROID',
    platform: 'android',
    summary: 'Android rooted build with 1 day up to 30 day access.',
    compatibility: 'Rooted Android',
    prices: [
      { duration: '1 Day', usd: 0.5, bdt: 59 },
      { duration: '3 Days', usd: 0.9, bdt: 100 },
      { duration: '7 Days', usd: 2, bdt: 250 },
      { duration: '30 Days', usd: 3.9, bdt: 490 },
    ],
    tags: ['Root'],
  },
  {
    slug: 'aim-hack-non-root-android',
    name: 'AIM HACK — NON ROOT ANDROID',
    platform: 'android',
    summary: 'Android aim hack for non-root devices, 1 day up to 30 day access.',
    compatibility: 'Non-root Android',
    prices: [
      { duration: '1 Day', usd: 1.3, bdt: 150 },
      { duration: '3 Days', usd: 3, bdt: 400 },
      { duration: '15 Days', usd: 4.5, bdt: 530 },
      { duration: '30 Days', usd: 10, bdt: 1300 },
    ],
    tags: ['Non-Root'],
  },
  {
    slug: 'drip-wire-non-root-android',
    name: 'DRIP WIRE — NON ROOT ANDROID',
    platform: 'android',
    summary: 'Android non-root build with 1 day up to 30 day access.',
    compatibility: 'Non-root Android',
    prices: [
      { duration: '1 Day', usd: 1.3, bdt: 150 },
      { duration: '3 Days', usd: 3, bdt: 400 },
      { duration: '15 Days', usd: 4.5, bdt: 530 },
      { duration: '30 Days', usd: 10, bdt: 1300 },
    ],
    tags: ['Non-Root'],
  },
  {
    slug: 'pato-blue-apk-mod',
    name: 'PATO BLUE APK MOD',
    platform: 'android',
    summary: 'Android APK mod (Blue) with 3, 15 and 30 day access.',
    compatibility: 'Android',
    prices: [
      { duration: '3 Days', usd: 1.7, bdt: 200 },
      { duration: '15 Days', usd: 3.7, bdt: 420 },
      { duration: '30 Days', usd: 7.8, bdt: 870 },
    ],
    tags: ['APK', 'PATO'],
  },
  {
    slug: 'pato-orange-apk-mod',
    name: 'PATO ORANGE APK MOD',
    platform: 'android',
    summary: 'Android APK mod (Orange) with 3 and 7 day access.',
    compatibility: 'Android',
    prices: [
      { duration: '3 Days', usd: 3, bdt: 400 },
      { duration: '7 Days', usd: 4.5, bdt: 600 },
    ],
    tags: ['APK', 'PATO'],
  },
  {
    slug: 'pato-green-apk-mod',
    name: 'PATO GREEN APK MOD',
    platform: 'android',
    summary: 'Android APK mod (Green) with 3 day up to 30 day access.',
    compatibility: 'Android',
    prices: [
      { duration: '3 Days', usd: 1, bdt: 260 },
      { duration: '7 Days', usd: 3.6, bdt: 450 },
      { duration: '15 Days', usd: 6.4, bdt: 760 },
      { duration: '30 Days', usd: 11.3, bdt: 1450 },
    ],
    tags: ['APK', 'PATO'],
  },
  {
    slug: 'pato-yellow',
    name: 'PATO YELLOW',
    platform: 'android',
    summary: 'Android build (Yellow) with 3 and 7 day access. Priced in BDT.',
    compatibility: 'Android',
    prices: [
      { duration: '3 Days', bdt: 200 },
      { duration: '7 Days', bdt: 400 },
    ],
    tags: ['PATO', 'BDT pricing'],
  },
  {
    slug: 'silentceats-apk-mod',
    name: 'SILENTCEATS APK MOD',
    platform: 'android',
    summary: 'Android APK mod with 1 day up to 28 day access.',
    compatibility: 'Android',
    prices: [
      { duration: '1 Day', usd: 0.8, bdt: 86 },
      { duration: '7 Days', usd: 2.6, bdt: 300 },
      { duration: '15 Days', usd: 3.3, bdt: 430 },
      { duration: '28 Days', usd: 6, bdt: 700 },
    ],
    tags: ['APK'],
  },
  {
    slug: 'bala-mod-android',
    name: 'BALA MOD ANDROID',
    platform: 'android',
    summary: 'Android mod with hourly access — 1 hour up to 7 days. Priced in BDT.',
    compatibility: 'Android',
    details: ['Hourly plans available', 'Priced in BDT'],
    prices: [
      { duration: '1 Hour', bdt: 21.12 },
      { duration: '3 Hours', bdt: 63.36 },
      { duration: '6 Hours', bdt: 126.72 },
      { duration: '12 Hours', bdt: 253.44 },
      { duration: '1 Day', bdt: 506.88 },
      { duration: '2 Days', bdt: 950.4 },
      { duration: '3 Days', bdt: 1372.8 },
      { duration: '7 Days', bdt: 2956.8 },
    ],
    featured: true,
    tags: ['Hourly', 'BDT pricing'],
  },
  {
    slug: 'rocket-mod',
    name: 'ROCKET MOD',
    platform: 'android',
    summary: 'Android mod with 1 day up to 30 day access. Priced in BDT.',
    compatibility: 'Android',
    prices: [
      { duration: '1 Day', bdt: 70 },
      { duration: '7 Days', bdt: 300 },
      { duration: '15 Days', bdt: 600 },
      { duration: '30 Days', bdt: 800 },
    ],
    tags: ['BDT pricing'],
  },
];

/* ---------------------------------------------------------------------------
 * 3. iOS  — iPhone & iPad
 * ------------------------------------------------------------------------ */

const IOS_PRODUCTS: Product[] = [
  {
    slug: 'fluorite-ios',
    name: 'FLUORITE iOS',
    platform: 'ios',
    summary: 'iOS build with 1 day, 15 day and 1 month access.',
    compatibility: 'iPhone & iPad',
    prices: [
      { duration: '1 Day', usd: 3, bdt: 400 },
      { duration: '15 Days', usd: 7, bdt: 1000 },
      { duration: '1 Month', usd: 15, bdt: 2000 },
    ],
    featured: true,
    tags: ['iOS build'],
  },
  {
    slug: 'migul-ios',
    name: 'MIGUL iOS',
    platform: 'ios',
    summary: 'iOS build with 1 day, 7 day and 1 month access.',
    compatibility: 'iPhone & iPad',
    prices: [
      { duration: '1 Day', usd: 2.5, bdt: 290 },
      { duration: '7 Days', usd: 6, bdt: 820 },
      { duration: '1 Month', usd: 13, bdt: 1700 },
    ],
    featured: true,
    tags: ['iOS build'],
  },
  {
    slug: 'gbox-esign',
    name: 'GBOX & ESIGN',
    platform: 'ios',
    summary: 'iOS signing tools bundle with 1 year access.',
    compatibility: 'iPhone & iPad',
    prices: [{ duration: '1 Year', usd: 5 }],
    tags: ['Signing tools'],
  },
  {
    slug: 'ios-external',
    name: 'iOS EXTERNAL',
    platform: 'ios',
    summary: 'External iOS build with 1 day, 7 day and 1 month access.',
    compatibility: 'iPhone & iPad',
    prices: [
      { duration: '1 Day', usd: 2 },
      { duration: '7 Days', usd: 5 },
      { duration: '1 Month', usd: 8 },
    ],
    tags: ['iOS build'],
  },
  {
    slug: 'aim-hack-non-root-ios',
    name: 'AIM HACK — NON ROOT iOS',
    platform: 'ios',
    summary: 'iOS aim hack for non-root devices, 1 day up to 30 day access.',
    compatibility: 'Non-root iPhone & iPad',
    prices: [
      { duration: '1 Day', usd: 1.3, bdt: 150 },
      { duration: '3 Days', usd: 3, bdt: 400 },
      { duration: '15 Days', usd: 4.5, bdt: 530 },
      { duration: '30 Days', usd: 10, bdt: 1300 },
    ],
    tags: ['Non-Root'],
  },
  {
    slug: 'drip-wire-non-root-ios',
    name: 'DRIP WIRE — NON ROOT iOS',
    platform: 'ios',
    summary: 'iOS non-root build with 1 day up to 30 day access.',
    compatibility: 'Non-root iPhone & iPad',
    prices: [
      { duration: '1 Day', usd: 1.3, bdt: 150 },
      { duration: '3 Days', usd: 3, bdt: 400 },
      { duration: '15 Days', usd: 4.5, bdt: 530 },
      { duration: '30 Days', usd: 10, bdt: 1300 },
    ],
    tags: ['Non-Root'],
  },
];

/* ---------------------------------------------------------------------------
 * The full public catalog
 * ------------------------------------------------------------------------ */

// Products created by add-product.bat are kept in JSON so the helper can
// append entries without rewriting this hand-maintained catalog.
const CUSTOM_PRODUCTS = customProductsRaw as Product[];

export const PRODUCTS: Product[] = [
  ...PC_PRODUCTS,
  ...ANDROID_PRODUCTS,
  ...IOS_PRODUCTS,
  ...CUSTOM_PRODUCTS,
];

/* ---------------------------------------------------------------------------
 * Platform metadata used by the navigation, category sections and filters
 * ------------------------------------------------------------------------ */

export type PlatformMeta = {
  id: Platform;
  label: string;
  kanji: string;
  href: string;
  /** Short line shown on the category card. */
  blurb: string;
  /** Longer paragraph for the platform landing page. */
  intro: string;
  /** Generic requirement line for every product in this category. */
  compatibility: string;
};

export const PLATFORMS: PlatformMeta[] = [
  {
    id: 'pc',
    label: 'PC',
    kanji: 'Windows',
    href: '/pc',
    blurb: 'Built for Windows desktops and laptops.',
    intro:
      'Every build in this section is delivered for Windows PCs. Durations and prices are listed per product — monthly and lifetime options are marked where they exist.',
    compatibility: 'Windows PC',
  },
  {
    id: 'android',
    label: 'Android',
    kanji: 'APK',
    href: '/android',
    blurb: 'Built for Android phones and tablets.',
    intro:
      'Every build in this section is delivered for Android devices. Some entries are APK mods, some are root or non-root builds, and some are priced in BDT only.',
    compatibility: 'Android',
  },
  {
    id: 'ios',
    label: 'iOS',
    kanji: 'iPhone',
    href: '/ios',
    blurb: 'Built for iPhone and iPad.',
    intro:
      'Every build in this section is delivered for iPhone and iPad. Durations run from a single day up to a full year, and every price is listed per product.',
    compatibility: 'iPhone & iPad',
  },
];

export const PLATFORM_LABEL: Record<Platform, string> = {
  pc: 'PC',
  android: 'Android',
  ios: 'iOS',
};
