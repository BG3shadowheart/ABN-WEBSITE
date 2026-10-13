'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type CopyState = 'idle' | 'copied' | 'error';

/**
 * Copy-to-clipboard button with a graceful fallback for older browsers and
 * for non-secure contexts (plain http), where navigator.clipboard is missing.
 */
export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  className = '',
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [state, setState] = useState<CopyState>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const flash = useCallback((next: CopyState) => {
    setState(next);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState('idle'), 2200);
  }, []);

  const copy = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        flash('copied');
        return;
      }

      // Fallback: hidden textarea + execCommand.
      const area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      flash(ok ? 'copied' : 'error');
    } catch {
      flash('error');
    }
  }, [flash, value]);

  const isCopied = state === 'copied';
  const isError = state === 'error';

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} ${value}`}
      className={`btn ${isCopied ? 'btn-aura' : 'btn-ghost'} !px-3.5 !py-2 !text-[0.75rem] ${className}`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {isCopied ? (
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <path
              d="M3.5 8.5 6.5 11.5 12.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <rect
              x="5.5"
              y="5.5"
              width="8"
              height="8"
              rx="1.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M10.5 3.5v-.4A1.6 1.6 0 0 0 8.9 1.5H3.1A1.6 1.6 0 0 0 1.5 3.1v5.8a1.6 1.6 0 0 0 1.6 1.6h.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span>{isCopied ? copiedLabel : isError ? 'Press Ctrl+C' : label}</span>
      <span aria-live="polite" className="sr-only">
        {isCopied ? `${value} copied to clipboard` : isError ? 'Copy failed' : ''}
      </span>
    </button>
  );
}
