'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_THEME, isTheme, themeForPath, type ThemeId } from '@/lib/themes';

/**
 * Watches which [data-theme-section] is under the middle of the screen and
 * switches <html data-theme>. Colours transition in CSS, a ripple ring plays
 * and the little element badge pops on every change.
 */
export function ThemeController() {
  const pathname = usePathname();
  const [burst, setBurst] = useState(0);
  const current = useRef<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const apply = (next: ThemeId) => {
      if (next === current.current) return;
      current.current = next;
      document.documentElement.dataset.theme = next;
      setBurst((n) => n + 1);
    };

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme-section]'));
    if (sections.length === 0) {
      apply(themeForPath(pathname));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight * 0.5;
      let found: string | undefined;
      // later elements in the DOM are the more deeply nested ones, so they win
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= middle && rect.bottom >= middle) found = el.dataset.themeSection;
      }
      if (isTheme(found)) apply(found);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return burst > 0 ? <div key={`ripple-${burst}`} aria-hidden="true" className="theme-ripple" /> : null;
}
