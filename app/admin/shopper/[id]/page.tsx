'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminShopperRequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id) fetchRequest(id);
  }, [id]);

  const fetchRequest = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('shopper_requests')
        .select(`
          *,
          items:shopper_request_items(*),
          history:shopper_status_history(*)
        `)
        .eq('id', requestId)
        .single();

      if (error) throw error;
      setRequest(data);
    } catch (err) {
      console.error('Error fetching request:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('shopper_requests')
        .update({ status: newStatus })
        .eq('id', request.id);

      if (error) throw error;

      await supabase.from('shopper_status_history').insert({
        request_id: request.id,
        status: newStatus,
        note: `Status updated to ${newStatus} by admin`
      });

      if (id) fetchRequest(id);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const updateItemMarketPrice = async (itemId: string, price: string) => {
    try {
      const { error } = await supabase
        .from('shopper_request_items')
        .update({ market_price: parseFloat(price) || 0 })
        .eq('id', itemId);

      if (error) throw error;
      
      // Update local state optimistic
      setRequest((prev: any) => ({
        ...prev,
        items: prev.items.map((item: any) => 
          item.id === itemId ? { ...item, market_price: parseFloat(price) || 0 } : item
        )
      }));
    } catch (err) {
      console.error('Error updating price:', err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!request) return <div className="p-8">Request not found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900 mb-2 flex items-center gap-1 text-sm">
            <i className="ri-arrow-left-line"></i> Back to Requests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
          <p className="text-gray-500 font-mono text-sm mt-1">{request.id}</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={request.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={saving}
            className="p-2 border border-gray-300 rounded-lg outline-none font-bold bg-white"
          >
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="REVIEWING">REVIEWING</option>
            <option value="SOURCING">SOURCING</option>
            <option value="AWAITING_CONFIRMATION">AWAITING CONFIRMATION</option>
            <option value="PAID">PAID</option>
            <option value="SHOPPING">SHOPPING</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Requested Items</h2>
            <div className="space-y-4">
              {request.items?.map((item: any) => (
                <div key={item.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name_brand}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.qty_size_range}</p>
                    {item.source_type && <p className="text-xs text-purple-600 mt-1">Source: {item.source_type}</p>}
                    {item.remark && <p className="text-sm text-gray-500 mt-2 italic">"{item.remark}"</p>}
                  </div>
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <div>
                      <label className="text-xs text-gray-500 block">Est. Price</label>
                      <div className="font-medium">GH₵{item.estimated_price}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block font-bold text-purple-700">Actual Market Price</label>
                      <input 
                        type="number" 
                        defaultValue={item.market_price || ''}
                        onBlur={(e) => updateItemMarketPrice(item.id, e.target.value)}
                        className="w-full p-2 border border-purple-200 rounded outline-none focus:border-purple-500 text-sm"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block">Name</span>
                <span className="font-medium text-gray-900">{request.contact_name}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Phone</span>
                <span className="font-medium text-gray-900">{request.contact_phone}</span>
              </div>
              {request.contact_email && (
                <div>
                  <span className="text-gray-500 block">Email</span>
                  <span className="font-medium text-gray-900">{request.contact_email}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500 block">Delivery Address</span>
                <span className="font-medium text-gray-900">{request.delivery_address?.text}</span>
              </div>
              {request.preferred_time && (
                <div>
                  <span className="text-gray-500 block">Preferred Time</span>
                  <span className="font-medium text-gray-900">{request.preferred_time}</span>
                </div>
              )}
              {request.notes && (
                <div>
                  <span className="text-gray-500 block">Notes</span>
                  <span className="font-medium text-gray-900">{request.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Financials</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Subtotal</span>
                <span className="font-medium">GH₵{request.subtotal_est}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Commission (5%)</span>
                <span className="font-medium">GH₵{request.commission}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-base">
                <span>Est. Total</span>
                <span className="text-purple-700">GH₵{request.total_est}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">To update final totals, edit the market prices on the items. (Auto-calc coming soon)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
