import Link from 'next/link';
import { DISCORD_URL, TELEGRAM_URL, WHATSAPP_URL } from '@/data/store';
import { resolveSupportLink } from '@/lib/links';
import { ArrowIcon } from '@/components/ui';

function DiscordIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M7.6 17.2c-1.4-.4-3.1-1.2-3.1-1.2.6-3.2 1.9-6.1 3.6-8.4l1.9-.6 1 1.7a13 13 0 0 1 4 0l1-1.7 1.9.6c1.7 2.3 3 5.2 3.6 8.4 0 0-1.7.8-3.1 1.2l-1-1.7c.7-.2 1.4-.6 2-1.1a9.6 9.6 0 0 1-9.8 0c-.6.5-1.3.9-2 1.1l-1 1.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="9.4" cy="12.4" r="1.2" fill="currentColor" />
      <circle cx="14.6" cy="12.4" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TelegramIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M20.4 4.3 3.9 10.6c-1 .4-1 1.7.1 1.9l3.9.9 1.5 4.6c.3.9 1.1 1 1.7.4l2.1-2 3.7 2.7c.7.5 1.6.1 1.8-.8l2.4-12.4c.2-1-.6-1.7-1.7-1.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8.2 13.1 17 6.6l-6.4 7.2-.3 3.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M20.1 11.7a8.1 8.1 0 0 1-11.9 7.1L3 20l1.3-5a8.1 8.1 0 1 1 15.8-3.3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.6 7.9c-.3-.6-.6-.6-.9-.6h-.5c-.2 0-.6.1-.9.5s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2c.2.2 2.1 3.3 5.2 4.5 2.6 1 3.1.8 3.7.7.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.7-.4l-2.1-1c-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-.9-2Z" fill="currentColor" transform="translate(2 0) scale(.82)" />
    </svg>
  );
}

type Channel = {
  id: string;
  label: string;
  title: string;
  body: string;
  href?: string;
  configured: boolean;
  icon: typeof DiscordIcon;
  accentClass: string;
  buttonClass: string;
  buttonLabel: string;
};

export function SupportPanel({
  productName,
  className = '',
}: {
  productName?: string;
  className?: string;
}) {
  const discord = resolveSupportLink(DISCORD_URL);
  const telegram = resolveSupportLink(TELEGRAM_URL);
  const whatsapp = resolveSupportLink(WHATSAPP_URL);

  const channels: Channel[] = [
    {
      id: 'discord',
      label: 'Discord',
      title: 'Discord support',
      body: productName
        ? `Open a message and send us "${productName}" with the duration you want — we confirm the price and payment before anything else.`
        : 'Send us a message with the product, duration and payment details — we confirm everything before you pay.',
      href: discord.href,
      configured: discord.configured,
      icon: DiscordIcon,
      accentClass: 'from-[#5865F2]/18 to-transparent',
      buttonClass: 'btn-primary',
      buttonLabel: 'Open Discord',
    },
    {
      id: 'telegram',
      label: 'Telegram',
      title: 'Telegram support',
      body: productName
        ? `Prefer Telegram? Send the same details — "${productName}", duration and payment proof — and we reply there.`
        : 'Prefer Telegram? Send the product, duration and payment details there instead.',
      href: telegram.href,
      configured: telegram.configured,
      icon: TelegramIcon,
      accentClass: 'from-[#2AABEE]/16 to-transparent',
      buttonClass: 'btn-aura',
      buttonLabel: 'Open Telegram',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      title: 'WhatsApp support',
      body: productName
        ? `Message us on WhatsApp with "${productName}", your chosen duration and payment proof — we will confirm the order with you.`
        : 'Message us on WhatsApp with the product, duration and payment details. We will confirm everything before delivery.',
      href: whatsapp.href,
      configured: whatsapp.configured,
      icon: WhatsAppIcon,
      accentClass: 'from-[#25D366]/18 to-transparent',
      buttonClass: 'btn-aura',
      buttonLabel: 'Open WhatsApp',
    },
  ];

  return (
    <div className={`grid gap-5 md:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {channels.map((channel) => {
        const Icon = channel.icon;
        return (
          <article key={channel.id} className="panel lift relative overflow-hidden p-6 sm:p-7">
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${channel.accentClass}`}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink-600/80 bg-ink-900/80 text-bone-100">
                  <Icon />
                </span>
                <div>
                  <h3 className="font-display text-lg tracking-wide text-bone-50">{channel.title}</h3>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone-500">
                    {channel.label}
                  </p>
                </div>
              </div>
              <span className="chip">{channel.label}</span>
            </div>

            <p className="relative mt-5 text-sm leading-relaxed text-bone-300">{channel.body}</p>

            <div className="relative mt-6">
              {channel.configured && channel.href ? (
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`btn ${channel.buttonClass} w-full sm:w-auto`}
                >
                  {channel.buttonLabel}
                  <ArrowIcon className="h-4 w-4" />
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-ink-500/70 bg-ink-900/60 p-4">
                  <button type="button" className="btn btn-ghost w-full sm:w-auto" disabled>
                    {channel.buttonLabel}
                  </button>
                  <p className="mt-3 text-xs leading-relaxed text-bone-500">
                    This channel is unavailable right now — please use the other support option, or
                    try again a little later.
                  </p>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/** What a buyer should include in their message — shown next to the channels. */
export function ContactChecklist({ productName }: { productName?: string }) {
  const items = [
    productName ? `Product: ${productName}` : 'Product name',
    'The exact duration you want',
    'The price shown on the product page',
    'Payment method used (bKash / Nagad / Binance)',
    'Transaction ID from your payment',
  ];

  return (
    <div className="panel-quiet p-6">
      <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bone-400">
        What to send us
      </h3>
      <ul className="mt-4 space-y-3 text-sm text-bone-200">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-500 shadow-[0_0_10px_rgba(232,16,47,0.9)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-ink-700/70 pt-4 text-xs leading-relaxed text-bone-500">
        Never send a PIN, password, OTP or wallet private key.{' '}
        <Link href="/payments" className="text-crimson-300 underline decoration-crimson-700/70 underline-offset-4 hover:text-crimson-200">
          See payment details
        </Link>
        .
      </p>
    </div>
  );
}
