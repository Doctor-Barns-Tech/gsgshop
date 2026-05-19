'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const STATUS_ORDER = [
  'SUBMITTED',
  'PAID',
  'REVIEWING',
  'SOURCING',
  'AWAITING_CONFIRMATION',
  'SHOPPING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
] as const;

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-gray-100 text-gray-800',
  PAID: 'bg-green-100 text-green-800',
  REVIEWING: 'bg-blue-100 text-blue-800',
  SOURCING: 'bg-purple-100 text-purple-800',
  AWAITING_CONFIRMATION: 'bg-yellow-100 text-yellow-800',
  SHOPPING: 'bg-indigo-100 text-indigo-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-teal-100 text-teal-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-purple-50 text-purple-700 border-purple-200',
};

const PAYMENT_ICONS: Record<string, string> = {
  pending: 'ri-time-line',
  paid: 'ri-checkbox-circle-fill',
  failed: 'ri-close-circle-fill',
  refunded: 'ri-refund-2-line',
};

const fmtGHS = (n: number | string | null | undefined) => {
  const v = Number(n);
  return Number.isFinite(v) ? `GH₵${v.toFixed(2)}` : '—';
};

export default function AdminShopperRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, paymentFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('shopper_requests')
        .select('id, request_number, status, payment_status, payment_provider, payment_method, paid_at, total_est, total_final, contact_name, contact_phone, contact_email, created_at')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'ALL') query = query.eq('status', statusFilter);
      if (paymentFilter !== 'ALL') query = query.eq('payment_status', paymentFilter);

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Counts for the quick filter chips at the top
  const [counts, setCounts] = useState<{ all: number; paid: number; pending: number; cancelled: number; awaiting: number }>({ all: 0, paid: 0, pending: 0, cancelled: 0, awaiting: 0 });
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('shopper_requests')
        .select('status, payment_status');
      if (!data) return;
      setCounts({
        all: data.length,
        paid: data.filter(r => r.payment_status === 'paid').length,
        pending: data.filter(r => r.payment_status === 'pending').length,
        cancelled: data.filter(r => r.status === 'CANCELLED').length,
        awaiting: data.filter(r => r.status === 'AWAITING_CONFIRMATION').length,
      });
    })();
  }, [requests.length]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personal Shopper Requests</h1>
          <p className="text-gray-500 mt-1">Manage custom shopping lists and track payments</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <button
          onClick={() => { setStatusFilter('ALL'); setPaymentFilter('ALL'); }}
          className={`text-left bg-white rounded-xl border p-4 hover:border-gray-400 transition-colors ${statusFilter === 'ALL' && paymentFilter === 'ALL' ? 'border-gray-900' : 'border-gray-200'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{counts.all}</p>
        </button>
        <button
          onClick={() => { setStatusFilter('ALL'); setPaymentFilter('paid'); }}
          className={`text-left bg-white rounded-xl border p-4 hover:border-emerald-400 transition-colors ${paymentFilter === 'paid' ? 'border-emerald-500' : 'border-gray-200'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Paid</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{counts.paid}</p>
        </button>
        <button
          onClick={() => { setStatusFilter('ALL'); setPaymentFilter('pending'); }}
          className={`text-left bg-white rounded-xl border p-4 hover:border-amber-400 transition-colors ${paymentFilter === 'pending' ? 'border-amber-500' : 'border-gray-200'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Awaiting payment</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{counts.pending}</p>
        </button>
        <button
          onClick={() => { setStatusFilter('AWAITING_CONFIRMATION'); setPaymentFilter('ALL'); }}
          className={`text-left bg-white rounded-xl border p-4 hover:border-yellow-500 transition-colors ${statusFilter === 'AWAITING_CONFIRMATION' ? 'border-yellow-500' : 'border-gray-200'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-700">Awaiting confirmation</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">{counts.awaiting}</p>
        </button>
        <button
          onClick={() => { setStatusFilter('CANCELLED'); setPaymentFilter('ALL'); }}
          className={`text-left bg-white rounded-xl border p-4 hover:border-red-400 transition-colors ${statusFilter === 'CANCELLED' ? 'border-red-500' : 'border-gray-200'}`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-red-600">Cancelled</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{counts.cancelled}</p>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg outline-none text-sm"
            >
              <option value="ALL">All</option>
              {STATUS_ORDER.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Payment</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg outline-none text-sm"
            >
              <option value="ALL">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          {(statusFilter !== 'ALL' || paymentFilter !== 'ALL') && (
            <button
              onClick={() => { setStatusFilter('ALL'); setPaymentFilter('ALL'); }}
              className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
            >
              <i className="ri-close-line" /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <i className="ri-inbox-line text-4xl mb-2 block"></i>
            <p>No requests match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-bold">Request</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Submitted</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Payment</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {requests.map((req) => {
                  const payColor = PAYMENT_COLORS[req.payment_status] || PAYMENT_COLORS.pending;
                  const payIcon = PAYMENT_ICONS[req.payment_status] || PAYMENT_ICONS.pending;
                  const statusColor = STATUS_COLORS[req.status] || STATUS_COLORS.SUBMITTED;
                  const total = req.total_final ?? req.total_est;
                  const isFinal = req.total_final != null;
                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">
                          {req.request_number || `#${req.id.slice(0, 8)}`}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          {req.id.slice(0, 8)}…
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{req.contact_name}</div>
                        <a
                          href={`tel:${req.contact_phone}`}
                          className="text-xs text-gray-500 hover:text-purple-700 inline-flex items-center gap-1 mt-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="ri-phone-line" /> {req.contact_phone}
                        </a>
                      </td>
                      <td className="p-4 text-gray-600 text-xs">
                        {new Date(req.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {new Date(req.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{fmtGHS(total)}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {isFinal ? 'Final' : 'Estimate'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${payColor}`}>
                          <i className={payIcon} />
                          {(req.payment_status || 'pending').toUpperCase()}
                        </span>
                        {req.payment_status === 'paid' && (
                          <div className="text-[11px] text-emerald-600 mt-1 capitalize">
                            via {req.payment_provider || '—'}
                            {req.paid_at && (
                              <> · {new Date(req.paid_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/shopper/${req.id}`}
                          className="text-purple-700 hover:text-purple-900 font-bold text-xs inline-flex items-center gap-1"
                        >
                          Open <i className="ri-arrow-right-line" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
