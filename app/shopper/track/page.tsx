'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gsg-black mb-4">Track Your Request</h1>
          <p className="text-gray-600">Enter your Request ID or Phone Number to check the status.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Request ID (e.g. 123e4567-...)" 
              value={searchId}
              onChange={e => { setSearchId(e.target.value); setSearchPhone(''); }}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none"
            />
            <div className="flex items-center justify-center text-gray-400 font-medium">OR</div>
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={searchPhone}
              onChange={e => { setSearchPhone(e.target.value); setSearchId(''); }}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none"
            />
            <button 
              type="submit" 
              disabled={loading || (!searchId && !searchPhone)}
              className="bg-gsg-black hover:bg-gsg-purple text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
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
                  <span>Total Estimate</span>
                  <span className="text-gsg-purple">GH₵{req.total_est}</span>
                </div>
              </div>
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
