import Link from 'next/link';
import {
  CATALOG_HREF,
  DISCORD_URL,
  FOOTER_NOTE,
  STORE_DESCRIPTION,
  STORE_NAME,
  STORE_NAME_KANJI,
  STORE_TAGLINE,
  TELEGRAM_URL,
  WHATSAPP_URL,
} from '@/data/store';
import { PLATFORMS } from '@/data/products';
import { LogoMark } from '@/components/logo';
import { resolveSupportLink } from '@/lib/links';

const HELP_LINKS = [
  { label: 'Full catalog', href: CATALOG_HREF },
  { label: 'Payment methods', href: '/payments' },
  { label: 'Support', href: '/support' },
  { label: 'How ordering works', href: '/support#how-to-order' },
];

export function SiteFooter() {
  const discord = resolveSupportLink(DISCORD_URL);
  const telegram = resolveSupportLink(TELEGRAM_URL);
  const whatsapp = resolveSupportLink(WHATSAPP_URL);
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-ink-700/70 bg-ink-950/80">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-crimson-600/60 to-transparent" />

      <div className="shell py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10" />
              <div>
                <div className="font-display text-lg tracking-[0.26em] text-bone-50">
                  {STORE_NAME}
                </div>
                <div className="text-[0.62rem] tracking-[0.4em] text-crimson-400/80">
                  {STORE_NAME_KANJI}
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bone-400">{STORE_DESCRIPTION}</p>
            <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bone-500">
              {STORE_TAGLINE}
            </p>
          </div>

          <FooterColumn
            title="Platforms"
            links={PLATFORMS.map((platform) => ({
              label: platform.label,
              href: platform.href,
            }))}
          />

          <FooterColumn title="Store" links={HELP_LINKS} />

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bone-400">
              Support
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                {discord.configured ? (
                  <a
                    href={discord.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-bone-200 transition-colors hover:text-crimson-300"
                  >
                    Discord support
                  </a>
                ) : (
                  <span className="text-bone-500">Discord — link not configured yet</span>
                )}
              </li>
              <li>
                {telegram.configured ? (
                  <a
                    href={telegram.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-bone-200 transition-colors hover:text-crimson-300"
                  >
                    Telegram support
                  </a>
                ) : (
                  <span className="text-bone-500">Telegram — link not configured yet</span>
                )}
              </li>
              <li>
                {whatsapp.configured ? (
                  <a href={whatsapp.href} target="_blank" rel="noreferrer noopener" className="text-bone-200 transition-colors hover:text-crimson-300">
                    WhatsApp support
                  </a>
                ) : <span className="text-bone-500">WhatsApp — link not configured yet</span>}
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-bone-200 transition-colors hover:text-crimson-300"
                >
                  Support centre
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-bone-500">
              Never share PINs, passwords, OTPs or private keys with anyone.
            </p>
          </div>
        </div>

        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-ink-600 to-transparent" />

        <div className="mt-6 flex flex-col gap-4 text-xs text-bone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {STORE_NAME}. All rights reserved.
          </p>
          <p className="max-w-xl sm:text-right">{FOOTER_NOTE}</p>
        </div>

        <p className="mt-6 text-[0.7rem] leading-relaxed text-bone-500/80">
          Third-party tools may conflict with a game&apos;s terms of service — check the rules that
          apply to you.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bone-400">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link href={link.href} className="text-bone-200 transition-colors hover:text-crimson-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
