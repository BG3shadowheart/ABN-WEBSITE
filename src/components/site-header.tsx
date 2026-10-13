'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_LINKS, CATALOG_HREF, STORE_NAME_KANJI } from '@/data/store';
import { Logo } from '@/components/logo';
import { ArrowIcon } from '@/components/ui';

export function SiteHeader({ productCount }: { productCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* thin crimson progress hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-crimson-600/70 to-transparent" />

      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'border-b border-ink-700/80 bg-ink-950/85 backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,1)]'
            : 'border-b border-transparent bg-gradient-to-b from-ink-950/90 to-transparent'
        }`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={`${STORE_NAME_KANJI} — home`}
            className="group flex items-center transition-opacity hover:opacity-90"
          >
            <Logo />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-lg px-3.5 py-2 text-[0.82rem] font-semibold tracking-wide transition-colors ${
                    active ? 'text-bone-50' : 'text-bone-300 hover:text-bone-50'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gradient-to-r from-crimson-500 to-aura-500 transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="chip font-mono">{productCount} builds live</span>
            <Link href={CATALOG_HREF} className="btn btn-primary !px-4 !py-2.5 !text-[0.8rem]">
              Browse all products
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="btn btn-ghost !px-3 !py-2.5 lg:hidden"
          >
            <span className="relative flex h-4 w-5 flex-col justify-between">
              <span
                className={`h-[2px] w-full rounded bg-current transition-transform duration-300 ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[2px] w-full rounded bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`h-[2px] w-full rounded bg-current transition-transform duration-300 ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-b border-ink-700/70 bg-ink-950/97 backdrop-blur-xl transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav aria-label="Mobile navigation" className="shell flex flex-col gap-1 py-5">
          {NAV_LINKS.map((link, index) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-crimson-700/70 bg-crimson-900/30 text-bone-50'
                    : 'border-ink-700/70 bg-ink-900/60 text-bone-200 hover:border-crimson-700/50 hover:text-white'
                }`}
                style={{ transitionDelay: `${index * 20}ms` }}
              >
                {link.label}
                <ArrowIcon className="h-4 w-4 opacity-60" />
              </Link>
            );
          })}
          <Link href={CATALOG_HREF} className="btn btn-primary mt-3">
            Browse all products
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
