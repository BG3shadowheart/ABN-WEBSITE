'use client';

import { useMemo, useState } from 'react';
import { PLATFORMS, PLATFORM_LABEL, type Platform, type Product } from '@/data/products';
import {
  DURATION_FILTERS,
  SORT_OPTIONS,
  filterProducts,
  type DurationFilterId,
  type SortId,
} from '@/lib/catalog';
import { ProductCard } from '@/components/product-card';
import { Reveal } from '@/components/reveal';

type PlatformOption = Platform | 'all';

export function CatalogExplorer({
  products,
  initialPlatform = 'all',
  showPlatformFilter = true,
  id,
  className = '',
}: {
  products: Product[];
  initialPlatform?: PlatformOption;
  showPlatformFilter?: boolean;
  id?: string;
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<PlatformOption>(initialPlatform);
  const [duration, setDuration] = useState<DurationFilterId>('all');
  const [sort, setSort] = useState<SortId>('featured');

  const results = useMemo(
    () => filterProducts(products, { query, platform, duration, sort }),
    [products, query, platform, duration, sort],
  );

  const platformOptions: { id: PlatformOption; label: string; count: number }[] = [
    { id: 'all', label: 'All platforms', count: products.length },
    ...PLATFORMS.map((item) => ({
      id: item.id as PlatformOption,
      label: item.label,
      count: products.filter((product) => product.platform === item.id).length,
    })),
  ];

  const filtersActive = query.trim() !== '' || platform !== 'all' || duration !== 'all';

  const clearFilters = () => {
    setQuery('');
    setPlatform(initialPlatform);
    setDuration('all');
    setSort('featured');
  };

  const activePlatformLabel =
    platform === 'all' ? 'all platforms' : PLATFORM_LABEL[platform as Platform];

  return (
    <div id={id} className={`scroll-mt-28 ${className}`}>
      {/* ---------------------------------------------------------------- */}
      {/* Controls                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="panel p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div role="search">
            <label
              htmlFor="catalog-search"
              className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-bone-500"
            >
              Search the catalog
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bone-500">
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                  <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m13.2 13.2 3.3 3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name — e.g. DRIP, PATO, iOS, proxy…"
                className="field pl-10"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="catalog-duration"
              className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-bone-500"
            >
              Duration
            </label>
            <select
              id="catalog-duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value as DurationFilterId)}
              className="field mt-2"
            >
              {DURATION_FILTERS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="catalog-sort"
              className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-bone-500"
            >
              Sort by
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
              className="field mt-2"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showPlatformFilter ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink-700/70 pt-5">
            <span className="mr-1 hidden text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-bone-500 sm:inline">
              Platform
            </span>
            {platformOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPlatform(option.id)}
                aria-pressed={platform === option.id}
                className="filter-pill"
              >
                {option.label}
                <span className="font-mono text-[0.68rem] text-bone-500">{option.count}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Result meta                                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-bone-400" aria-live="polite">
          <span className="font-mono text-bone-100">{results.length}</span>{' '}
          {results.length === 1 ? 'product' : 'products'} on {activePlatformLabel}
          {query.trim() ? (
            <>
              {' '}
              matching <span className="text-bone-100">“{query.trim()}”</span>
            </>
          ) : null}
        </p>

        {filtersActive ? (
          <button type="button" onClick={clearFilters} className="btn btn-ghost !px-4 !py-2 !text-xs">
            Clear filters
          </button>
        ) : null}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Results                                                           */}
      {/* ---------------------------------------------------------------- */}
      {results.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((product, index) => (
            <Reveal key={product.slug} delay={Math.min(index, 5) * 50} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="panel mt-6 flex flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-600 bg-ink-900 text-bone-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h3 className="font-display text-lg text-bone-50">Nothing matches those filters</h3>
            <p className="mt-2 max-w-md text-sm text-bone-400">
              Try a shorter search term, switch the platform, or clear the filters to see the full
              catalog again.
            </p>
          </div>
          <button type="button" onClick={clearFilters} className="btn btn-primary">
            Show every product
          </button>
        </div>
      )}
    </div>
  );
}
