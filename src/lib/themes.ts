import type { Platform } from '@/data/products';

/**
 * Section themes (inspired by the seven elements on the Genshin site).
 * The actual colours live in globals.css under html[data-theme='…'].
 */
export const THEMES = {
  anemo: { label: 'Theme 1', glyph: '風' },
  geo: { label: 'Theme 2', glyph: '岩' },
  electro: { label: 'Theme 3', glyph: '雷' },
  dendro: { label: 'Theme 4', glyph: '草' },
  hydro: { label: 'Theme 5', glyph: '水' },
  pyro: { label: 'Theme 6', glyph: '火' },
  cryo: { label: 'Theme 7', glyph: '氷' },
} as const;

export type ThemeId = keyof typeof THEMES;

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];
export const DEFAULT_THEME: ThemeId = 'anemo';

export function isTheme(value: string | undefined): value is ThemeId {
  return !!value && value in THEMES;
}

/** Theme for each platform block on the home page. */
export const PLATFORM_THEME: Record<Platform, ThemeId> = {
  pc: 'electro',
  android: 'dendro',
  ios: 'cryo',
};

/** Theme for pages that have no themed sections of their own. */
export function themeForPath(path: string): ThemeId {
  if (path.startsWith('/pc')) return 'electro';
  if (path.startsWith('/android')) return 'dendro';
  if (path.startsWith('/ios')) return 'cryo';
  if (path.startsWith('/payments')) return 'geo';
  if (path.startsWith('/products')) return 'hydro';
  if (path.startsWith('/support')) return 'anemo';
  return DEFAULT_THEME;
}

/** Which free-API category (and which picture of it) each theme's character comes from. */
export type CharacterCategory = 'waifu' | 'husbando' | 'kitsune' | 'neko';
export const CHARACTER_SLOTS: Record<ThemeId, [CharacterCategory, number]> = {
  anemo: ['waifu', 0],
  geo: ['husbando', 0],
  electro: ['kitsune', 0],
  dendro: ['neko', 0],
  hydro: ['waifu', 1],
  pyro: ['husbando', 1],
  cryo: ['kitsune', 1],
};
