import type { Product } from '@/data/products';
import { durationHours, isLifetime } from '@/lib/format';
import { ArrowIcon, Chip, PricePair } from '@/components/ui';

/**
 * Every configured duration of one product, with its exact price.
 * Each row jumps to the purchase instructions on the same page.
 */
export function PriceList({ product }: { product: Product }) {
  const prices = [...product.prices].sort(
    (a, b) => durationHours(a.duration) - durationHours(b.duration),
  );

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-ink-700/70 px-5 py-4">
        <h2 className="font-display text-base tracking-wide text-bone-50">
          Durations &amp; prices
        </h2>
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-bone-500">
          {prices.length} option{prices.length === 1 ? '' : 's'}
        </span>
      </div>

      <ul className="divide-y divide-ink-700/60">
        {prices.map((price) => {
          const hourly = durationHours(price.duration) < 24;
          return (
            <li key={price.duration}>
              <a
                href="#purchase"
                className="group flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-ink-800/70"
              >
                <span className="flex items-center gap-3">
                  <span className="font-display text-[0.95rem] tracking-wide text-bone-50">
                    {price.duration}
                  </span>
                  {isLifetime(price.duration) ? <Chip tone="aura">Lifetime</Chip> : null}
                  {hourly ? <Chip>Hourly</Chip> : null}
                </span>

                <span className="flex items-center gap-4">
                  <PricePair usd={price.usd} bdt={price.bdt} className="text-[1.05rem] font-semibold" />
                  <ArrowIcon className="h-4 w-4 text-bone-500 transition-all group-hover:translate-x-1 group-hover:text-crimson-300" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-ink-700/70 bg-ink-900/60 px-5 py-4 text-xs leading-relaxed text-bone-400">
        Prices are listed in USD and BDT. Payment is arranged directly with support.
      </div>
    </div>
  );
}
