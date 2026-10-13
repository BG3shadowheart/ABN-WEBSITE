import Link from 'next/link';
import { PAYMENT_METHODS, PAYMENT_SAFETY_NOTE, type PaymentMethod } from '@/data/store';
import { CopyButton } from '@/components/copy-button';
import { ShieldIcon } from '@/components/ui';

const ACCENTS: Record<
  PaymentMethod['accent'],
  { ring: string; glow: string; dot: string; label: string }
> = {
  crimson: {
    ring: 'border-crimson-700/60',
    glow: 'from-crimson-600/18',
    dot: 'bg-crimson-500 shadow-[0_0_14px_rgba(232,16,47,0.9)]',
    label: 'text-crimson-300',
  },
  violet: {
    ring: 'border-aura-600/60',
    glow: 'from-aura-500/18',
    dot: 'bg-aura-400 shadow-[0_0_14px_rgba(167,139,250,0.9)]',
    label: 'text-aura-300',
  },
  amber: {
    ring: 'border-amber-600/50',
    glow: 'from-amber-500/14',
    dot: 'bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.85)]',
    label: 'text-amber-300',
  },
};

export function PaymentCards({ className = '' }: { className?: string }) {
  return (
    <div className={`grid gap-5 md:grid-cols-3 ${className}`}>
      {PAYMENT_METHODS.map((method) => {
        const accent = ACCENTS[method.accent];
        return (
          <article
            key={method.id}
            className={`panel lift group relative overflow-hidden border ${accent.ring} p-6`}
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${accent.glow} to-transparent`}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                <h3 className="font-display text-xl tracking-wide text-bone-50">{method.name}</h3>
              </div>
              {method.kind ? (
                <span className={`text-[0.66rem] font-semibold uppercase tracking-[0.24em] ${accent.label}`}>
                  {method.kind}
                </span>
              ) : null}
            </div>

            <div className="relative mt-6">
              <div className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-bone-500">
                {method.fieldLabel}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-lg tracking-tight text-bone-50 sm:text-xl">
                  {method.value}
                </span>
                <CopyButton value={method.value} label="Copy" />
              </div>
            </div>

            <p className="relative mt-5 border-t border-ink-700/70 pt-4 text-xs leading-relaxed text-bone-400">
              {method.note}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function PaymentSafetyNote({ className = '' }: { className?: string }) {
  return (
    <div
      className={`panel-quiet flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-crimson-700/50 bg-crimson-900/25 text-crimson-200">
          <ShieldIcon className="h-5 w-5" />
        </span>
        <p className="max-w-3xl text-xs leading-relaxed text-bone-300">{PAYMENT_SAFETY_NOTE}</p>
      </div>
      <Link
        href="/support"
        className="btn btn-ghost shrink-0 !px-4 !py-2 !text-xs"
      >
        Ask support first
      </Link>
    </div>
  );
}
