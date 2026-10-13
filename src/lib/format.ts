/**
 * Price + duration formatting helpers.
 *
 * Every number is formatted with an EXPLICIT locale so the server-rendered
 * HTML and the browser output always match (no hydration mismatches), and so
 * prices are printed exactly as they were configured.
 */

import type { PriceOption } from '@/data/products';

/** '$2' · '$0.50' · '$11.30' */
export function formatUsd(value: number): string {
  return `$${groupNumber(value)}`;
}

/** '৳250' · '৳1,000' · '৳950.40' */
export function formatBdt(value: number): string {
  return `৳${groupNumber(value)}`;
}

function groupNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Both currencies of one price option: '$2 / ৳250' (or just one of them). */
export function formatPriceOption(price: PriceOption): string {
  const parts: string[] = [];
  if (typeof price.usd === 'number') parts.push(formatUsd(price.usd));
  if (typeof price.bdt === 'number') parts.push(formatBdt(price.bdt));
  return parts.join(' / ');
}

/**
 * Turns a duration label into a comparable number of hours.
 * '1 Hour' → 1 · '3 Days' → 72 · '1 Month' → 720 · '1 Year' → 8760
 * 'Lifetime' → Infinity
 */
export function durationHours(label: string): number {
  const value = label.toLowerCase();
  if (value.includes('lifetime') || value.includes('forever')) return Number.POSITIVE_INFINITY;

  const match = value.match(/(\d+(?:\.\d+)?)\s*(hour|hr|day|week|month|year)/);
  if (!match) return Number.POSITIVE_INFINITY;

  const amount = Number.parseFloat(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'hour':
    case 'hr':
      return amount;
    case 'day':
      return amount * 24;
    case 'week':
      return amount * 24 * 7;
    case 'month':
      return amount * 24 * 30;
    case 'year':
      return amount * 24 * 365;
    default:
      return Number.POSITIVE_INFINITY;
  }
}

/** True when a duration label is a lifetime option. */
export function isLifetime(label: string): boolean {
  return !Number.isFinite(durationHours(label));
}

/** Short human summary of a price list, e.g. '3 durations · 1 Day → 1 Month'. */
export function summariseDurations(prices: PriceOption[]): string {
  if (prices.length === 0) return 'No durations listed';
  const sorted = [...prices].sort((a, b) => durationHours(a.duration) - durationHours(b.duration));
  const first = sorted[0].duration;
  const last = sorted[sorted.length - 1].duration;
  const count = `${prices.length} duration${prices.length === 1 ? '' : 's'}`;
  return first === last ? `${count} · ${first}` : `${count} · ${first} → ${last}`;
}
