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
  const [deliveryFeeInput, setDeliveryFeeInput] = useState<string>('');
  const [finalizing, setFinalizing] = useState(false);
  const [finalizeMsg, setFinalizeMsg] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id) fetchRequest(id);
  }, [id]);

  useEffect(() => {
    if (request) {
      setDeliveryFeeInput(String(request.delivery_fee ?? 0));
    }
  }, [request?.id, request?.delivery_fee]);

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

  const callFinalize = async (sendPaymentLink: boolean) => {
    if (!request) return;
    setFinalizing(true);
    setFinalizeMsg(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        setFinalizeMsg('You appear to be signed out — please log in again.');
        return;
      }

      const deliveryFee = parseFloat(deliveryFeeInput);
      const res = await fetch(`/api/shopper/requests/${request.id}/finalize`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          deliveryFee: Number.isFinite(deliveryFee) ? deliveryFee : undefined,
          setStatus: true,
          sendPaymentLink,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to finalise request');
      }
      setFinalizeMsg(
        sendPaymentLink
          ? `Total set at GH₵${Number(data.request.total_final).toFixed(2)} and payment link sent.`
          : `Total set at GH₵${Number(data.request.total_final).toFixed(2)}.`,
      );
      if (id) fetchRequest(id);
    } catch (err: any) {
      setFinalizeMsg(err.message || 'Failed to finalise request');
    } finally {
      setFinalizing(false);
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
              {request.total_final !== null && request.total_final !== undefined && (
                <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-base text-green-700">
                  <span>Final Total</span>
                  <span>GH₵{Number(request.total_final).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {request.payment_status !== 'paid' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Payment</h2>
              <p className="text-xs text-gray-500 mb-4">
                Once you've entered the actual market prices on each item, set the delivery fee
                (if any) and send the customer a payment link. The total is recomputed from
                items + 5% commission + delivery fee.
              </p>

              <label className="text-xs text-gray-500 block mb-1">Delivery Fee (GHS)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={deliveryFeeInput}
                onChange={(e) => setDeliveryFeeInput(e.target.value)}
                disabled={finalizing}
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500 text-sm mb-4"
                placeholder="0.00"
              />

              {finalizeMsg && (
                <div className={`text-xs p-2 rounded-lg mb-3 ${finalizeMsg.startsWith('Total set') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {finalizeMsg}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => callFinalize(false)}
                  disabled={finalizing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {finalizing ? 'Saving…' : 'Recompute & save total'}
                </button>
                <button
                  type="button"
                  onClick={() => callFinalize(true)}
                  disabled={finalizing}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                >
                  {finalizing ? 'Sending…' : 'Save total & send payment link'}
                </button>
                {request.request_number && (
                  <a
                    href={`/shopper/pay/${request.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-purple-700 hover:underline text-center mt-1"
                  >
                    Open customer pay page ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {request.payment_status === 'paid' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-sm text-green-800">
              <i className="ri-checkbox-circle-fill mr-1" /> Paid in full — total
              GH₵{Number(request.total_final ?? request.total_est ?? 0).toFixed(2)}
              {request.payment_provider && ` via ${request.payment_provider}`}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
