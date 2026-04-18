import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  assertBrainApiVersion,
  jsonError,
  logRequestContext,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

export async function GET(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  const email = (new URL(request.url).searchParams.get('email') ?? '').trim().toLowerCase();
  if (!email) {
    return jsonError('validation_error', 'email query parameter is required', 422);
  }

  try {
    const { data: row } = await supabaseAdmin
      .from('customers')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (row) {
      return NextResponse.json({
        customer: {
          id: String(row.id),
          email: row.email,
          name: row.full_name || [row.first_name, row.last_name].filter(Boolean).join(' ') || '',
          phone: row.phone || row.secondary_phone || '',
          total_orders: row.total_orders ?? 0,
          total_spent: Number(row.total_spent ?? 0),
          currency: 'GHS',
          last_order_at: row.last_order_at,
          tags: Array.isArray(row.tags) ? row.tags : [],
        },
      });
    }

    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id, total, created_at')
      .ilike('email', email)
      .order('created_at', { ascending: false });

    if (!orders?.length) {
      return jsonError('not_found', 'Customer not found', 404);
    }

    const total_spent = orders.reduce((s, o: any) => s + Number(o.total ?? 0), 0);

    return NextResponse.json({
      customer: {
        id: `guest:${email}`,
        email,
        name: '',
        phone: '',
        total_orders: orders.length,
        total_spent,
        currency: 'GHS',
        last_order_at: orders[0]?.created_at ?? null,
        tags: [],
      },
    });
  } catch (e: any) {
    console.error('[brain/v1/customer]', e);
    return jsonError('internal', e?.message || 'Failed to load customer', 500);
  }
}
