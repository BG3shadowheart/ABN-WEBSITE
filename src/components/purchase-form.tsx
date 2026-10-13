'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/data/products';
import { PAYMENT_METHODS, type PaymentMethod } from '@/data/store';
import { formatPriceOption } from '@/lib/format';
import { CopyButton } from '@/components/copy-button';
import { useOrderContext } from '@/components/order-context';

type PaymentId = 'bkash' | 'nagad' | 'binance';

export function PurchaseForm({ product }: { product: Product }) {
  const router = useRouter();
  const { setOrder } = useOrderContext();
  const [duration, setDuration] = useState(product.prices[0]?.duration ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentId>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const price = useMemo(
    () => product.prices.find((item) => item.duration === duration) ?? product.prices[0],
    [duration, product.prices],
  );
  const payment = PAYMENT_METHODS.find((item) => item.id === paymentMethod) as PaymentMethod;
  const needsSenderNumber = paymentMethod !== 'binance';

  const placeOrder = () => {
    setFormError('');

    if (!price) {
      setFormError('This product has no configured duration. Please contact support.');
      return;
    }
    if (!transactionId.trim()) {
      setFormError('Enter the transaction ID/number shown on your payment receipt.');
      return;
    }
    if (needsSenderNumber && !/^[+\d][\d\s-]{6,20}$/.test(senderNumber.trim())) {
      setFormError('Enter the phone number you sent the payment from (include the country code if needed).');
      return;
    }

    setBusy(true);
    try {
      const reference = `ABN-${Date.now().toString(36).toUpperCase()}`;
      setOrder({
        reference,
        productSlug: product.slug,
        productName: product.name,
        platform: product.platform,
        duration: price.duration,
        priceLabel: formatPriceOption(price),
        paymentMethod,
        paymentDestination: payment.value,
        senderNumber: needsSenderNumber ? senderNumber.trim() : '',
        transactionId: transactionId.trim(),
      });
      router.push('/order-confirmation');
    } catch {
      setFormError('Could not prepare the order summary. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-ink-700/70 bg-ink-900/45 p-5 sm:p-6">
        <span className="eyebrow">Manual payment · no account required</span>
        <h3 className="mt-2 font-display text-2xl text-bone-50">Place your order</h3>
        <p className="mt-2 text-sm leading-relaxed text-bone-400">
          Choose your duration, pay to the account below, then enter your payment reference. No login is needed. The website does not upload or save your payment details; it only prepares a copyable summary for support.
        </p>
      </div>
      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label htmlFor={`duration-${product.slug}`} className="field-label">Choose duration</label>
          <select id={`duration-${product.slug}`} value={duration} onChange={(event) => setDuration(event.target.value)} className="field mt-2 w-full" required>
            {product.prices.map((item) => (
              <option key={item.duration} value={item.duration}>{item.duration} — {formatPriceOption(item)}</option>
            ))}
          </select>
        </div>

        {price ? (
          <div className="panel-quiet flex flex-wrap items-center justify-between gap-2 p-4">
            <span className="text-sm text-bone-300">Total for {price.duration}</span>
            <strong className="font-mono text-lg text-bone-50">{formatPriceOption(price)}</strong>
          </div>
        ) : null}

        <div>
          <label htmlFor={`payment-${product.slug}`} className="field-label">Payment method</label>
          <select id={`payment-${product.slug}`} value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentId)} className="field mt-2 w-full">
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="binance">Binance</option>
          </select>
        </div>

        <div className="panel-quiet p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="eyebrow">Send payment to</span>
              <h4 className="mt-2 font-display text-lg text-bone-50">{payment.name}{payment.kind ? ` · ${payment.kind}` : ''}</h4>
              <p className="mt-1 break-all font-mono text-base text-bone-100">{payment.value}</p>
            </div>
            <CopyButton value={payment.value} label="Copy account" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-bone-400">Send the exact amount shown above. Never share a PIN, OTP, password or wallet private key.</p>
        </div>

        {needsSenderNumber ? (
          <div>
            <label htmlFor={`sender-${product.slug}`} className="field-label">Your payment phone number</label>
            <input id={`sender-${product.slug}`} value={senderNumber} onChange={(event) => setSenderNumber(event.target.value)} className="field mt-2 w-full" type="tel" inputMode="tel" autoComplete="tel" placeholder="Number you sent the payment from" required maxLength={22} />
            <p className="mt-1.5 text-xs text-bone-500">Enter the sender number used for the bKash/Nagad transfer.</p>
          </div>
        ) : (
          <div className="panel-quiet p-4 text-sm leading-relaxed text-bone-300">For Binance, only the transaction number/ID is required. No phone number is needed.</div>
        )}

        <div>
          <label htmlFor={`transaction-${product.slug}`} className="field-label">{paymentMethod === 'binance' ? 'Binance transaction number / ID' : 'Transaction ID'}</label>
          <input id={`transaction-${product.slug}`} value={transactionId} onChange={(event) => setTransactionId(event.target.value)} className="field mt-2 w-full" autoComplete="off" placeholder="Copy it exactly from your receipt" required maxLength={120} />
          <p className="mt-1.5 text-xs text-bone-500">Enter the transaction reference only. Never enter a PIN or OTP.</p>
        </div>

        {formError ? <p role="alert" className="rounded-xl border border-crimson-700/70 bg-crimson-950/50 p-3 text-sm leading-relaxed text-crimson-200">{formError}</p> : null}

        <button type="button" onClick={placeOrder} disabled={busy} className="btn btn-primary w-full justify-center">{busy ? 'Preparing summary…' : 'Place order & continue'}</button>
        <p className="text-xs leading-relaxed text-bone-500">After you continue, copy the summary on the next screen. Message us on WhatsApp, Telegram or Discord; paste the summary and attach your payment screenshot. Your details are not automatically sent to support. Delivery happens only after staff verification.</p>
      </div>
    </div>
  );
}
