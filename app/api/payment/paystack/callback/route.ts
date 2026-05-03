import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendOrderConfirmation } from '@/lib/notifications';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Paystack webhook.
 *
 * https://paystack.com/docs/payments/webhooks/
 *
 * Paystack sends a JSON body with:
 *   {
 *     event: "charge.success" | "charge.failed" | ...,
 *     data: {
 *       id, reference, amount, currency, status, customer, metadata, ...
 *     }
 *   }
 *
 * It signs the **raw** request body with HMAC-SHA512 using your secret key
 * and sends the hex digest as the `x-paystack-signature` header.
 *
 * SECURITY: We MUST verify the signature against the raw bytes before
 * trusting anything in the payload. The signature is the only proof the
 * webhook actually came from Paystack and was not tampered with.
 *
 * Configure the webhook URL in your Paystack dashboard:
 *   https://<your-host>/api/payment/paystack/callback
 */
export async function POST(req: Request) {
    console.log('[Paystack/Callback] POST received at', new Date().toISOString());

    try {
        const clientId = getClientIdentifier(req);
        const rateLimitResult = checkRateLimit(`callback:${clientId}`, RATE_LIMITS.callback);
        if (!rateLimitResult.success) {
            console.warn('[Paystack/Callback] Rate limited:', clientId);
            return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            console.error('[Paystack/Callback] PAYSTACK_SECRET_KEY not configured — rejecting');
            return NextResponse.json({ success: false, message: 'Webhook not configured' }, { status: 500 });
        }

        // Read raw body once for signature verification — must be the exact
        // bytes Paystack signed.
        const rawBody = await req.text();
        const signature = req.headers.get('x-paystack-signature') || '';

        const expectedSignature = crypto
            .createHmac('sha512', secretKey)
            .update(rawBody)
            .digest('hex');

        if (!signature || !timingSafeEqual(signature, expectedSignature)) {
            console.error('[Paystack/Callback] Invalid signature — rejecting');
            return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
        }

        let body: any;
        try {
            body = JSON.parse(rawBody);
        } catch {
            console.error('[Paystack/Callback] Invalid JSON body');
            return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 });
        }

        const event = body?.event;
        const data = body?.data || {};

        console.log('[Paystack/Callback] Event:', event, '| Reference:', data?.reference, '| Status:', data?.status);

        // Resolve the order. We sent metadata.order_number at init time;
        // fall back to stripping the retry suffix off the reference if not.
        const metaOrderNumber: string | undefined =
            data?.metadata?.order_number || data?.metadata?.original_order_number;
        const refOrderNumber: string | undefined = data?.reference
            ? String(data.reference).replace(/-R\d+$/, '')
            : undefined;
        const merchantOrderRef = metaOrderNumber || refOrderNumber;

        if (!merchantOrderRef) {
            console.error('[Paystack/Callback] Missing order reference. Body:', JSON.stringify(body).slice(0, 500));
            // Always 200 so Paystack doesn't keep retrying a malformed payload.
            return NextResponse.json({ success: false, message: 'Missing order reference' });
        }

        if (event === 'charge.success' && data?.status === 'success') {
            const { data: existingOrder, error: fetchError } = await supabaseAdmin
                .from('orders')
                .select('id, order_number, payment_status, total, metadata')
                .eq('order_number', merchantOrderRef)
                .single();

            if (fetchError || !existingOrder) {
                console.error('[Paystack/Callback] Order not found:', merchantOrderRef);
                return NextResponse.json({ success: false, message: 'Order not found' });
            }

            if (existingOrder.payment_status === 'paid') {
                console.log('[Paystack/Callback] Order already paid — idempotent ack:', merchantOrderRef);
                return NextResponse.json({ success: true, message: 'Order already processed' });
            }

            // Reject the webhook if it targets an order that was clearly
            // initiated against a different provider — defensive against
            // mis-routed/stale events.
            if (
                existingOrder.metadata?.payment_method &&
                existingOrder.metadata.payment_method !== 'paystack'
            ) {
                console.error(
                    '[Paystack/Callback] Provider mismatch — order is',
                    existingOrder.metadata.payment_method,
                    'not paystack:',
                    merchantOrderRef
                );
                return NextResponse.json({ success: false, message: 'Provider mismatch' });
            }

            // Currency / amount integrity
            if (data.currency && String(data.currency).toUpperCase() !== 'GHS') {
                console.error('[Paystack/Callback] CURRENCY MISMATCH:', data.currency, 'for', merchantOrderRef);
                return NextResponse.json({ success: false, message: 'Currency mismatch' }, { status: 400 });
            }
            if (data.amount !== undefined && data.amount !== null) {
                const paidPesewas = Number(data.amount);
                const expectedPesewas = Math.round(Number(existingOrder.total) * 100);
                if (Number.isFinite(paidPesewas) && Math.abs(paidPesewas - expectedPesewas) > 1) {
                    console.error(
                        '[Paystack/Callback] AMOUNT MISMATCH — REJECTING! Expected pesewas:',
                        expectedPesewas,
                        'Got:',
                        paidPesewas,
                        'Order:',
                        merchantOrderRef
                    );
                    return NextResponse.json(
                        { success: false, message: 'Payment amount does not match order total' },
                        { status: 400 }
                    );
                }
            }

            const paystackTxnId = String(data.id || data.reference || 'paystack-callback');

            const { data: orderJson, error: updateError } = await supabaseAdmin.rpc('mark_order_paid', {
                order_ref: merchantOrderRef,
                moolre_ref: paystackTxnId,
            });

            if (updateError) {
                console.error('[Paystack/Callback] RPC Error:', updateError.message);
                return NextResponse.json({ success: false, message: 'Database update failed' }, { status: 500 });
            }

            try {
                await supabaseAdmin
                    .from('orders')
                    .update({
                        payment_provider: 'paystack',
                        payment_transaction_id: paystackTxnId,
                    })
                    .eq('order_number', merchantOrderRef);
            } catch (tagErr: any) {
                console.warn('[Paystack/Callback] Failed to tag provider columns:', tagErr?.message);
            }

            try {
                if (orderJson?.email) {
                    await supabaseAdmin.rpc('update_customer_stats', {
                        p_customer_email: orderJson.email,
                        p_order_total: orderJson.total,
                    });
                }
            } catch (statsError: any) {
                console.error('[Paystack/Callback] Customer stats failed:', statsError.message);
            }

            try {
                if (orderJson) await sendOrderConfirmation(orderJson);
                console.log('[Paystack/Callback] Notifications sent for:', merchantOrderRef);
            } catch (notifyError: any) {
                console.error('[Paystack/Callback] Notification failed:', notifyError.message);
            }

            return NextResponse.json({ success: true, message: 'Payment verified and order updated' });
        }

        if (event === 'charge.failed') {
            console.log(`[Paystack/Callback] Payment FAILED for ${merchantOrderRef} | gateway response:`, data?.gateway_response);
            try {
                const { data: existingOrder } = await supabaseAdmin
                    .from('orders')
                    .select('metadata, payment_status')
                    .eq('order_number', merchantOrderRef)
                    .single();

                if (existingOrder && existingOrder.payment_status !== 'paid') {
                    const previousMeta = (existingOrder as any).metadata || {};
                    await supabaseAdmin
                        .from('orders')
                        .update({
                            payment_status: 'failed',
                            metadata: {
                                ...previousMeta,
                                paystack_reference: data?.reference,
                                failure_reason: data?.gateway_response || 'Payment failed',
                            },
                        })
                        .eq('order_number', merchantOrderRef);
                }
            } catch (failErr: any) {
                console.error('[Paystack/Callback] Failed to mark order failed:', failErr?.message);
            }
            return NextResponse.json({ success: false, message: 'Payment not successful' });
        }

        // Any other event (transfer.*, subscription.*, etc.) we just acknowledge.
        return NextResponse.json({ success: true, message: 'Event acknowledged' });
    } catch (error: any) {
        console.error('[Paystack/Callback] Critical Error:', error?.message || error);
        // 200 here would cause infinite retries on truly broken payloads, but
        // 500 lets Paystack retry transient failures, which is what we want.
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Paystack callback endpoint ready',
        timestamp: new Date().toISOString(),
    });
}

/**
 * Constant-time hex-string comparison so attackers can't time-attack the
 * signature check.
 */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    try {
        return crypto.timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
    } catch {
        return false;
    }
}
