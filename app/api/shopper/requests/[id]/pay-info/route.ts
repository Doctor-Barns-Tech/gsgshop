import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Public read for the shopper pay page.
 *
 * GET /api/shopper/requests/[id]/pay-info
 *
 * Returns just the bits the pay page needs to render:
 *   request_number, total_final, payment_status, status,
 *   contact_email, contact_name, items (name + final price)
 *
 * No PII beyond what the customer already entered.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SELECT_COLUMNS =
    'id, request_number, total_final, total_est, markup, delivery_fee, payment_status, status, contact_email, contact_name, items:shopper_request_items(id, name_brand, qty_size_range, market_price, estimated_price)';

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // We accept either a UUID (the row's primary key, used in /pay/[id]) OR an
    // SR-... request_number (echoed back in the gateway redirect URL).
    // We cannot use .or() with both filters at once because PostgREST will try
    // to cast the SR-... value to uuid for the id.eq.<...> comparison and 500.
    const filterColumn = UUID_RE.test(id) ? 'id' : 'request_number';

    const { data, error } = await supabaseAdmin
        .from('shopper_requests')
        .select(SELECT_COLUMNS)
        .eq(filterColumn, id)
        .maybeSingle();

    if (error || !data) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({
        id: data.id,
        request_number: data.request_number,
        status: data.status,
        payment_status: data.payment_status,
        total_final: data.total_final !== null ? Number(data.total_final) : null,
        total_est: data.total_est !== null ? Number(data.total_est) : null,
        markup: Number(data.markup ?? 0),
        delivery_fee: Number(data.delivery_fee ?? 0),
        contact_email: data.contact_email,
        contact_name: data.contact_name,
        items: (data.items || []).map((it: any) => ({
            id: it.id,
            name_brand: it.name_brand,
            qty_size_range: it.qty_size_range,
            price: it.market_price !== null && it.market_price !== undefined
                ? Number(it.market_price)
                : Number(it.estimated_price),
        })),
    });
}
