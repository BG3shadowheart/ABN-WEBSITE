/**
 * Deterministic artwork helpers.
 *
 * The store draws its own artwork (layered SVG scenes) so that no product card
 * is ever empty and nothing is copied from anywhere. Every drawing decision is
 * derived from the product slug, which means:
 *   • a product always gets the same artwork (server and browser agree), and
 *   • 25 products produce 25 visibly different posters.
 *
 * Prefer real images? Drop a file into /public/art and set `image` on the
 * product in src/data/products.ts — next/image takes over automatically.
 */

import type { Platform } from '@/data/products';

/* -------------------------------------------------------------------------- */
/* Randomness                                                                  */
/* -------------------------------------------------------------------------- */

/** FNV-1a — small, fast, stable across server and browser. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32 — tiny deterministic PRNG. */
export function createRandom(seed: string): () => number {
  let state = hashString(seed) || 1;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length) % items.length];
}

export function between(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

/* -------------------------------------------------------------------------- */
/* Monograms                                                                   */
/* -------------------------------------------------------------------------- */

const SKIPPED_WORDS = new Set(['&', '+', '-', '—', 'AND', 'THE', 'OF']);

/** 'BR MODS PC' → 'BM' · 'PATO BLUE APK MOD' → 'PB' */
export function monogramFor(name: string): string {
  const words = name
    .replace(/[^A-Za-z0-9&+\-— ]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 0 && !SKIPPED_WORDS.has(word.toUpperCase()));

  if (words.length === 0) return '??';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Palettes                                                                    */
/* -------------------------------------------------------------------------- */

export type ArtPalette = {
  /** deepest background */
  base: string;
  /** secondary background wash */
  wash: string;
  /** main accent (crimson family) */
  accent: string;
  /** lighter accent for highlights */
  accentSoft: string;
  /** restrained violet highlight */
  aura: string;
  /** line work colour */
  line: string;
};

/**
 * The three platforms share one brand language (black + crimson + a little
 * violet) but lean differently, so each category reads as its own world.
 */
export const ART_PALETTES: Record<Platform, ArtPalette> = {
  pc: {
    base: '#06050a',
    wash: '#170710',
    accent: '#e8102f',
    accentSoft: '#ff5a6d',
    aura: '#5b3fd6',
    line: '#ff8a99',
  },
  android: {
    base: '#05070c',
    wash: '#0d0a1c',
    accent: '#ff2436',
    accentSoft: '#ff7a86',
    aura: '#7c5cff',
    line: '#c6b8fd',
  },
  ios: {
    base: '#070612',
    wash: '#140a22',
    accent: '#b3123a',
    accentSoft: '#ff5064',
    aura: '#a78bfa',
    line: '#ded7ff',
  },
};

export type ArtMotif = 'horizon' | 'rings' | 'slash' | 'grid' | 'shards' | 'pulse';

export const ART_MOTIFS: ArtMotif[] = ['horizon', 'rings', 'slash', 'grid', 'shards', 'pulse'];

export function motifFor(seed: string): ArtMotif {
  return ART_MOTIFS[hashString(seed) % ART_MOTIFS.length];
}

/** Short, unique-enough prefix for SVG gradient/filter ids on one page. */
export function artIdPrefix(seed: string): string {
  return `art${hashString(seed).toString(36)}`;
}
