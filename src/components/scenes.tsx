import type { CSSProperties, ReactNode } from 'react';
import { createRandom, between } from '@/lib/art';
import { THEME_IDS, type ThemeId } from '@/lib/themes';

const W = 1600;
const H = 320;

/** Simple skyline for every element, drawn as flat SVG shapes. */
function silhouette(theme: ThemeId): ReactNode[] {
  const r = createRandom(`sil-${theme}-v1`);
  const out: ReactNode[] = [];
  const ground = <rect key="ground" x="0" y={H - 26} width={W} height="40" />;

  switch (theme) {
    case 'cryo': // onion-dome towers
      [70, 210, 520, 1120, 1390, 1530].forEach((x, i) => {
        const w = between(r, 34, 56);
        const h = between(r, 120, 230);
        const top = H - h;
        out.push(
          <g key={i}>
            <rect x={x - w / 2} y={top} width={w} height={h} />
            <path d={`M${x - w * 0.85},${top} C${x - w * 0.85},${top - w * 0.9} ${x - w * 0.25},${top - w * 1.1} ${x},${top - w * 2} C${x + w * 0.25},${top - w * 1.1} ${x + w * 0.85},${top - w * 0.9} ${x + w * 0.85},${top} Z`} />
            <rect x={x - 1.5} y={top - w * 2.8} width="3" height={w * 0.9} />
          </g>,
        );
      });
      out.push(ground);
      break;
    case 'electro': // pagodas
      [260, 1250, 1450].forEach((x, i) => {
        const parts: ReactNode[] = [];
        for (let t = 0; t < 4; t += 1) {
          const y = H - 36 - t * 52;
          const ww = 92 - t * 15;
          parts.push(<path key={`r${t}`} d={`M${x - ww - 20},${y} L${x + ww + 20},${y} L${x + ww},${y - 13} L${x - ww},${y - 13} Z`} />);
          parts.push(<rect key={`b${t}`} x={x - ww * 0.62} y={y - 13 - 28} width={ww * 1.24} height="28" />);
        }
        parts.push(<rect key="spire" x={x - 2} y={H - 36 - 4 * 52 - 40} width="4" height="46" />);
        out.push(<g key={i}>{parts}</g>);
      });
      out.push(ground);
      break;
    case 'geo': // crystal pillars
      for (let i = 0; i < 16; i += 1) {
        const x = (i / 16) * W + between(r, -20, 40);
        const w = between(r, 36, 96);
        const h = between(r, 70, 250);
        out.push(<polygon key={i} points={`${x},${H} ${x + w * 0.15},${H - h * 0.7} ${x + w * 0.5},${H - h} ${x + w * 0.85},${H - h * 0.6} ${x + w},${H}`} />);
      }
      out.push(ground);
      break;
    case 'dendro': // giant leaves + mushrooms
      for (let i = 0; i < 9; i += 1) {
        const x = between(r, 20, W - 20);
        if (i % 3 === 0) {
          const s = between(r, 40, 80);
          out.push(
            <g key={i}>
              <rect x={x - 6} y={H - s * 1.6} width="12" height={s * 1.6} />
              <path d={`M${x - s},${H - s * 1.6} Q${x},${H - s * 2.7} ${x + s},${H - s * 1.6} Z`} />
            </g>,
          );
        } else {
          out.push(<ellipse key={i} cx={x} cy={H - 70} rx={between(r, 22, 34)} ry={between(r, 80, 130)} transform={`rotate(${between(r, -28, 28)} ${x} ${H})`} />);
        }
      }
      out.push(ground);
      break;
    case 'hydro': // domes + waves
      [180, 430, 1180, 1420].forEach((x, i) => {
        const s = between(r, 46, 80);
        out.push(
          <g key={i}>
            <path d={`M${x - s},${H} L${x - s},${H - s * 0.9} A${s},${s} 0 0 1 ${x + s},${H - s * 0.9} L${x + s},${H} Z`} />
            <rect x={x - 2} y={H - s * 1.9 - 38} width="4" height="40" />
          </g>,
        );
      });
      out.push(<path key="wave" d={`M0,${H - 40} ${Array.from({ length: 8 }, (_, i) => `Q${100 + i * 200},${H - 90 + (i % 2) * 40} ${200 + i * 200},${H - 40}`).join(' ')} L${W},${H} L0,${H} Z`} />);
      break;
    case 'pyro': // dunes + flames
      out.push(<path key="dune" d={`M0,${H} L0,${H - 70} Q400,${H - 150} 800,${H - 60} T${W},${H - 80} L${W},${H} Z`} />);
      for (let i = 0; i < 9; i += 1) {
        const x = between(r, 40, W - 40);
        const h = between(r, 70, 170);
        out.push(<path key={i} d={`M${x},${H} C${x - 28},${H - h * 0.4} ${x + 12},${H - h * 0.6} ${x},${H - h} C${x + 34},${H - h * 0.55} ${x + 44},${H - h * 0.25} ${x + 22},${H} Z`} />);
      }
      break;
    default: // anemo — hills, trees, a tall cathedral tower
      out.push(<path key="hill" d={`M0,${H} L0,${H - 80} Q300,${H - 150} 620,${H - 70} T1250,${H - 90} T${W},${H - 60} L${W},${H} Z`} />);
      [140, 380, 980, 1330, 1500].forEach((x, i) => {
        const s = between(r, 28, 48);
        out.push(
          <g key={i}>
            <rect x={x - 4} y={H - 70 - s} width="8" height={s + 10} />
            <circle cx={x} cy={H - 90 - s} r={s} />
          </g>,
        );
      });
      out.push(
        <g key="tower">
          <rect x="780" y={H - 230} width="44" height="230" />
          <polygon points={`772,${H - 230} 832,${H - 230} 802,${H - 320}`} />
        </g>,
      );
  }
  return out;
}

/**
 * One full-screen scene per theme: light, diamond lattice, sparkles and a
 * skyline. The active scene wipes in over the previous one (see .scene in
 * globals.css), which is what makes the whole page change — not only colour.
 */
export function Scenes() {
  return (
    <>
      {THEME_IDS.map((theme) => {
        const r = createRandom(`spark-${theme}-v1`);
        const sparks = Array.from({ length: 10 }, () => ({
          x: between(r, 3, 97),
          y: between(r, 5, 78),
          s: between(r, 0.6, 1.8),
          d: between(r, -8, 0),
          t: between(r, 3, 7),
        }));
        return (
          <div key={theme} className={`scene scene-${theme}`}>
            <div className="scene-glow" />
            <div className="scene-pattern" />
            {sparks.map((s, index) => (
              <span
                key={index}
                className="spark"
                style={{ '--x': s.x, '--y': s.y, '--s': s.s, '--d': s.d, '--t': s.t } as CSSProperties}
              />
            ))}
            <svg className="sil" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              {silhouette(theme)}
            </svg>
          </div>
        );
      })}
    </>
  );
}
