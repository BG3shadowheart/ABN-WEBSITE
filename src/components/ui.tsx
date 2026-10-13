import Link from 'next/link';
import type { ReactNode } from 'react';
import { PLATFORM_LABEL, type Platform } from '@/data/products';
import { formatBdt, formatUsd } from '@/lib/format';

/* -------------------------------------------------------------------------- */
/* Section heading                                                             */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-6 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={`max-w-2xl ${centered ? 'flex flex-col items-center' : ''}`}>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight text-bone-50 sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-[0.95rem] leading-relaxed text-bone-300">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Badges + chips                                                              */
/* -------------------------------------------------------------------------- */

export function PlatformBadge({
  platform,
  className = '',
}: {
  platform: Platform;
  className?: string;
}) {
  return (
    <span className={`chip chip-platform ${className}`}>
      <span
        className="h-1.5 w-1.5 rounded-full bg-crimson-400"
        style={{ boxShadow: '0 0 10px rgba(255,80,100,0.9)' }}
      />
      {PLATFORM_LABEL[platform]}
    </span>
  );
}

export function Chip({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode;
  tone?: 'default' | 'aura';
  className?: string;
}) {
  return <span className={`chip ${tone === 'aura' ? 'chip-aura' : ''} ${className}`}>{children}</span>;
}

/* -------------------------------------------------------------------------- */
/* Prices                                                                      */
/* -------------------------------------------------------------------------- */

export function PricePair({
  usd,
  bdt,
  className = '',
}: {
  usd?: number;
  bdt?: number;
  className?: string;
}) {
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {typeof usd === 'number' ? (
        <span className="text-bone-50">{formatUsd(usd)}</span>
      ) : null}
      {typeof usd === 'number' && typeof bdt === 'number' ? (
        <span className="mx-1.5 text-bone-500">/</span>
      ) : null}
      {typeof bdt === 'number' ? <span className="text-bone-200">{formatBdt(bdt)}</span> : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons as links                                                            */
/* -------------------------------------------------------------------------- */

export function LinkButton({
  href,
  children,
  variant = 'primary',
  className = '',
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'aura';
  className?: string;
  ariaLabel?: string;
}) {
  const variantClass =
    variant === 'primary' ? 'btn-primary' : variant === 'aura' ? 'btn-aura' : 'btn-ghost';

  const isInternal = href.startsWith('/') || href.startsWith('#');

  if (isInternal) {
    return (
      <Link href={href} aria-label={ariaLabel} className={`btn ${variantClass} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noreferrer noopener"
      className={`btn ${variantClass} ${className}`}
    >
      {children}
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* Small utilities                                                             */
/* -------------------------------------------------------------------------- */

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="panel-quiet px-4 py-3">
      <div className="font-display text-xl text-bone-50">{value}</div>
      <div className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone-400">
        {label}
      </div>
    </div>
  );
}

export function Rule({ className = '' }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />;
}

/** Arrow used on text links — kept inline so there is no icon dependency. */
export function ArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false">
      <path
        d="M4 10h11m0 0-4.2-4.2M15 10l-4.2 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false">
      <path
        d="M10 2.5 16 5v5c0 3.6-2.5 6.4-6 7.5-3.5-1.1-6-3.9-6-7.5V5l6-2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7.4 10.2 9.3 12l3.3-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
