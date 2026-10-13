import type { Metadata } from 'next';
import Link from 'next/link';

import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { Breadcrumbs } from '@/components/platform-page';
import { Reveal } from '@/components/reveal';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, LinkButton, Rule, SectionHeading } from '@/components/ui';
import { ORDER_STEPS } from '@/data/store';
import { PLATFORMS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Reach the store team on Discord, Telegram or WhatsApp to confirm a product, a duration, a price or a payment.',
  alternates: { canonical: '/support' },
};

const BEFORE_YOU_ASK = [
  'Which product and duration you are looking at (the product page URL helps).',
  'Which platform you are on — PC, Android or iOS.',
  'Which payment method you plan to use.',
  'Your transaction ID if you have already paid.',
];

const NEVER_SHARE = [
  'bKash / Nagad PIN or password',
  'One-time passwords (OTP)',
  'Wallet private keys or seed phrases',
  'Remote-access codes you did not request',
];

export default function SupportPage() {
  return (
    <>
      <section className="shell pb-10 pt-32 sm:pt-36">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Support' }]} />

        <div className="mt-8 max-w-3xl">
          <span className="eyebrow">Support centre</span>
          <h1 className="mt-5 font-display text-[clamp(2.1rem,5.4vw,3.4rem)] font-semibold leading-[1.06] tracking-tight text-bone-50">
            Talk to a human before you pay
          </h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-bone-300">
            We confirm the product, the duration, the exact price and the payment with you first.
            Use whichever channel you prefer — all three reach the same team.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="#how-to-order" variant="ghost" className="!py-2.5">
              How ordering works
              <ArrowIcon className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/products" variant="ghost" className="!py-2.5">
              Browse the catalog
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="shell pb-16">
        <SupportPanel />
      </section>

      <Rule className="shell" />

      <section id="how-to-order" className="shell scroll-mt-28 py-20">
        <SectionHeading
          eyebrow="How to order"
          title="Four steps, start to finish"
          description="From picking a duration to receiving your access — here is the full sequence."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="h-full">
            <div className="panel h-full p-6 sm:p-8">
              <ol className="space-y-6">
                {ORDER_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-crimson-700/60 bg-crimson-900/30 font-mono text-[0.72rem] text-crimson-200">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-bone-100">{step.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-bone-400">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <ContactChecklist />
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <article className="panel h-full p-6">
              <h3 className="font-display text-lg tracking-wide text-bone-50">
                It helps if you tell us
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-bone-300">
                {BEFORE_YOU_ASK.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <article className="panel h-full border-crimson-700/50 p-6">
              <h3 className="font-display text-lg tracking-wide text-bone-50">
                We will never ask for
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-bone-300">
                {NEVER_SHARE.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-400 shadow-[0_0_10px_rgba(255,80,100,0.9)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-ink-700/70 pt-4 text-xs leading-relaxed text-bone-500">
                Anyone who asks for these is not us. Stop the conversation and report it in our
                Discord, Telegram or WhatsApp.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <Rule className="shell" />

      <section className="shell py-20">
        <SectionHeading
          eyebrow="Payment details"
          title="The accounts you can pay into"
          description="Exactly the details listed on our payments page — nothing more, nothing else."
          action={
            <Link href="/payments" className="btn btn-ghost">
              Payment guide
              <ArrowIcon className="h-4 w-4" />
            </Link>
          }
        />
        <PaymentCards className="mt-10" />
        <PaymentSafetyNote className="mt-8" />
      </section>

      <section className="shell pb-24">
        <SectionHeading
          eyebrow="Keep browsing"
          title="Jump back into a platform"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {PLATFORMS.map((platform) => (
            <Reveal key={platform.id}>
              <Link
                href={platform.href}
                className="panel lift group flex items-center justify-between gap-4 p-6"
              >
                <span>
                  <span className="block font-display text-lg tracking-wide text-bone-50">
                    {platform.label}
                  </span>
                  <span className="mt-1 block text-sm text-bone-400">{platform.blurb}</span>
                </span>
                <ArrowIcon className="h-5 w-5 shrink-0 text-bone-500 transition-all group-hover:translate-x-1 group-hover:text-crimson-300" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
