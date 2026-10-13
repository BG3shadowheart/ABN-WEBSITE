'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  as?: ElementType;
};

/**
 * Fades content up the first time it scrolls into view.
 * Falls back to "always visible" when IntersectionObserver is unavailable,
 * so nothing can ever be hidden from a visitor (or a crawler).
 */
export function Reveal({ children, delay = 0, className = '', as }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-visible={visible ? 'true' : 'false'}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
