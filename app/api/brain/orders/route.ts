import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyBrainBearer } from '../_lib';

type IncomingItem = {
  product_id: string;
  quantity: number;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  const authError = verifyBrainBearer(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const items: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];
    const customerPhone = String(body?.customer_phone ?? '').trim();
    const customerName = String(body?.customer_name ?? '').trim();

    if (!items.length) return badRequest('items is required');
    if (!customerPhone) return badRequest('customer_phone is required');

    for (const item of items) {
      if (!item?.product_id) return badRequest('Each item must include product_id');
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return badRequest('Each item quantity must be a positive integer');
      }
    }

    const productIds = items.map((i) => i.product_id);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, quantity, status')
      .in('id', productIds);

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const productMap = new Map((products || []).map((p: any) => [p.id, p]));
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product || product.status !== 'active') {
        return badRequest(`Invalid or inactive product: ${item.product_id}`);
      }

      const stock = Number(product.quantity ?? 0);
      if (stock > 0 && item.quantity > stock) {
        return badRequest(`Insufficient stock for product: ${product.name}`);
      }

      const unitPrice = Number(product.price ?? 0);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: lineTotal,
        variant_name: null,
        metadata: { source: 'whatsapp' },
      });
    }

    const total = subtotal;
    const orderNumber = `BRAIN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const syntheticEmail = `brain-${customerPhone.replace(/[^\d]/g, '') || Date.now()}@orders.local`;

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: null,
        email: syntheticEmail,
        phone: customerPhone,
        status: 'pending',
        payment_status: 'pending',
        currency: 'GHS',
        subtotal,
        tax_total: 0,
        shipping_total: 0,
        discount_total: 0,
        total,
        shipping_method: 'whatsapp',
        payment_method: 'pending',
        shipping_address: { phone: customerPhone },
        billing_address: { phone: customerPhone },
        metadata: {
          source: 'whatsapp',
          customer_name: customerName || null,
        },
      })
      .select('id, total, status, order_number')
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const { error: itemInsertError } = await supabaseAdmin.from('order_items').insert(
      orderItems.map((i) => ({
        ...i,
        order_id: order.id,
      }))
    );

    if (itemInsertError) {
      return NextResponse.json({ error: itemInsertError.message }, { status: 500 });
    }

    return NextResponse.json({
      order_id: order.id,
      total: Number(order.total),
      status: order.status,
      items: orderItems.map((i) => ({
        product_id: i.product_id,
        name: i.product_name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create order' }, { status: 500 });
  }
}
