import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  assertBrainApiVersion,
  jsonError,
  loadOrderWithItems,
  logRequestContext,
  mapOrderRow,
  siteBaseUrl,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

export async function GET(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  const { searchParams } = new URL(request.url);
  const number = (searchParams.get('number') ?? '').trim();
  const email = (searchParams.get('email') ?? '').trim();

  if (!number || !email) {
    return jsonError('validation_error', 'number and email query parameters are required', 422, {
      fields: { number: number ? undefined : 'required', email: email ? undefined : 'required' },
    });
  }

  try {
    const loaded = await loadOrderWithItems(number, email);
    if (!loaded) {
      return jsonError('not_found', 'Order not found', 404);
    }
    const order = await mapOrderRow(loaded.order, loaded.items);
    return NextResponse.json({ order }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[brain/v1/orders GET]', e);
    return jsonError('internal', e?.message || 'Failed to load order', 500);
  }
}

type IncomingItem = { product_id: string; quantity: number };

export async function POST(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  try {
    const body = await request.json();
    const items: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];
    const customer = body?.customer && typeof body.customer === 'object' ? body.customer : {};
    const email = String(customer.email ?? '').trim().toLowerCase();
    const name = String(customer.name ?? '').trim();
    const phone = String(customer.phone ?? '').trim();
    const shipping_address = body?.shipping_address && typeof body.shipping_address === 'object'
      ? body.shipping_address
      : {};
    const delivery_method = String(body?.delivery_method ?? 'delivery');
    const payment_method = String(body?.payment_method ?? 'momo');
    const notes = String(body?.notes ?? '');
    const source = String(body?.source ?? 'whatsapp_brain');

    if (!email) {
      return jsonError('validation_error', 'customer.email is required', 422, { fields: { 'customer.email': 'required' } });
    }
    if (!items.length) {
      return jsonError('validation_error', 'items is required', 422, { fields: { items: 'required' } });
    }

    for (const item of items) {
      if (!item?.product_id) {
        return jsonError('validation_error', 'Each item must include product_id', 422);
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return jsonError('validation_error', 'Each item quantity must be a positive integer', 422);
      }
    }

    const productIds = items.map((i) => i.product_id);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, quantity, status, slug')
      .in('id', productIds);

    if (productsError) {
      return jsonError('internal', productsError.message, 500);
    }

    const productMap = new Map((products || []).map((p: any) => [p.id, p]));
    const orderItemsPayload: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product || product.status !== 'active') {
        return jsonError('validation_error', `Invalid or inactive product: ${item.product_id}`, 422);
      }
      const stock = Number(product.quantity ?? 0);
      if (stock > 0 && item.quantity > stock) {
        return jsonError('validation_error', `Insufficient stock for product: ${product.name}`, 422);
      }
      const unitPrice = Number(product.price ?? 0);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      orderItemsPayload.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: lineTotal,
        variant_name: null,
        metadata: { source },
      });
    }

    const orderNumber = `SASU-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const base = siteBaseUrl();

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: null,
        email,
        phone: phone || null,
        status: 'pending',
        payment_status: 'pending',
        currency: 'GHS',
        subtotal,
        tax_total: 0,
        shipping_total: 0,
        discount_total: 0,
        total: subtotal,
        shipping_method: delivery_method,
        payment_method,
        payment_provider: 'moolre',
        notes: notes || null,
        shipping_address: {
          ...shipping_address,
          phone: phone || (shipping_address as any).phone,
          full_name: name || (shipping_address as any).full_name,
        },
        billing_address: {
          ...shipping_address,
          phone: phone || (shipping_address as any).phone,
          full_name: name || (shipping_address as any).full_name,
        },
        metadata: {
          source,
          customer_name: name || null,
          brain_v1: true,
        },
      })
      .select('*')
      .single();

    if (orderError || !order) {
      return jsonError('internal', orderError?.message || 'Failed to create order', 500);
    }

    const { error: itemInsertError } = await supabaseAdmin.from('order_items').insert(
      orderItemsPayload.map((i) => ({
        ...i,
        order_id: order.id,
      }))
    );

    if (itemInsertError) {
      return jsonError('internal', itemInsertError.message, 500);
    }

    const loaded = await loadOrderWithItems(order.order_number, email);
    if (!loaded) {
      return jsonError('internal', 'Order created but could not reload', 500);
    }

    const mapped = await mapOrderRow(loaded.order, loaded.items);
    const payUrl = `${base}/order-tracking?order=${encodeURIComponent(order.order_number)}`;

    return NextResponse.json(
      {
        order: mapped,
        payment: {
          required: mapped.payment_status !== 'paid',
          url: payUrl,
          provider: 'on_site',
          expires_at: null,
        },
      },
      { status: 201, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e: any) {
    console.error('[brain/v1/orders POST]', e);
    return jsonError('internal', e?.message || 'Failed to create order', 500);
  }
}
