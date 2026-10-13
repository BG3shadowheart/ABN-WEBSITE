'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOrderContext, type OrderDetails } from '@/components/order-context';
import { CopyButton } from '@/components/copy-button';
import { DISCORD_URL, TELEGRAM_URL, WHATSAPP_URL } from '@/data/store';

function orderSummary(order: OrderDetails) {
  return [
    'ABNORMAL — Order request',
    `Support reference: ${order.reference}`,
    `Product: ${order.productName}`,
    `Platform: ${order.platform.toUpperCase()}`,
    `Duration: ${order.duration}`,
    `Price: ${order.priceLabel}`,
    `Payment method: ${order.paymentMethod.toUpperCase()}`,
    `Payment destination: ${order.paymentDestination}`,
    order.senderNumber ? `Payment sender phone number: ${order.senderNumber}` : 'Payment sender phone number: Not required for Binance',
    `Transaction ID/number: ${order.transactionId}`,
    'Status: Awaiting manual payment verification',
    'Please verify my payment. I will attach my payment proof screenshot. Thank you.',
  ].join('\n');
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="field-label">{label}</div>
      <div className={`mt-1.5 break-words text-sm text-bone-100 ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}

export function OrderConfirmationClient() {
  const router = useRouter();
  const { order, clearOrder } = useOrderContext();

  if (!order) {
    return (
      <div className="panel mx-auto max-w-3xl p-7 sm:p-9">
        <span className="eyebrow">Order confirmation</span>
        <h1 className="mt-4 font-display text-3xl text-bone-50">No order is open</h1>
        <p className="mt-3 text-sm leading-relaxed text-bone-300">
          For privacy, order details are kept only in the current page session and are never saved to an account or database. Start from a product page and submit your order again. Copy the confirmation before refreshing or closing the tab.
        </p>
        <Link href="/products" className="btn btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  const summary = orderSummary(order);
  const backToProducts = () => {
    clearOrder();
    router.push('/products');
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="panel overflow-hidden">
        <div className="border-b border-ink-700/70 bg-ink-900/50 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-crimson-700/60 bg-crimson-900/30 text-crimson-200" aria-hidden="true">✓</span>
            <div>
              <span className="eyebrow">Order request prepared</span>
              <h1 className="mt-1 font-display text-2xl text-bone-50 sm:text-3xl">Send your payment proof</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone-300">
            Your details have <strong className="text-bone-100">not been uploaded or saved</strong>. Copy the summary below, then contact us on Discord, Telegram or WhatsApp, paste it there and attach your payment screenshot. Our team verifies the payment manually before delivery.
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-bone-50">{order.productName}</h2>
              <p className="mt-1 text-sm text-bone-400">{order.platform.toUpperCase()} · {order.duration}</p>
            </div>
            <span className="chip chip-aura">Awaiting verification</span>
          </div>

          <div className="mt-6 grid gap-4 border-y border-ink-700/70 py-5 sm:grid-cols-2">
            <Info label="Price" value={order.priceLabel} />
            <Info label="Payment method" value={order.paymentMethod.toUpperCase()} />
            <Info label={order.paymentMethod === 'binance' ? 'Binance transaction number / ID' : 'Transaction ID'} value={order.transactionId} mono />
            <Info label="Sender phone number" value={order.senderNumber || 'Not required for Binance'} mono />
            <Info label="Payment destination" value={order.paymentDestination} mono />
            <Info label="Support reference" value={order.reference} mono />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <CopyButton value={summary} label="Copy everything" />
            <a href={DISCORD_URL} target="_blank" rel="noreferrer noopener" className="btn btn-primary">Open Discord ↗</a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">Open Telegram ↗</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener" className="btn btn-aura">Open WhatsApp ↗</a>
          </div>

          <div className="panel-quiet mt-5 p-4 text-sm leading-relaxed text-bone-300">
            <strong className="text-bone-50">What to do:</strong> create a Discord ticket (or message us on Telegram or WhatsApp), click <em>Copy everything</em>, paste the details and attach your payment proof. Make sure the transaction ID and the bKash/Nagad sender number are visible. Never share your PIN or OTP.
          </div>
          <p className="mt-4 text-xs leading-relaxed text-bone-500">Privacy: this website does not create accounts, track orders, or store payment details. These details stay in the current page session and disappear when you refresh, navigate away, or close the tab.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={backToProducts} className="btn btn-ghost">Back to products</button>
      </div>
    </div>
  );
}
