import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { loadPaymentTarget, refKind, stripRetrySuffix } from '@/lib/payment-target';
import { finalizePayment } from '@/lib/payment-finalize';

/**
 * Paystack webhook.
 *
 * https://paystack.com/docs/payments/webhooks/
 *
 * Paystack signs the **raw** request body with HMAC-SHA512 using your secret
 * key and sends the hex digest as the `x-paystack-signature` header.
 *
 * SECURITY: We MUST verify the signature against the raw bytes before
 * trusting anything in the payload.
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

        // Resolve the merchant ref. Init writes metadata.order_number with the
        // bare ORD-/SR- form; the reference itself has a -R<ts> retry suffix.
        const metaOrderNumber: string | undefined =
            data?.metadata?.order_number || data?.metadata?.original_order_number;
        const refOrderNumber: string | undefined = data?.reference
            ? stripRetrySuffix(String(data.reference))
            : undefined;
        const merchantOrderRef = metaOrderNumber || refOrderNumber;

        if (!merchantOrderRef) {
            console.error('[Paystack/Callback] Missing order reference. Body:', JSON.stringify(body).slice(0, 500));
            return NextResponse.json({ success: false, message: 'Missing order reference' });
        }

        const kind = refKind(merchantOrderRef);
        if (!kind) {
            console.error('[Paystack/Callback] Unknown ref prefix:', merchantOrderRef);
            return NextResponse.json({ success: false, message: 'Unknown reference format' });
        }

        if (event === 'charge.success' && data?.status === 'success') {
            const target = await loadPaymentTarget(merchantOrderRef);
            if (!target) {
                console.error('[Paystack/Callback] Target not found:', merchantOrderRef);
                return NextResponse.json({ success: false, message: 'Order not found' });
            }

            if (target.payment_status === 'paid') {
                console.log('[Paystack/Callback] Already paid — idempotent ack:', merchantOrderRef);
                return NextResponse.json({ success: true, message: 'Order already processed' });
            }

            if (target.payment_method && target.payment_method !== 'paystack') {
                console.error(
                    '[Paystack/Callback] Provider mismatch — target is',
                    target.payment_method,
                    'not paystack:',
                    merchantOrderRef
                );
                return NextResponse.json({ success: false, message: 'Provider mismatch' });
            }

            if (data.currency && String(data.currency).toUpperCase() !== 'GHS') {
                console.error('[Paystack/Callback] CURRENCY MISMATCH:', data.currency, 'for', merchantOrderRef);
                return NextResponse.json({ success: false, message: 'Currency mismatch' }, { status: 400 });
            }
            if (data.amount !== undefined && data.amount !== null) {
                const paidPesewas = Number(data.amount);
                const expectedPesewas = Math.round(Number(target.amount) * 100);
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

            const result = await finalizePayment({
                target,
                provider: 'paystack',
                transactionId: paystackTxnId,
            });
            if (!result.ok) {
                return NextResponse.json({ success: false, message: 'Database update failed' }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'Payment verified and order updated' });
        }

        if (event === 'charge.failed') {
            console.log(`[Paystack/Callback] Payment FAILED for ${merchantOrderRef} | gateway response:`, data?.gateway_response);
            try {
                if (kind === 'order') {
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
                } else {
                    const { data: existingReq } = await supabaseAdmin
                        .from('shopper_requests')
                        .select('metadata, payment_status')
                        .eq('request_number', merchantOrderRef)
                        .single();
                    if (existingReq && existingReq.payment_status !== 'paid') {
                        const previousMeta = (existingReq as any).metadata || {};
                        await supabaseAdmin
                            .from('shopper_requests')
                            .update({
                                payment_status: 'failed',
                                metadata: {
                                    ...previousMeta,
                                    paystack_reference: data?.reference,
                                    failure_reason: data?.gateway_response || 'Payment failed',
                                },
                            })
                            .eq('request_number', merchantOrderRef);
                    }
                }
            } catch (failErr: any) {
                console.error('[Paystack/Callback] Failed to mark target failed:', failErr?.message);
            }
            return NextResponse.json({ success: false, message: 'Payment not successful' });
        }

        return NextResponse.json({ success: true, message: 'Event acknowledged' });
    } catch (error: any) {
        console.error('[Paystack/Callback] Critical Error:', error?.message || error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Paystack callback endpoint ready',
        timestamp: new Date().toISOString(),
    });
}

function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    try {
        return crypto.timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
    } catch {
        return false;
    }
}
