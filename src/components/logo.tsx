import Image from 'next/image';
import { STORE_NAME, STORE_NAME_KANJI } from '@/data/store';

/**
 * Store emblem — the owner's own artwork from /public/brand/logo.png,
 * rendered through next/image so it is served at the right size.
 * To swap the logo later, just replace that file.
 */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-[0.6rem] border border-crimson-700/60 bg-ink-900 shadow-[0_10px_30px_-16px_rgba(232,16,47,0.8)] ${className}`}
    >
      <Image
        src="/brand/logo.png"
        alt={`${STORE_NAME} logo`}
        fill
        sizes="80px"
        priority
        className="object-cover"
      />
    </span>
  );
}

export function Logo({
  className = '',
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={compact ? 'h-8 w-8' : 'h-9 w-9'} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-semibold tracking-[0.24em] text-bone-50">
          {STORE_NAME}
        </span>
        <span className="mt-1 text-[0.6rem] font-medium tracking-[0.42em] text-crimson-400/80">
          {STORE_NAME_KANJI}
        </span>
      </span>
    </span>
  );
}
