import fs from 'node:fs';
import path from 'node:path';
import { THEME_IDS, type ThemeId } from '@/lib/themes';

export type LocalArt = { url: string; mobileUrl?: string; artist?: string; link?: string };

/**
 * Use compressed WebP artwork on desktop and smaller WebP alternatives on
 * mobile. All character art is bundled locally, so normal visitors do not
 * need a third-party image API or any browser storage for the artwork.
 */
export function findLocalCharacters(): Partial<Record<ThemeId, LocalArt>> {
  const dir = path.join(process.cwd(), 'public', 'art', 'characters');
  let credits: Record<string, { artist?: string; link?: string }> = {};
  try {
    credits = JSON.parse(fs.readFileSync(path.join(dir, 'credits.json'), 'utf8'));
  } catch {
    /* no credits file */
  }

  const found: Partial<Record<ThemeId, LocalArt>> = {};
  for (const theme of THEME_IDS) {
    for (const ext of ['webp', 'avif', 'jpg', 'jpeg', 'png']) {
      if (fs.existsSync(path.join(dir, `${theme}.${ext}`))) {
        const mobileFile = `${theme}.mobile.webp`;
        found[theme] = {
          url: `/art/characters/${theme}.${ext}`,
          ...(fs.existsSync(path.join(dir, mobileFile)) ? { mobileUrl: `/art/characters/${mobileFile}` } : {}),
          ...credits[theme],
        };
        break;
      }
    }
  }
  return found;
}
