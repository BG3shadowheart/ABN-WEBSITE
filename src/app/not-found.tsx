import Link from 'next/link';
import { CinematicHeroArt } from '@/components/artwork';
import { ArrowIcon, LinkButton } from '@/components/ui';
import { PLATFORMS } from '@/data/products';

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <CinematicHeroArt className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/70" />
      </div>

      <div className="shell py-32">
        <span className="eyebrow">Error 404</span>
        <h1 className="mt-6 font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-[1.05] tracking-tight text-bone-50">
          This page slipped into the dark
        </h1>
        <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-bone-300">
          The link you followed does not exist here. Pick a platform below and keep browsing.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <LinkButton href="/products">
            Open the full catalog
            <ArrowIcon className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/" variant="ghost">
            Back to home
          </LinkButton>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {PLATFORMS.map((platform) => (
            <Link key={platform.id} href={platform.href} className="filter-pill">
              {platform.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
