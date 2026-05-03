import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Paystack — initialize a hosted card payment.
 *
 * Request body: { orderId: string; customerEmail?: string }
 *   - orderId may be either a UUID (orders.id) or our order_number ("ORD-...")
 *
 * SECURITY:
 *   - amount is taken from the database, NEVER from the client
 *   - Paystack expects amount in pesewas (subunit of GHS), so we send total*100
 *   - Currency is locked to GHS
 *
 * On success we persist on orders.metadata:
 *   - payment_method: 'paystack'
 *   - last_payment_ref: <unique reference we sent to Paystack>
 *   - last_payment_attempt_at: ISO timestamp
 *
 * Response: { success: true, url, reference }
 */
export async function POST(req: Request) {
    try {
        const clientId = getClientIdentifier(req);
        const rateLimitResult = checkRateLimit(`payment:${clientId}`, RATE_LIMITS.payment);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimitResult.resetIn.toString(),
                    },
                }
            );
        }

        const body = await req.json().catch(() => ({}));
        const { orderId, customerEmail } = body || {};

        if (!orderId || typeof orderId !== 'string') {
            return NextResponse.json({ success: false, message: 'Missing or invalid orderId' }, { status: 400 });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            console.error('[Paystack] Missing PAYSTACK_SECRET_KEY');
            return NextResponse.json({ success: false, message: 'Payment gateway configuration error' }, { status: 500 });
        }

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
        const orderQuery = supabaseAdmin
            .from('orders')
            .select('id, order_number, total, email, payment_status, metadata');

        const { data: order, error: orderError } = isUuid
            ? await orderQuery.eq('id', orderId).maybeSingle()
            : await orderQuery.eq('order_number', orderId).maybeSingle();

        if (orderError || !order) {
            console.error('[Paystack] Order not found:', orderId, orderError ?? '');
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        if (order.payment_status === 'paid') {
            return NextResponse.json({ success: false, message: 'Order is already paid' }, { status: 400 });
        }

        const amountCedis = Number(order.total);
        if (!Number.isFinite(amountCedis) || amountCedis <= 0) {
            return NextResponse.json({ success: false, message: 'Invalid order amount' }, { status: 400 });
        }
        // Paystack works in subunits — pesewas for GHS.
        const amountPesewas = Math.round(amountCedis * 100);

        const orderRef = order.order_number || orderId;
        const customerEmailFinal = (typeof customerEmail === 'string' && customerEmail) || order.email;
        if (!customerEmailFinal) {
            return NextResponse.json({ success: false, message: 'Missing customer email' }, { status: 400 });
        }

        const requestUrl = new URL(req.url);
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin).replace(/\/+$/, '');

        // Same shape as the Moolre uniqueRef so the rest of the system (webhook
        // strip-suffix logic, /verify candidate list, etc.) treats both providers
        // uniformly.
        const uniqueRef = `${orderRef}-R${Date.now()}`;

        const payload = {
            email: customerEmailFinal,
            amount: amountPesewas,
            currency: 'GHS',
            reference: uniqueRef,
            // After the customer pays (or cancels) Paystack redirects them here.
            // We add provider=paystack so the success page dispatches to the
            // right /verify endpoint.
            callback_url: `${baseUrl}/order-success?order=${orderRef}&payment_success=true&provider=paystack`,
            // Restrict to card-only since the user surfaces this option as
            // "Card Payments". Mobile money has its own (Moolre) channel.
            channels: ['card'],
            metadata: {
                order_number: orderRef,
                original_order_number: orderRef,
                customer_email: customerEmailFinal,
                custom_fields: [
                    {
                        display_name: 'Order Number',
                        variable_name: 'order_number',
                        value: orderRef,
                    },
                ],
            },
        };

        console.log('[Paystack] Initiating for order:', orderRef, '| Amount (pesewas):', amountPesewas);

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));
        console.log('[Paystack] Init status:', response.status, '| API status:', result?.status, '| Has URL:', !!result?.data?.authorization_url);

        if (response.ok && result?.status === true && result?.data?.authorization_url) {
            // Persist on the order so /verify and the webhook can correlate
            // back to this attempt. Failure here is non-fatal because the
            // redirect URL also carries the reference as a backup.
            try {
                const previousMeta = (order as any).metadata || {};
                await supabaseAdmin
                    .from('orders')
                    .update({
                        metadata: {
                            ...previousMeta,
                            payment_method: 'paystack',
                            last_payment_ref: uniqueRef,
                            last_payment_attempt_at: new Date().toISOString(),
                        },
                        payment_provider: 'paystack',
                    })
                    .eq('id', (order as any).id);
            } catch (metaErr: any) {
                console.warn('[Paystack] Failed to persist last_payment_ref:', metaErr?.message);
            }

            return NextResponse.json({
                success: true,
                url: result.data.authorization_url,
                reference: result.data.reference || uniqueRef,
            });
        }

        const message = result?.message || 'Failed to initialize payment';
        console.error('[Paystack] Init failed:', message, result);
        return NextResponse.json({ success: false, message }, { status: 400 });
    } catch (error: any) {
        console.error('[Paystack] Init error:', error?.message || error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
