import Link from 'next/link';
import type { Platform } from '@/data/products';
import { PLATFORMS } from '@/data/products';
import { getPlatformCounts, getProductsByPlatform, getStartingPrice, hasLifetimeOption } from '@/lib/catalog';
import { durationHours } from '@/lib/format';
import { PlatformEmblem } from '@/components/artwork';
import { ArrowIcon, Chip, LinkButton, PricePair } from '@/components/ui';
import { Reveal } from '@/components/reveal';

type Layout = 'art-left' | 'art-right' | 'banner';

const SHELL_STYLES: Record<Layout, string> = {
  'art-left': 'lg:grid-cols-[1.05fr_1fr]',
  'art-right': 'lg:grid-cols-[1fr_1.05fr]',
  banner: 'lg:grid-cols-[1fr_0.85fr]',
};

export function CategorySection({
  platform,
  layout,
  index,
}: {
  platform: Platform;
  layout: Layout;
  index: number;
}) {
  const meta = PLATFORMS.find((item) => item.id === platform)!;
  const products = getProductsByPlatform(platform);
  const counts = getPlatformCounts();
  const lifetimeCount = products.filter(hasLifetimeOption).length;

  const durationLabels = Array.from(
    new Set(products.flatMap((product) => product.prices.map((price) => price.duration))),
  ).sort((a, b) => durationHours(a) - durationHours(b));

  const artFirst = layout !== 'art-right';

  const art = (
    <div
      className={`panel relative overflow-hidden ${
        layout === 'banner' ? 'min-h-[16rem]' : 'min-h-[18rem]'
      }`}
    >
      <PlatformEmblem platform={platform} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <span className="chip chip-platform self-start">
          {counts[platform]} product{counts[platform] === 1 ? '' : 's'}
        </span>
        <div>
          <div className="font-display text-3xl tracking-[0.12em] text-bone-50">{meta.label}</div>
          <div className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-crimson-300/90">
            {meta.kanji}
          </div>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className="flex flex-col justify-center">
      <span className="eyebrow">
        Category {String(index + 1).padStart(2, '0')} · {meta.label}
      </span>
      <h3 className="mt-5 font-display text-3xl leading-tight tracking-tight text-bone-50 sm:text-[2.35rem]">
        {meta.label} catalog
      </h3>
      <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-bone-300">{meta.intro}</p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {durationLabels.slice(0, 7).map((label) => (
          <Chip key={label}>{label}</Chip>
        ))}
        {durationLabels.length > 7 ? <Chip>+{durationLabels.length - 7}</Chip> : null}
        {lifetimeCount > 0 ? <Chip tone="aura">{lifetimeCount} lifetime</Chip> : null}
      </div>

      <ul className="mt-7 divide-y divide-ink-700/60 border-y border-ink-700/60">
        {products.slice(0, 4).map((product) => {
          const starting = getStartingPrice(product);
          return (
            <li key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                className="group flex items-center justify-between gap-4 py-3.5 transition-colors hover:text-white"
              >
                <span className="min-w-0">
                  <span className="block line-clamp-2 font-display text-[0.92rem] leading-snug tracking-wide text-bone-100 transition-colors group-hover:text-crimson-200">
                    {product.name}
                  </span>
                  <span className="mt-1 block truncate text-[0.72rem] text-bone-500">
                    {product.prices.length} duration{product.prices.length === 1 ? '' : 's'}
                    {product.compatibility ? ` · ${product.compatibility}` : ''}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  {starting ? (
                    <PricePair usd={starting.usd} bdt={starting.bdt} className="text-[0.85rem]" />
                  ) : null}
                  <ArrowIcon className="h-4 w-4 text-bone-500 transition-all group-hover:translate-x-1 group-hover:text-crimson-300" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <LinkButton href={meta.href} variant="ghost">
          View all {counts[platform]} {meta.label} products
          <ArrowIcon className="h-4 w-4" />
        </LinkButton>
        <span className="text-xs text-bone-500">{meta.compatibility}</span>
      </div>
    </div>
  );

  return (
    <Reveal className="py-4">
      <div className={`grid items-stretch gap-8 ${SHELL_STYLES[layout]}`}>
        {artFirst ? (
          <>
            {art}
            {content}
          </>
        ) : (
          <>
            {content}
            {art}
          </>
        )}
      </div>
    </Reveal>
  );
}
