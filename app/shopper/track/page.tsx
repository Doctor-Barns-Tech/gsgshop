'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const STATUS_STEPS = [
  'SUBMITTED', 'REVIEWING', 'SOURCING', 'AWAITING_CONFIRMATION', 'PAID', 'SHOPPING', 'OUT_FOR_DELIVERY', 'DELIVERED'
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [searchId, setSearchId] = useState(initialId);
  const [searchPhone, setSearchPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (initialId) {
      handleSearch(new Event('submit') as any, initialId, '');
    }
  }, [initialId]);

  const handleSearch = async (e: React.FormEvent, id = searchId, phone = searchPhone) => {
    e.preventDefault();
    if (!id && !phone) return;

    setLoading(true);
    setError('');
    setRequests([]);

    try {
      const query = new URLSearchParams();
      if (id) query.append('id', id);
      if (phone) query.append('phone', phone);

      const res = await fetch(`/api/shopper/requests?${query.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch tracking info');

      if (Array.isArray(data)) {
        setRequests(data);
        if (data.length === 0) setError('No requests found for this phone number.');
      } else if (data) {
        setRequests([data]);
      } else {
        setError('Request not found.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gsg-black py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/shopper/shopper_image_3.webp"
            alt="Track your shopping request"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 z-[1]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-6 ring-1 ring-white/30 shadow-lg">
            <i className="ri-map-pin-line text-gsg-accent" />
            <span>Live Updates</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">Track Your Request</h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Enter your Request ID or Phone Number to check the status of your shopping list in real-time.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-5 items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-hashtag text-gray-400 text-xl" />
              </div>
              <input 
                type="text" 
                placeholder="Request ID (e.g. 123e4567-...)" 
                value={searchId}
                onChange={e => { setSearchId(e.target.value); setSearchPhone(''); }}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gsg-purple focus:border-transparent outline-none transition-all text-gray-800 text-base"
              />
            </div>
            
            <div className="flex items-center justify-center shrink-0">
              <span className="bg-gray-100 text-gray-500 text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">OR</span>
            </div>
            
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-phone-line text-gray-400 text-xl" />
              </div>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={searchPhone}
                onChange={e => { setSearchPhone(e.target.value); setSearchId(''); }}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gsg-purple focus:border-transparent outline-none transition-all text-gray-800 text-base"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || (!searchId && !searchPhone)}
              className="w-full md:w-auto bg-gsg-black hover:bg-gsg-purple text-white px-10 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:bg-gsg-black flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 shrink-0 text-base"
            >
              {loading ? (
                <i className="ri-loader-4-line animate-spin text-xl" />
              ) : (
                <>
                  <i className="ri-search-line text-lg" />
                  Track
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100 text-center">
            {error}
          </div>
        )}

        {requests.map(req => {
          const currentStepIndex = STATUS_STEPS.indexOf(req.status);
          
          return (
            <div key={req.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Request ID</p>
                  <p className="font-mono font-medium text-gsg-black">{req.id}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-500 mb-1">Date Submitted</p>
                  <p className="font-medium text-gsg-black">{new Date(req.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative mb-12">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
                  <div style={{ width: `${Math.max(5, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gsg-purple transition-all duration-500"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 px-1">
                  <span>Submitted</span>
                  <span>Sourcing</span>
                  <span>Paid</span>
                  <span>Delivered</span>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gsg-purple mb-2">{req.status.replace(/_/g, ' ')}</h3>
                <p className="text-gray-600">
                  {req.status === 'SUBMITTED' && "We've received your list and will review it shortly."}
                  {req.status === 'REVIEWING' && "We are currently reviewing your items."}
                  {req.status === 'SOURCING' && "We are checking market prices for your items."}
                  {req.status === 'AWAITING_CONFIRMATION' && "Please review the final prices and confirm your order."}
                  {req.status === 'PAID' && "Payment received! We will start shopping soon."}
                  {req.status === 'SHOPPING' && "Our personal shopper is currently getting your items."}
                  {req.status === 'OUT_FOR_DELIVERY' && "Your items are on the way to you!"}
                  {req.status === 'DELIVERED' && "Your order has been delivered. Enjoy!"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gsg-black mb-4">Items Summary</h4>
                <ul className="space-y-3 mb-6">
                  {req.items?.map((item: any) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.qty_size_range} x {item.name_brand}</span>
                      <span className="font-medium text-gray-900">GH₵{item.market_price || item.estimated_price}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                  <span>{req.total_final ? 'Total Due' : 'Total Estimate'}</span>
                  <span className="text-gsg-purple">GH₵{(req.total_final ?? req.total_est ?? 0)}</span>
                </div>
              </div>

              {req.status === 'AWAITING_CONFIRMATION' && req.payment_status !== 'paid' && req.total_final && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-yellow-900 mb-1">Ready to confirm your order?</h4>
                    <p className="text-sm text-yellow-800">We've finalised market prices. Pay now and we'll start shopping.</p>
                  </div>
                  <Link
                    href={`/pay/${req.id}`}
                    className="bg-gsg-black hover:bg-gsg-purple text-white px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap text-center inline-flex items-center justify-center gap-2"
                  >
                    <i className="ri-secure-payment-line" />
                    Pay GH₵{Number(req.total_final).toFixed(2)}
                  </Link>
                </div>
              )}

              {req.payment_status === 'paid' && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4 text-center text-sm text-green-800">
                  <i className="ri-checkbox-circle-fill mr-1" /> Payment received — your shopper is on it.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gsg-purple border-t-transparent rounded-full animate-spin"></div></div>}>
      <TrackContent />
    </Suspense>
  );
}
