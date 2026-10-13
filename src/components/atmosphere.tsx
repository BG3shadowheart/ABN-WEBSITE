import type { CSSProperties } from 'react';
import { createRandom, between } from '@/lib/art';
import { Scenes } from '@/components/scenes';
import { THEME_IDS, type ThemeId } from '@/lib/themes';

const PER_THEME = 14;

function particles(theme: ThemeId) {
  const random = createRandom(`fx-${theme}-v1`);
  return Array.from({ length: PER_THEME }, () => ({
    x: between(random, 2, 98),
    y: between(random, 4, 96),
    s: between(random, 0.6, 1.7),
    d: between(random, -30, 0),
    t: between(random, 14, 30),
    o: between(random, 0.35, 0.85),
    w: between(random, 12, 70),
    r: between(random, 40, 300),
  }));
}

/**
 * Fixed page background. Colours follow <html data-theme>, and each theme has
 * its own particle layer (wind, crystals, sparks, leaves, bubbles, embers,
 * snow) that fades in when the theme becomes active. See globals.css (.fx-*).
 */
export function Atmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink-950" />

      <div className="bloom bloom-a absolute -left-40 -top-32 h-[38rem] w-[38rem] rounded-full blur-3xl animate-drift" />
      <div className="bloom bloom-b absolute -right-32 top-24 h-[34rem] w-[34rem] rounded-full blur-3xl animate-drift-reverse" />
      <div className="bloom bloom-a absolute bottom-[-14rem] left-1/3 h-[40rem] w-[40rem] rounded-full blur-3xl animate-float-slower" />

      <div className="bg-grid absolute inset-0 opacity-[0.45] [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)]" />

      <Scenes />

      {THEME_IDS.map((theme) => (
        <div key={theme} className={`fx fx-${theme}`}>
          {particles(theme).map((p, index) => (
            <span
              key={index}
              className="p"
              style={
                {
                  '--x': p.x,
                  '--y': p.y,
                  '--s': p.s,
                  '--d': p.d,
                  '--t': p.t,
                  '--o': p.o,
                  '--w': `${p.w}px`,
                  '--r': `${p.r}deg`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}

      <div className="bg-noise absolute inset-0 z-[4] opacity-[0.03] mix-blend-soft-light" />
      <div className="absolute inset-x-0 top-0 z-[4] h-40 bg-gradient-to-b from-ink-950/80 to-transparent" />
    </div>
  );
}
