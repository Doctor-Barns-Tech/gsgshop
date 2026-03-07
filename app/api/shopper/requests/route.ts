import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      items, contactName, contactPhone, contactEmail, 
      deliveryAddress, preferredTime, notes, 
      subtotalEst, commission, totalEst 
    } = body;

    // Optional auth
    const authResult = await verifyAuth(request);
    const userId = authResult.authenticated && authResult.user ? authResult.user.id : null;

    // 1. Create Request
    const { data: requestData, error: requestError } = await supabaseAdmin
      .from('shopper_requests')
      .insert({
        user_id: userId,
        status: 'SUBMITTED',
        subtotal_est: subtotalEst,
        commission: commission,
        total_est: totalEst,
        notes: notes,
        delivery_address: deliveryAddress,
        preferred_time: preferredTime,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail
      })
      .select('id')
      .single();

    if (requestError) throw requestError;

    // 2. Create Items
    const itemsToInsert = items.map((item: any) => ({
      request_id: requestData.id,
      name_brand: item.nameBrand,
      qty_size_range: item.qtySizeRange,
      remark: item.remark,
      estimated_price: parseFloat(item.estimatedPrice) || 0,
      source_type: item.sourceType || null
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('shopper_request_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // 3. Create initial status history
    await supabaseAdmin
      .from('shopper_status_history')
      .insert({
        request_id: requestData.id,
        status: 'SUBMITTED',
        note: 'Request submitted by customer',
        created_by: userId
      });

    return NextResponse.json({ id: requestData.id, success: true });

  } catch (error: any) {
    console.error('Shopper Request Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit request' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone');

    let query = supabaseAdmin
      .from('shopper_requests')
      .select(`
        *,
        items:shopper_request_items(*),
        history:shopper_status_history(*)
      `)
      .order('created_at', { ascending: false });

    if (id) {
      query = query.eq('id', id);
    } else if (phone) {
      query = query.eq('contact_phone', phone);
    } else {
      // Require admin to list all
      const authResult = await verifyAuth(request, { requireAdmin: true });
      if (!authResult.authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(id ? data[0] : data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
