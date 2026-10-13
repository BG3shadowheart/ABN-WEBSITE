import Link from 'next/link';
import type { Metadata } from 'next';

import { CategorySection } from '@/components/category-section';
import { CatalogExplorer } from '@/components/catalog-explorer';
import { Hero } from '@/components/hero';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { ProductGrid } from '@/components/product-grid';
import { Reveal } from '@/components/reveal';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, LinkButton, Rule, SectionHeading } from '@/components/ui';
import { PLATFORMS } from '@/data/products';
import { PLATFORM_THEME } from '@/lib/themes';
import { CATALOG_HREF, ORDER_STEPS, STORE_DESCRIPTION, STORE_NAME, STORE_TAGLINE } from '@/data/store';
import { getAllProducts, getFeaturedProducts } from '@/lib/catalog';

export const metadata: Metadata = {
  title: `${STORE_NAME} — ${STORE_TAGLINE}`,
  description: STORE_DESCRIPTION,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const products = getAllProducts();
  const featured = getFeaturedProducts();

  return (
    <>
      <Hero />

      {/* ---------------------------------------------------------------- */}
      {/* Platform categories                                               */}
      {/* ---------------------------------------------------------------- */}
      <section id="categories" className="shell scroll-mt-28 pt-24 pb-20 sm:pt-28 sm:pb-24">
        <div data-theme-section="electro">
        <SectionHeading
          eyebrow="Three platforms"
          title="Choose your battlefield"
          description="PC, Android and iOS each have their own entries, their own durations and their own prices."
          action={
            <LinkButton href={CATALOG_HREF} variant="ghost">
              Open the full catalog
              <ArrowIcon className="h-4 w-4" />
            </LinkButton>
          }
        />
        </div>

        <div className="mt-14 flex flex-col gap-16 lg:gap-20">
          {PLATFORMS.map((platform, index) => (
            <div key={platform.id} data-theme-section={PLATFORM_THEME[platform.id]}>
              <CategorySection
                platform={platform.id}
                layout={index === 0 ? 'art-left' : index === 1 ? 'art-right' : 'banner'}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="featured" data-theme-section="pyro" className="shell scroll-mt-28 py-20 sm:py-24">
        <SectionHeading
          eyebrow="Hand-picked"
          title="Featured builds"
          description="The builds people ask about most — one tap away from their full price list."
          action={
            <LinkButton href={CATALOG_HREF} variant="ghost">
              See all {products.length} products
              <ArrowIcon className="h-4 w-4" />
            </LinkButton>
          }
        />
        <ProductGrid products={featured} className="mt-12" priorityCount={3} />
      </section>

      <Rule className="shell" />

      {/* ---------------------------------------------------------------- */}
      {/* Full catalog                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section id="catalog" data-theme-section="hydro" className="shell scroll-mt-28 py-20 sm:py-24">
        <SectionHeading
          eyebrow="Complete catalog"
          title="Every product, every duration, every price"
          description="Search by name, filter by platform, narrow by duration and sort by price."
        />
        <CatalogExplorer products={products} id="catalog-explorer" className="mt-12" />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Payments                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="payments" data-theme-section="geo" className="shell scroll-mt-28 py-20 sm:py-24">
        <SectionHeading
          eyebrow="Payment methods"
          title="Pay with bKash, Nagad or Binance"
          description="Copy an account detail, send the exact amount for your chosen duration, then confirm with support."
          action={
            <LinkButton href="/payments" variant="ghost">
              Full payment guide
              <ArrowIcon className="h-4 w-4" />
            </LinkButton>
          }
        />

        <PaymentCards className="mt-12" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="h-full">
            <div className="panel h-full p-6 sm:p-8">
              <h3 className="font-display text-xl tracking-wide text-bone-50">
                How an order works
              </h3>
              <ol className="mt-6 space-y-5">
                {ORDER_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-crimson-700/60 bg-crimson-900/30 font-mono text-[0.7rem] text-crimson-200">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-bone-100">{step.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-bone-400">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <div className="flex h-full flex-col gap-6">
              <PaymentSafetyNote />
              <div className="panel flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="font-display text-lg tracking-wide text-bone-50">
                    Not sure which build fits?
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-400">
                    Tell us your device and what you are looking for. We will point you at the right
                    entry instead of guessing.
                  </p>
                </div>
                <Link
                  href="/support"
                  className="btn btn-primary mt-6 w-full sm:w-auto"
                >
                  Talk to support
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Rule className="shell" />

      {/* ---------------------------------------------------------------- */}
      {/* Support                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="support" data-theme-section="anemo" className="shell scroll-mt-28 py-20 sm:py-24">
        <SectionHeading
          eyebrow="Support"
          title="Discord, Telegram or WhatsApp"
          description="All three channels reach the same team. Send your product, duration and payment details and we take it from there."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
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
