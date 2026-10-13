import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/platform-page';
import { CatalogExplorer } from '@/components/catalog-explorer';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { Reveal } from '@/components/reveal';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, LinkButton, Rule, SectionHeading } from '@/components/ui';
import { PLATFORMS } from '@/data/products';
import { getAllProducts } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Full catalog',
  description:
    'Browse every product in the store with search, platform filters, duration filters and price sorting.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <>
      <section className="shell pb-10 pt-32 sm:pt-36">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Full catalog' }]} />

        <div className="mt-8 max-w-3xl">
          <span className="eyebrow">Complete catalog · {products.length} products</span>
          <h1 className="mt-5 font-display text-[clamp(2.1rem,5.4vw,3.4rem)] font-semibold leading-[1.06] tracking-tight text-bone-50">
            Everything we sell, in one place
          </h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-bone-300">
            Search by name, filter by platform, narrow by duration and sort by price. Every card
            opens a page with all of its durations and exact prices.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {PLATFORMS.map((platform) => (
              <LinkButton key={platform.id} href={platform.href} variant="ghost" className="!py-2.5">
                {platform.label} only
                <ArrowIcon className="h-4 w-4" />
              </LinkButton>
            ))}
          </div>
        </div>
      </section>

      <section className="shell pb-20">
        <CatalogExplorer products={products} />
      </section>

      <Rule className="shell" />

      <section className="shell py-20">
        <SectionHeading
          eyebrow="Ordering"
          title="Pay with bKash, Nagad or Binance"
          description="Copy the account detail, send the exact amount for the duration you chose, then confirm with support on Discord, Telegram or WhatsApp."
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
