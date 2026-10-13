import type { Metadata } from 'next';
import Link from 'next/link';

import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { Breadcrumbs } from '@/components/platform-page';
import { Reveal } from '@/components/reveal';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, Rule, SectionHeading, ShieldIcon } from '@/components/ui';
import { ORDER_STEPS, PAYMENT_METHODS } from '@/data/store';

export const metadata: Metadata = {
  title: 'Payment methods',
  description:
    'bKash (Personal) +880 1629-835648, Nagad +880 1629-835648 and Binance account ID 1220374728 — with copy buttons and clear order instructions.',
  alternates: { canonical: '/payments' },
};

const FAQ = [
  {
    question: 'How do I pay with bKash or Nagad?',
    answer:
      'Send the exact amount for the duration you chose to the number listed above, then send us the transaction ID on Discord, Telegram or WhatsApp so we can match your payment.',
  },
  {
    question: 'Which currency should I send?',
    answer:
      'Every product lists its own prices in USD and BDT. bKash and Nagad are BDT transfers; Binance is used for USD amounts. Confirm the final amount with support before sending if anything is unclear.',
  },
  {
    question: 'Where do I receive my access?',
    answer:
      'On Discord, Telegram or WhatsApp. Our team confirms your payment and coordinates delivery with you there, so keep the channel open after you pay.',
  },
  {
    question: 'What should I never share?',
    answer:
      'Never send a PIN, password, OTP, or a wallet private key — to us or to anyone else. A payment transfer never requires those.',
  },
];

export default function PaymentsPage() {
  return (
    <>
      <section className="shell pb-10 pt-32 sm:pt-36">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Payments' }]} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-3xl">
            <span className="eyebrow">Payment methods · {PAYMENT_METHODS.length} options</span>
            <h1 className="mt-5 font-display text-[clamp(2.1rem,5.4vw,3.4rem)] font-semibold leading-[1.06] tracking-tight text-bone-50">
              Pay, confirm, receive
            </h1>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-bone-300">
              Choose the product and duration, send the exact amount, then submit an order with
              the transaction ID (and sender phone number for bKash/Nagad). After you place the
              order, copy its summary and attach payment proof in a Discord ticket or send it through Telegram or WhatsApp.
              Every payment is checked manually by our team.
            </p>
          </div>

          <div className="panel p-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-crimson-700/50 bg-crimson-900/25 text-crimson-200">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-base tracking-wide text-bone-50">
                  Before you send anything
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-bone-300">
                  <li>1. Choose the exact product and duration.</li>
                  <li>2. Write down the price shown on that product page.</li>
                  <li>3. Ask support if anything is unclear — before paying.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell pb-16">
        <PaymentCards />
        <PaymentSafetyNote className="mt-8" />
      </section>

      <Rule className="shell" />

      <section className="shell py-20">
        <SectionHeading
          eyebrow="Step by step"
          title="How an order is completed"
          description="Four steps, and you always know exactly what happens next."
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
      </section>

      <section className="shell pb-20">
        <SectionHeading eyebrow="Questions" title="Payment questions, answered plainly" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {FAQ.map((item) => (
            <Reveal key={item.question} className="h-full">
              <article className="panel-quiet h-full p-6">
                <h3 className="font-display text-base tracking-wide text-bone-50">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-400">{item.answer}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell pb-24">
        <SectionHeading
          eyebrow="Support"
          title="Confirm with us before you pay"
          description="Send the product name, duration and the amount you are about to send. We will confirm it is correct."
          action={
            <Link href="/support" className="btn btn-ghost">
              Support centre
              <ArrowIcon className="h-4 w-4" />
            </Link>
          }
        />
        <SupportPanel className="mt-10" />
      </section>
    </>
  );
}
