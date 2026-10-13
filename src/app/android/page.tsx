import type { Metadata } from 'next';
import { CatalogExplorer } from '@/components/catalog-explorer';
import { SectionHeading } from '@/components/ui';
import { PRODUCTS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Android products',
  description: 'Browse the complete Android catalog in one place.',
  alternates: { canonical: '/android' },
};

const androidProducts = PRODUCTS.filter((product) => product.platform === 'android');

export default function AndroidPage() {
  return (
    <main className="shell pt-32 pb-20 sm:pt-36">
      <SectionHeading
        eyebrow="Android catalog"
        title="All Android builds"
        description="Browse every Android product in one place. Root requirements and compatibility details remain listed on each individual product when provided."
      />
      <section className="mt-10" id="android-catalog" aria-label="All Android products">
        <CatalogExplorer products={androidProducts} showPlatformFilter={false} />
      </section>
    </main>
  );
}
