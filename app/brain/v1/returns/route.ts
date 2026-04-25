import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  assertBrainApiVersion,
  jsonError,
  logRequestContext,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

export async function POST(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  try {
    const body = await request.json();
    const order_id = body?.order_id ? String(body.order_id) : '';
    const order_number = String(body?.order_number ?? '').trim();
    const email = String(body?.customer_email ?? body?.email ?? '').trim().toLowerCase();
    const reason = String(body?.reason ?? '').trim();
    const description = String(body?.description ?? '').trim();

    if (!email) {
      return jsonError('validation_error', 'customer_email (or email) is required', 422);
    }
    if (!reason) {
      return jsonError('validation_error', 'reason is required', 422);
    }
    if (!order_id && !order_number) {
      return jsonError('validation_error', 'order_id or order_number is required', 422);
    }

    let order: any = null;
    if (order_id) {
      const { data } = await supabaseAdmin.from('orders').select('*').eq('id', order_id).maybeSingle();
      order = data;
    } else if (order_number) {
      const { data } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('order_number', order_number)
        .maybeSingle();
      order = data;
    }

    if (!order) {
      return jsonError('not_found', 'Order not found', 404);
    }

    if (email && String(order.email).toLowerCase() !== email) {
      return jsonError('validation_error', 'Email does not match order', 422);
    }

    const { data: ret, error } = await supabaseAdmin
      .from('return_requests')
      .insert({
        order_id: order.id,
        user_id: null,
        reason,
        description: description || null,
        status: 'pending',
      })
      .select('id, order_id, reason, description, status, created_at')
      .single();

    if (error || !ret) {
      return jsonError('internal', error?.message || 'Failed to create return', 500);
    }

    return NextResponse.json(
      {
        return: {
          id: String(ret.id),
          order_id: String(ret.order_id),
          reason: ret.reason,
          description: ret.description,
          status: ret.status,
          created_at: ret.created_at,
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error('[brain/v1/returns]', e);
    return jsonError('internal', e?.message || 'Failed to initiate return', 500);
  }
}
