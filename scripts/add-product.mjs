#!/usr/bin/env node
/** Interactive product creator used by add-product.bat on Windows. */
import { readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const customPath = path.join(root, 'src', 'data', 'custom-products.json');
const productsSourcePath = path.join(root, 'src', 'data', 'products.ts');
const rl = createInterface({ input, output });

const ask = async (label, fallback = '') => {
  const suffix = fallback ? ` [${fallback}]` : '';
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || fallback;
};

function makeSlug(name) {
  return name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'new-product';
}

function readPrice(raw) {
  if (!raw.trim()) return undefined;
  const value = Number(raw.trim().replace(/,/g, ''));
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

async function main() {
  console.log('\n=====================================================');
  console.log(' ABNORMAL · Add a product to the catalog');
  console.log('=====================================================\n');
  console.log('1) Choose a category: PC, Android, or iOS.');
  console.log('2) Give the product a clear name; the URL slug is generated automatically.');
  console.log('3) Add at least one duration and its real price(s).');
  console.log('\nExample product sections (edit the examples to fit your actual offer):');
  console.log('  PC:      "Windows PC build with 1 Day and 1 Month access."');
  console.log('  Android: "Android non-root build with 1 Day, 7 Days, or 30 Days access."');
  console.log('  iOS:     "iPhone and iPad build with 1 Day or 1 Month access."');
  console.log('Durations can be custom: 1 Hour, 6 Hours, 1 Day, 7 Days, 1 Month, Lifetime.');
  console.log('Enter only prices you actually charge; leave USD or BDT blank if not offered.\n');

  const rawPlatform = (await ask('Category (PC / Android / iOS)')).toLowerCase();
  const categoryMap = { pc: ['pc', 'Windows PC'], windows: ['pc', 'Windows PC'], android: ['android', 'Android'], ios: ['ios', 'iPhone & iPad'], 'i phone': ['ios', 'iPhone & iPad'], iphone: ['ios', 'iPhone & iPad'] };
  const category = categoryMap[rawPlatform];
  if (!category) throw new Error('Category must be PC, Android, or iOS.');
  const [platform, defaultCompatibility] = category;

  const name = await ask('Product name');
  if (!name) throw new Error('Product name cannot be empty.');
  let slug = makeSlug(name);

  const [customProducts, source] = await Promise.all([
    readFile(customPath, 'utf8').then((text) => JSON.parse(text)),
    readFile(productsSourcePath, 'utf8'),
  ]);
  const existingSlugs = new Set([
    ...customProducts.map((product) => product.slug),
    ...[...source.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]),
  ]);
  if (existingSlugs.has(slug)) {
    const base = slug;
    let suffix = 2;
    while (existingSlugs.has(`${base}-${suffix}`)) suffix += 1;
    slug = `${base}-${suffix}`;
    console.log(`This name already exists. Using the unique URL slug: ${slug}`);
  }

  const sampleSummary = platform === 'pc'
    ? 'Windows PC build with 1 Day and 1 Month access.'
    : platform === 'android'
      ? 'Android non-root build with 1 Day, 7 Days, or 30 Days access.'
      : 'iPhone and iPad build with 1 Day or 1 Month access.';
  const summary = await ask('Short product description', sampleSummary);
  const compatibility = await ask('Compatibility', defaultCompatibility);
  const detailsRaw = await ask('Extra details, comma-separated (optional)');
  const tagsRaw = await ask('Tags, comma-separated (optional, e.g. Premium, Non-Root)');
  const featured = (await ask('Show on homepage featured shelf? (y/n)', 'n')).toLowerCase().startsWith('y');

  const prices = [];
  while (true) {
    const duration = await ask(`Duration ${prices.length + 1} (blank to finish; example: 7 Days)`);
    if (!duration) break;
    const usdRaw = await ask(`USD price for ${duration} (leave blank if not offered)`);
    const bdtRaw = await ask(`BDT price for ${duration} (leave blank if not offered)`);
    const usd = readPrice(usdRaw);
    const bdt = readPrice(bdtRaw);
    if (usd === null || bdt === null) {
      console.log('Price must be a number greater than or equal to zero. Please enter this duration again.');
      continue;
    }
    if (usd === undefined && bdt === undefined) {
      console.log('Add a USD price, a BDT price, or both; a duration with no price was skipped.');
      continue;
    }
    prices.push({ duration, ...(usd === undefined ? {} : { usd }), ...(bdt === undefined ? {} : { bdt }) });
  }

  if (prices.length === 0) throw new Error('Add at least one duration with at least one real price.');

  const product = {
    slug,
    name,
    platform,
    summary,
    compatibility,
    prices,
    ...(detailsRaw ? { details: detailsRaw.split(',').map((item) => item.trim()).filter(Boolean) } : {}),
    ...(featured ? { featured: true } : {}),
    ...(tagsRaw ? { tags: tagsRaw.split(',').map((item) => item.trim()).filter(Boolean) } : {}),
  };

  customProducts.push(product);
  await writeFile(customPath, `${JSON.stringify(customProducts, null, 2)}\n`, 'utf8');

  console.log('\nSaved successfully to src/data/custom-products.json');
  console.log(`  Category: ${platform.toUpperCase()}`);
  console.log(`  Name:     ${name}`);
  console.log(`  Page:     /products/${slug}`);
  console.log('  Prices:');
  for (const price of prices) {
    const values = [price.usd !== undefined ? `$${price.usd}` : '', price.bdt !== undefined ? `৳${price.bdt}` : ''].filter(Boolean).join(' / ');
    console.log(`    - ${price.duration}: ${values}`);
  }
  console.log('\nRun npm run dev to preview it. Rebuild/redeploy the site to publish it online.');
}

main().catch((error) => {
  console.error(`\nCould not add product: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}).finally(() => rl.close());
