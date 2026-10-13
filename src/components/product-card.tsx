import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/products';
import { getStartingPrice, hasLifetimeOption } from '@/lib/catalog';
import { durationHours, isLifetime } from '@/lib/format';
import { ProductArtwork } from '@/components/artwork';
import { ArrowIcon, Chip, PlatformBadge, PricePair } from '@/components/ui';

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const starting = getStartingPrice(product);
  const durations = [...product.prices].sort(
    (a, b) => durationHours(a.duration) - durationHours(b.duration),
  );
  const visibleDurations = durations.slice(0, 3);
  const hiddenCount = durations.length - visibleDurations.length;
  const lifetime = hasLifetimeOption(product);

  return (
    <article className="panel lift group relative flex h-full flex-col overflow-hidden focus-within:border-crimson-500/60">
      <div className="art-frame relative aspect-16/10 w-full">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt ?? `${product.name} artwork`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="art-layer object-cover"
          />
        ) : (
          <ProductArtwork
            seed={product.slug}
            platform={product.platform}
            name={product.name}
            className="art-layer absolute inset-0 h-full w-full"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <PlatformBadge platform={product.platform} />
          {lifetime ? <Chip tone="aura">Lifetime</Chip> : null}
        </div>

        {product.featured ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-crimson-400/50 bg-ink-950/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-crimson-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson-400 shadow-[0_0_10px_rgba(255,80,100,0.95)]" />
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.02rem] leading-snug tracking-wide text-bone-50">
          <Link
            href={`/products/${product.slug}`}
            className="relative z-[1] transition-colors hover:text-crimson-200"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-2.5 text-[0.83rem] leading-relaxed text-bone-400">{product.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleDurations.map((price) => (
            <span
              key={price.duration}
              className={`chip ${isLifetime(price.duration) ? 'chip-aura' : ''}`}
            >
              {price.duration}
            </span>
          ))}
          {hiddenCount > 0 ? <span className="chip">+{hiddenCount} more</span> : null}
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-ink-700/70 pt-4">
            <div>
              <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-bone-500">
                {starting ? `From · ${starting.duration}` : 'Price'}
              </div>
              <div className="mt-1 text-[1.05rem] font-semibold">
                {starting ? (
                  <PricePair usd={starting.usd} bdt={starting.bdt} />
                ) : (
                  <span className="text-bone-400">Ask support</span>
                )}
              </div>
            </div>

            <Link
              href={`/products/${product.slug}`}
              aria-label={`View details for ${product.name}`}
              className="btn btn-ghost relative z-[1] !px-3.5 !py-2 !text-[0.72rem] text-bone-200 transition-colors group-hover:border-crimson-500/60 group-hover:text-white"
            >
              View details
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
