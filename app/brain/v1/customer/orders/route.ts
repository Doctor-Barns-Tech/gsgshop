import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  assertBrainApiVersion,
  jsonError,
  logRequestContext,
  mapOrderRow,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

export async function GET(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  const { searchParams } = new URL(request.url);
  const email = (searchParams.get('email') ?? '').trim().toLowerCase();
  const limit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit')!, 10)
    : 20;

  if (!email) {
    return jsonError('validation_error', 'email query parameter is required', 422);
  }

  const lim = Math.min(Math.max(Number.isFinite(limit) ? limit : 20, 1), 50);

  try {
    const { data: orderRows, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .ilike('email', email)
      .order('created_at', { ascending: false })
      .limit(lim);

    if (error) throw error;
    const orders = [];
    for (const o of orderRows || []) {
      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select(
          `
          id, product_id, product_name, quantity, unit_price, total_price,
          products(slug, product_images(url, position))
        `
        )
        .eq('order_id', o.id);
      orders.push(await mapOrderRow(o, items || []));
    }

    return NextResponse.json({ orders }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[brain/v1/customer/orders]', e);
    return jsonError('internal', e?.message || 'Failed to load orders', 500);
  }
}
