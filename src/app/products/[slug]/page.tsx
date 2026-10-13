import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductArtwork } from '@/components/artwork';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { Breadcrumbs } from '@/components/platform-page';
import { PriceList } from '@/components/price-list';
import { PurchaseForm } from '@/components/purchase-form';
import { ProductGrid } from '@/components/product-grid';
import { Reveal } from '@/components/reveal';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, Chip, PlatformBadge, PricePair, Rule, SectionHeading } from '@/components/ui';
import { PLATFORM_LABEL } from '@/data/products';
import { ORDER_STEPS } from '@/data/store';
import {
  getAllSlugs,
  getPlatformMeta,
  getProductBySlug,
  getRelatedProducts,
  getStartingPrice,
} from '@/lib/catalog';
import { formatPriceOption } from '@/lib/format';

/** Only the slugs that exist in the catalog are built — anything else is a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  const priceLine = product.prices
    .map((price) => `${price.duration} ${formatPriceOption(price)}`)
    .join(' · ');

  return {
    title: `${product.name} — ${PLATFORM_LABEL[product.platform]} prices`,
    description: `${product.summary} Full price list: ${priceLine}. Place your order and confirm payment proof through Discord, Telegram or WhatsApp support.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${PLATFORM_LABEL[product.platform]}`,
      description: `${product.summary} ${priceLine}`,
      url: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const platform = getPlatformMeta(product.platform);
  const starting = getStartingPrice(product);
  const related = getRelatedProducts(product, 3);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    category: PLATFORM_LABEL[product.platform],
    offers: product.prices.flatMap((price) => {
      const offers: Record<string, string | number>[] = [];
      if (typeof price.usd === 'number') {
        offers.push({
          '@type': 'Offer',
          name: price.duration,
          price: price.usd,
          priceCurrency: 'USD',
        });
      }
      if (typeof price.bdt === 'number') {
        offers.push({
          '@type': 'Offer',
          name: price.duration,
          price: price.bdt,
          priceCurrency: 'BDT',
        });
      }
      return offers;
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Static, owner-controlled data — no user input is interpolated here.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Overview                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="shell pb-14 pt-32 sm:pt-36">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: platform.label, href: platform.href },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          {/* artwork + facts */}
          <div className="flex flex-col gap-6">
            <div className="panel art-frame group relative aspect-4/3 w-full overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.imageAlt ?? `${product.name} artwork`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <PlatformBadge platform={product.platform} />
                {(product.tags ?? []).map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </div>

            <div className="panel p-6">
              <h2 className="font-display text-base tracking-wide text-bone-50">
                Product information
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-6 border-b border-ink-700/60 pb-4">
                  <dt className="text-bone-500">Platform</dt>
                  <dd className="text-right text-bone-100">{PLATFORM_LABEL[product.platform]}</dd>
                </div>
                <div className="flex items-start justify-between gap-6 border-b border-ink-700/60 pb-4">
                  <dt className="text-bone-500">Compatible with</dt>
                  <dd className="text-right text-bone-100">
                    {product.compatibility ?? platform.compatibility}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-6 border-b border-ink-700/60 pb-4">
                  <dt className="text-bone-500">Durations</dt>
                  <dd className="text-right text-bone-100">
                    {product.prices.length} option{product.prices.length === 1 ? '' : 's'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <dt className="text-bone-500">Checkout</dt>
                  <dd className="text-right text-bone-100">Manual, via support</dd>
                </div>
              </dl>

              {product.details && product.details.length > 0 ? (
                <ul className="mt-6 space-y-2.5 border-t border-ink-700/60 pt-5 text-sm text-bone-300">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {/* purchase column — first on mobile so the name is never below the fold */}
          <div className="order-first lg:order-none lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">{PLATFORM_LABEL[product.platform]} build</span>
            <h1 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,2.9rem)] font-semibold leading-[1.08] tracking-tight text-bone-50">
              {product.name}
            </h1>

            <p className="mt-5 text-[0.98rem] leading-relaxed text-bone-300">{product.summary}</p>
            {product.description ? (
              <p className="mt-4 text-sm leading-relaxed text-bone-400">{product.description}</p>
            ) : null}

            {starting ? (
              <div className="panel mt-7 flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-bone-500">
                    Starting from · {starting.duration}
                  </div>
                  <div className="mt-1.5 text-2xl font-semibold">
                    <PricePair usd={starting.usd} bdt={starting.bdt} />
                  </div>
                </div>
                <a href="#purchase" className="btn btn-primary">
                  Purchase instructions
                  <ArrowIcon className="h-4 w-4" />
                </a>
              </div>
            ) : null}

            <div className="mt-6">
              <PriceList product={product} />
            </div>
          </div>
        </div>
      </section>

      <Rule className="shell" />

      {/* ---------------------------------------------------------------- */}
      {/* Purchase                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="purchase" className="shell scroll-mt-28 py-20">
        <SectionHeading
          eyebrow="Purchase instructions"
          title={`How to order ${product.name}`}
          description="Choose a duration, select your payment method and submit the transaction reference. Our team verifies every order manually."
        />

        <div className="mt-8"><PurchaseForm product={product} /></div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="h-full">
            <div className="panel h-full p-6 sm:p-8">
              <ol className="space-y-6">
                {ORDER_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-crimson-700/60 bg-crimson-900/30 font-mono text-[0.72rem] text-crimson-200">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-bone-100">{step.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-bone-400">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-ink-700/70 pt-6">
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bone-400">
                  Every price for this product
                </h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {product.prices.map((price) => (
                    <li key={price.duration} className="flex items-center justify-between gap-4">
                      <span className="text-bone-300">{price.duration}</span>
                      <PricePair usd={price.usd} bdt={price.bdt} className="text-bone-100" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <div className="flex h-full flex-col gap-6">
              <ContactChecklist productName={product.name} />
              <PaymentSafetyNote />
            </div>
          </Reveal>
        </div>

        <div className="mt-10">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bone-400">
            Accepted payment methods
          </h3>
          <PaymentCards className="mt-5" />
        </div>

        <div className="mt-12">
          <h3 className="font-display text-xl tracking-wide text-bone-50">
            Contact to purchase
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone-400">
            Both channels reach the same team. Mention <span className="text-bone-200">{product.name}</span>{' '}
            and the duration you want so nothing gets mixed up.
          </p>
          <SupportPanel productName={product.name} className="mt-6" />
        </div>
      </section>

      <Rule className="shell" />

      {/* ---------------------------------------------------------------- */}
      {/* Related                                                           */}
      {/* ---------------------------------------------------------------- */}
      {related.length > 0 ? (
        <section className="shell py-20">
          <SectionHeading
            eyebrow={`More ${platform.label} builds`}
            title="You might also want these"
            action={
              <Link
                href={platform.href}
                className="btn btn-ghost !px-4 !py-2.5 !text-xs"
              >
                All {platform.label} products
                <ArrowIcon className="h-4 w-4" />
              </Link>
            }
          />
          <ProductGrid products={related} className="mt-10" />
        </section>
      ) : null}
    </>
  );
}
