/**
 * Downloads one anime picture per theme into public/art/characters/ so the
 * website serves them locally (no live API calls in the browser).
 *
 *   node scripts/fetch-art.mjs          -> only downloads what is missing
 *   node scripts/fetch-art.mjs --force  -> replace everything with new pictures
 *
 * Runs automatically before `dev` and `build`. It never fails the build: if the
 * network is down it just prints a message and the site opens without pictures.
 * Source: nekos.best (free, SFW only). Artist credit is saved in credits.json.
 */
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', 'art', 'characters');
const force = process.argv.includes('--force');

const SLOTS = {
  anemo: ['waifu', 0],
  geo: ['husbando', 0],
  electro: ['kitsune', 0],
  dendro: ['neko', 0],
  hydro: ['waifu', 1],
  pyro: ['husbando', 1],
  cryo: ['kitsune', 1],
};
const EXTS = ['png', 'webp', 'avif', 'jpg', 'jpeg'];

const hasFile = (theme) => EXTS.some((ext) => existsSync(path.join(dir, `${theme}.${ext}`)));
const get = (url, ms) => fetch(url, { signal: AbortSignal.timeout(ms), headers: { 'User-Agent': 'abnormal-store-art-fetch' } });

async function main() {
  await mkdir(dir, { recursive: true });
  const todo = Object.keys(SLOTS).filter((theme) => force || !hasFile(theme));
  if (todo.length === 0) {
    console.log('[art] all character pictures are already saved locally.');
    return;
  }

  let credits = {};
  try {
    credits = JSON.parse(await readFile(path.join(dir, 'credits.json'), 'utf8'));
  } catch {}

  // one request per category
  const need = {};
  for (const theme of todo) {
    const [category, index] = SLOTS[theme];
    need[category] = Math.max(need[category] ?? 0, index + 1);
  }
  const lists = {};
  for (const [category, amount] of Object.entries(need)) {
    try {
      const res = await get(`https://nekos.best/api/v2/${category}?amount=${amount}`, 20000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      lists[category] = (await res.json()).results ?? [];
    } catch (error) {
      console.log(`[art] nekos.best ${category}: ${error.message}`);
    }
  }

  let saved = 0;
  for (const theme of todo) {
    const [category, index] = SLOTS[theme];
    let item = lists[category]?.[index];

    if (!item) {
      // fallback source: waifu.pics (also SFW)
      try {
        const res = await get('https://api.waifu.pics/sfw/waifu', 20000);
        const json = await res.json();
        if (json.url) item = { url: json.url, artist_name: undefined, source_url: undefined };
      } catch {}
    }
    if (!item?.url) {
      console.log(`[art] ${theme}: no picture available (offline?)`);
      continue;
    }

    try {
      const res = await get(item.url, 90000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let ext = (path.extname(new URL(item.url).pathname).slice(1) || 'png').toLowerCase();
      let data = Buffer.from(await res.arrayBuffer());
      try {
        // shrink for fast loading online (sharp ships with Next.js); skipped if unavailable
        const sharp = (await import('sharp')).default;
        data = await sharp(data).resize({ height: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
        ext = 'webp';
      } catch {}
      for (const old of EXTS) {
        const stale = path.join(dir, `${theme}.${old}`);
        if (old !== ext && existsSync(stale)) await unlink(stale);
      }
      await writeFile(path.join(dir, `${theme}.${ext}`), data);
      credits[theme] = { artist: item.artist_name, link: item.source_url ?? item.artist_href };
      saved += 1;
      console.log(`[art] saved ${theme}.${ext}${item.artist_name ? ` (art by ${item.artist_name})` : ''}`);
    } catch (error) {
      console.log(`[art] ${theme}: download failed (${error.message})`);
    }
  }

  await writeFile(path.join(dir, 'credits.json'), JSON.stringify(credits, null, 2));
  console.log(`[art] done — ${saved}/${todo.length} new pictures saved to public/art/characters`);
}

main().catch((error) => console.log('[art] skipped:', error.message)).finally(() => process.exit(0));
