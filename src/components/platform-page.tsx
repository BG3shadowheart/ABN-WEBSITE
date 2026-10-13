import Link from 'next/link';
import type { Platform } from '@/data/products';
import { PLATFORMS } from '@/data/products';
import { getPlatformMeta, getProductsByPlatform, getStartingPrice } from '@/lib/catalog';
import { durationHours, formatBdt, formatUsd } from '@/lib/format';
import { PlatformEmblem } from '@/components/artwork';
import { CatalogExplorer } from '@/components/catalog-explorer';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { Reveal } from '@/components/reveal';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, Chip, LinkButton, Rule, SectionHeading, Stat } from '@/components/ui';

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-bone-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-crimson-300">
                {item.label}
              </Link>
            ) : (
              <span className="text-bone-300">{item.label}</span>
            )}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PlatformPageView({ platform }: { platform: Platform }) {
  const meta = getPlatformMeta(platform);
  const products = getProductsByPlatform(platform);
  const otherPlatforms = PLATFORMS.filter((item) => item.id !== platform);

  const durationLabels = Array.from(
    new Set(products.flatMap((product) => product.prices.map((price) => price.duration))),
  ).sort((a, b) => durationHours(a) - durationHours(b));

  const cheapest = products
    .map((product) => getStartingPrice(product))
    .filter((value): value is NonNullable<typeof value> => value !== null)
    .sort((a, b) => (a.usd ?? Infinity) - (b.usd ?? Infinity))[0];

  const lifetimeCount = products.filter((product) =>
    product.prices.some((price) => !Number.isFinite(durationHours(price.duration))),
  ).length;

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Platform hero                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-36">
        <div className="absolute inset-0 -z-10">
          <PlatformEmblem platform={platform} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
        </div>

        <div className="shell">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: meta.label }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <span className="eyebrow">
                Platform · {products.length} product{products.length === 1 ? '' : 's'}
              </span>
              <h1 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-bone-50">
                {meta.label} catalog
              </h1>
              <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-bone-300">
                {meta.intro}
              </p>

              <div className="mt-8 flex flex-wrap gap-1.5">
                {durationLabels.map((label) => (
                  <Chip key={label}>{label}</Chip>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LinkButton href="#catalog" className="!px-6 !py-3">
                  Jump to products
                  <ArrowIcon className="h-4 w-4" />
                </LinkButton>
                <LinkButton href="/payments" variant="ghost" className="!px-6 !py-3">
                  Payment methods
                </LinkButton>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              <Stat value={String(products.length)} label="Products" />
              <Stat value={String(durationLabels.length)} label="Durations" />
              <Stat value={String(lifetimeCount)} label="Lifetime options" />
              <Stat
                value={
                  cheapest?.usd !== undefined
                    ? formatUsd(cheapest.usd)
                    : cheapest?.bdt !== undefined
                      ? formatBdt(cheapest.bdt)
                      : '—'
                }
                label="Lowest listed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Products                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="catalog" className="shell scroll-mt-28 pb-20">
        <CatalogExplorer products={products} showPlatformFilter={false} />
      </section>

      <Rule className="shell" />

      {/* ---------------------------------------------------------------- */}
      {/* Other platforms                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="shell py-16">
        <SectionHeading
          eyebrow="Keep browsing"
          title="Looking for another platform?"
          description="Every platform has its own entries, its own durations and its own prices."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {otherPlatforms.map((item) => (
            <Reveal key={item.id}>
              <Link
                href={item.href}
                className="panel lift group flex items-center justify-between gap-4 p-6"
              >
                <span>
                  <span className="block font-display text-lg tracking-wide text-bone-50">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm text-bone-400">{item.blurb}</span>
                </span>
                <ArrowIcon className="h-5 w-5 shrink-0 text-bone-500 transition-all group-hover:translate-x-1 group-hover:text-crimson-300" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Payments + support                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="shell pb-24">
        <SectionHeading
          eyebrow="Ready to order"
          title="Pay, then confirm with support"
          description="Pick your duration above, copy a payment detail below, and send the confirmation to WhatsApp, Telegram or Discord."
        />
        <PaymentCards className="mt-10" />
        <PaymentSafetyNote className="mt-8" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Reveal className="h-full">
            <SupportPanel className="h-full" />
          </Reveal>
          <Reveal delay={80} className="h-full">
            <ContactChecklist />
          </Reveal>
        </div>
      </section>
    </>
  );
}
