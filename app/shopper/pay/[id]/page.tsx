'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

type PayInfo = {
  id: string;
  request_number: string;
  status: string;
  payment_status: string;
  total_final: number | null;
  total_est: number | null;
  markup: number;
  delivery_fee: number;
  contact_name: string | null;
  contact_email: string | null;
  items: Array<{
    id: string;
    name_brand: string;
    qty_size_range: string;
    price: number;
  }>;
};

type PaymentMethod = 'moolre' | 'paystack';

const paymentOptions: Array<{
  value: PaymentMethod;
  label: string;
  desc: string;
  icon: string;
  badges: string[];
}> = [
  {
    value: 'moolre',
    label: 'Mobile Money',
    desc: 'Pay with MTN MoMo, AirtelTigo Money, or Vodafone Cash.',
    icon: 'ri-smartphone-line',
    badges: ['MTN', 'AirtelTigo', 'Vodafone'],
  },
  {
    value: 'paystack',
    label: 'Card Payments',
    desc: 'Pay securely with your debit or credit card via Paystack.',
    icon: 'ri-bank-card-line',
    badges: ['Visa', 'Mastercard', 'Verve'],
  },
];

export default function ShopperPayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [info, setInfo] = useState<PayInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('moolre');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/shopper/requests/${id}/pay-info`);
        const data = await res.json();
        if (!active) return;
        if (!res.ok) {
          setError(data.error || 'Could not load request');
        } else {
          setInfo(data);
        }
      } catch (e: any) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const handlePay = async () => {
    if (!info) return;
    if (info.payment_status === 'paid') {
      router.push(`/track?id=${info.id}`);
      return;
    }
    if (info.total_final === null || info.total_final <= 0) {
      setError('This request is not yet ready for payment. Our team is finalising the prices.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const endpoint =
        paymentMethod === 'paystack' ? '/api/payment/paystack' : '/api/payment/moolre';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: info.request_number,
          customerEmail: info.contact_email || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to start payment');
      }
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gsg-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !info) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <i className="ri-error-warning-line text-4xl text-red-500 mb-3 block" />
          <h1 className="text-2xl font-bold text-gsg-black mb-2">We couldn't open that request</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a href="/track" className="inline-block bg-gsg-purple text-white px-6 py-3 rounded-xl font-bold">
            Track another request
          </a>
        </div>
      </div>
    );
  }

  if (!info) return null;

  const itemsSubtotal = info.items.reduce((s, it) => s + (Number.isFinite(it.price) ? it.price : 0), 0);
  const total = info.total_final ?? 0;
  const isPayable = info.payment_status !== 'paid' && total > 0;
  const alreadyPaid = info.payment_status === 'paid';

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gsg-black mb-2">Confirm & Pay</h1>
          <p className="text-gray-600">
            Request <span className="font-mono">{info.request_number}</span>
          </p>
        </div>

        {alreadyPaid && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-6 text-center">
            <i className="ri-checkbox-circle-fill mr-2" />
            This request has already been paid. <a href={`/track?id=${info.id}`} className="font-bold underline">Track it here.</a>
          </div>
        )}

        {!alreadyPaid && info.total_final === null && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl mb-6 text-center">
            <i className="ri-time-line mr-2" />
            Your final total isn't ready yet. We'll send you the link to pay as soon as our team finalises market prices.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Items summary */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-gsg-black mb-4 flex items-center gap-2">
            <i className="ri-shopping-bag-line text-gsg-purple" />
            Items
          </h2>
          <ul className="divide-y divide-gray-100">
            {info.items.map((it) => (
              <li key={it.id} className="py-3 flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-gsg-black">{it.name_brand}</p>
                  <p className="text-gray-500">{it.qty_size_range}</p>
                </div>
                <div className="text-right text-gsg-black font-medium whitespace-nowrap">
                  GH₵{it.price.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items subtotal</span>
              <span>GH₵{itemsSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Markup</span>
              <span>GH₵{info.markup.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>{info.delivery_fee > 0 ? `GH₵${info.delivery_fee.toFixed(2)}` : 'Free'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gsg-black pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-gsg-purple">
                {info.total_final !== null ? `GH₵${info.total_final.toFixed(2)}` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        {isPayable && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gsg-black mb-1 flex items-center gap-2">
              <i className="ri-secure-payment-line text-gsg-purple" />
              Payment Method
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Choose how you'd like to pay. You'll be redirected to a secure page to complete payment.
            </p>
            <div className="space-y-3">
              {paymentOptions.map((opt) => {
                const selected = paymentMethod === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-start justify-between gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selected
                        ? 'border-gsg-purple bg-purple-50'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selected ? 'border-gsg-purple' : 'border-gray-300'
                        }`}
                      >
                        {selected && <div className="w-2.5 h-2.5 rounded-full bg-gsg-purple" />}
                      </div>
                      <input
                        type="radio"
                        name="payment-method"
                        value={opt.value}
                        checked={selected}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="hidden"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <i className={`${opt.icon} text-lg ${selected ? 'text-gsg-purple' : 'text-gray-500'}`} />
                          <p className={`font-bold ${selected ? 'text-gsg-purple' : 'text-gsg-black'}`}>{opt.label}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{opt.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {opt.badges.map((b) => (
                            <span
                              key={b}
                              className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              onClick={handlePay}
              disabled={submitting}
              className="mt-8 w-full bg-gsg-black hover:bg-gsg-purple text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'paystack' ? 'Pay with Card' : 'Pay with Mobile Money'}{' '}
                    — GH₵{total.toFixed(2)}
                  </span>
                  <i className="ri-secure-payment-line" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
