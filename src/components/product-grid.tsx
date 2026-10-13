import type { Product } from '@/data/products';
import { ProductCard } from '@/components/product-card';
import { Reveal } from '@/components/reveal';

export function ProductGrid({
  products,
  className = '',
  priorityCount = 0,
  reveal = true,
}: {
  products: Product[];
  className?: string;
  priorityCount?: number;
  reveal?: boolean;
}) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {products.map((product, index) =>
        reveal ? (
          <Reveal key={product.slug} delay={Math.min(index, 5) * 60} className="h-full">
            <ProductCard product={product} priority={index < priorityCount} />
          </Reveal>
        ) : (
          <ProductCard key={product.slug} product={product} priority={index < priorityCount} />
        ),
      )}
    </div>
  );
}
