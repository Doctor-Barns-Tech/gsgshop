'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface RequestItem {
  id: string;
  nameBrand: string;
  qtySizeRange: string;
  remark: string;
  estimatedPrice: string;
  sourceType: string;
}

export default function ShoppingList() {
  const router = useRouter();
  const [items, setItems] = useState<RequestItem[]>([
    { id: '1', nameBrand: '', qtySizeRange: '', remark: '', estimatedPrice: '', sourceType: '' }
  ]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Try to pre-fill user info if logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setContactEmail(session.user.email || '');
        // Fetch profile
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
          if (data) {
            if (data.full_name) setContactName(data.full_name);
            if (data.phone) setContactPhone(data.phone);
          }
        });
      }
    });
  }, []);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), nameBrand: '', qtySizeRange: '', remark: '', estimatedPrice: '', sourceType: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof RequestItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.estimatedPrice) || 0), 0);
  const commission = subtotal * 0.05;
  const total = subtotal + commission;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate
      if (!contactName || !contactPhone || !deliveryAddress) {
        throw new Error('Please fill in all required contact and delivery fields.');
      }
      if (items.some(i => !i.nameBrand || !i.qtySizeRange || !i.estimatedPrice)) {
        throw new Error('Please fill in all required item fields (Name, Qty, Estimated Price).');
      }

      // Create Request
      const res = await fetch('/api/shopper/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          contactName,
          contactPhone,
          contactEmail,
          deliveryAddress: { text: deliveryAddress },
          preferredTime,
          notes,
          subtotalEst: subtotal,
          commission: commission,
          totalEst: total
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request');

      // Redirect to tracking page
      router.push(`/shopper/track?id=${data.id}`);

    } catch (err: any) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gsg-black mb-4">Create Your Shopping List</h1>
          <p className="text-gray-600">List the items you need, and we'll source them for you at market price.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Items Section */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gsg-black mb-6">Items</h2>
            
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={item.id} className="relative p-4 md:p-6 border border-gray-200 rounded-xl bg-gray-50/50">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gsg-purple text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  {items.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Item Name / Brand *</label>
                      <input 
                        type="text" 
                        required
                        value={item.nameBrand}
                        onChange={e => updateItem(item.id, 'nameBrand', e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none"
                        placeholder="e.g. Milo Cereal 500g"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Qty / Size / Range *</label>
                      <input 
                        type="text" 
                        required
                        value={item.qtySizeRange}
                        onChange={e => updateItem(item.id, 'qtySizeRange', e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none"
                        placeholder="e.g. 2 packs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Est. Price (GHS) *</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="0.01"
                        value={item.estimatedPrice}
                        onChange={e => updateItem(item.id, 'estimatedPrice', e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Produce Source</label>
                      <select 
                        value={item.sourceType}
                        onChange={e => updateItem(item.id, 'sourceType', e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none text-sm"
                      >
                        <option value="">N/A</option>
                        <option value="Local Market">Local Market</option>
                        <option value="Imported">Imported</option>
                        <option value="Controlled Environment">Controlled Env.</option>
                      </select>
                    </div>
                    <div className="md:col-span-12">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Remarks / Comments</label>
                      <input 
                        type="text" 
                        value={item.remark}
                        onChange={e => updateItem(item.id, 'remark', e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none"
                        placeholder="Any specific instructions for this item?"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={addItem}
              className="mt-6 flex items-center gap-2 text-gsg-purple font-bold hover:text-gsg-purple-dark transition-colors"
            >
              <i className="ri-add-circle-line text-xl"></i> Add Another Item
            </button>
          </div>

          {/* Contact & Delivery Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gsg-black mb-6">Contact & Delivery</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" required value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email (Optional)</label>
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Address *</label>
                  <textarea required value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none" placeholder="Full address including landmarks"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preferred Delivery Time</label>
                  <input type="text" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none" placeholder="e.g. Tomorrow morning, Today by 5pm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">General Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gsg-purple outline-none"></textarea>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div>
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gsg-black mb-6">Estimate Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal (Est.)</span>
                    <span className="font-medium">GH₵{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Commission (5%)</span>
                    <span className="font-medium">GH₵{commission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm italic">
                    <span>Delivery Fee</span>
                    <span>Calculated later</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm italic">
                    <span>Sourcing Fee</span>
                    <span>If applicable</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gsg-black">
                    <span>Total Estimate</span>
                    <span className="text-gsg-purple">GH₵{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl mb-6 text-sm text-purple-800">
                  <i className="ri-information-line mr-2"></i>
                  This is an estimate. Final prices will be confirmed based on actual market rates. You will be notified if there are significant changes before we proceed.
                </div>

                <button 
                  type="submit" 
                  disabled={loading || items.length === 0}
                  className="w-full bg-gsg-black hover:bg-gsg-purple text-white py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? <i className="ri-loader-4-line animate-spin text-xl"></i> : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
