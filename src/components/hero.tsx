import fs from 'node:fs';
import path from 'node:path';
import { CATALOG_HREF, STORE_DESCRIPTION, STORE_NAME, STORE_NAME_KANJI } from '@/data/store';
import { getCatalogStats } from '@/lib/catalog';
import { formatBdt, formatUsd } from '@/lib/format';
import { ArrowIcon, LinkButton } from '@/components/ui';

/** Drop public/art/hero.jpg (or .png/.webp/.avif) in and it replaces the generated hero art. */
function findHeroImage(): string | null {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'avif']) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'art', `hero.${ext}`))) return `/art/hero.${ext}`;
  }
  return null;
}

export function Hero() {
  const heroImage = findHeroImage();
  const stats = getCatalogStats();

  return (
    <section data-theme-section="anemo" className="relative isolate overflow-hidden">
      {/* cinematic scene */}
      <div className="absolute inset-0 -z-10">
        {heroImage ? (
          <>
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-ink-950/20 to-transparent" />
        )}
      </div>

      {/* vertical kanji accent (desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 items-center gap-4 xl:flex"
      >
        <span
          className="text-[0.7rem] font-semibold tracking-[0.6em] text-bone-500"
          style={{ writingMode: 'vertical-rl' }}
        >
          {STORE_NAME_KANJI} · PREMIUM BUILDS
        </span>
        <span className="h-40 w-px bg-gradient-to-b from-transparent via-crimson-600/70 to-transparent" />
      </div>

      <div className="shell relative flex min-h-[92svh] flex-col justify-center pb-20 pt-36 sm:pt-40 lg:min-h-[100svh]">
        <div className="max-w-3xl">
          <span className="eyebrow animate-rise">
            PC · Android · iOS · priced in USD &amp; BDT
          </span>

          <h1 className="mt-6 font-display text-[clamp(2.35rem,6.4vw,4.75rem)] font-semibold leading-[1.02] tracking-tight text-bone-50">
            Premium builds for
            <span className="mt-2 block bg-gradient-to-r from-crimson-200 via-crimson-500 to-aura-400 bg-clip-text text-transparent">
              PC · Android · iOS
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-bone-300 sm:text-lg">
            {STORE_DESCRIPTION}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <LinkButton href={CATALOG_HREF} className="!px-6 !py-3.5 !text-[0.92rem]">
              Explore products
              <ArrowIcon className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/payments" variant="ghost" className="!px-6 !py-3.5 !text-[0.92rem]">
              Payment methods
            </LinkButton>
            <span className="hidden text-xs text-bone-500 sm:inline">
              {STORE_NAME} · {stats.products} products ·{' '}
              {stats.lowestUsd !== null ? `from ${formatUsd(stats.lowestUsd)}` : 'USD & BDT pricing'}
            </span>
          </div>

          {/* stats */}
          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={String(stats.products)} label="Products listed" />
            <HeroStat value={String(stats.platforms)} label="Platforms" />
            <HeroStat value={String(stats.durationLabels)} label="Durations" />
            <HeroStat value={String(stats.lifetimeProducts)} label="With lifetime" />
          </dl>

          <p className="mt-6 text-xs text-bone-500">
            Lowest listed price{' '}
            <span className="font-mono text-bone-300">
              {stats.lowestUsd !== null ? formatUsd(stats.lowestUsd) : '—'}
            </span>
            {stats.lowestBdt !== null ? (
              <>
                {' '}
                / <span className="font-mono text-bone-300">{formatBdt(stats.lowestBdt)}</span>
              </>
            ) : null}
          </p>
        </div>

        {/* scroll cue */}
        <div className="mt-16 hidden items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-bone-500 sm:flex">
          <span className="relative h-10 w-px overflow-hidden bg-ink-600">
            <span className="absolute inset-x-0 top-0 h-4 animate-float-slow bg-crimson-500" />
          </span>
          Scroll to explore
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="panel-quiet px-4 py-3 backdrop-blur-sm">
      <dt className="font-display text-2xl text-bone-50">{value}</dt>
      <dd className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-bone-400">
        {label}
      </dd>
    </div>
  );
}
