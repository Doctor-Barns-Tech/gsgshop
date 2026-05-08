import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { loadPaymentTarget, recordPaymentAttempt } from '@/lib/payment-target';

/**
 * Paystack — initialize a hosted card payment.
 *
 * Request body: { orderId: string; customerEmail?: string }
 *   - orderId may be a UUID, an ORD-... order_number, or an SR-...
 *     shopper_requests.request_number. The route dispatches to the right
 *     table via lib/payment-target.
 *
 * SECURITY:
 *   - amount is taken from the database, NEVER from the client
 *   - Paystack expects amount in pesewas (subunit of GHS), so we send total*100
 *   - Currency is locked to GHS
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

        const target = await loadPaymentTarget(orderId);
        if (!target) {
            console.error('[Paystack] Target not found:', orderId);
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        if (target.payment_status === 'paid') {
            return NextResponse.json({ success: false, message: 'Order is already paid' }, { status: 400 });
        }

        const amountCedis = Number(target.amount);
        if (!Number.isFinite(amountCedis) || amountCedis <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        target.kind === 'shopper_request'
                            ? 'This request is not yet ready for payment'
                            : 'Invalid order amount',
                },
                { status: 400 }
            );
        }
        // Paystack works in subunits — pesewas for GHS.
        const amountPesewas = Math.round(amountCedis * 100);

        const orderRef = target.ref;
        const customerEmailFinal = (typeof customerEmail === 'string' && customerEmail) || target.email;
        if (!customerEmailFinal) {
            return NextResponse.json({ success: false, message: 'Missing customer email' }, { status: 400 });
        }

        const requestUrl = new URL(req.url);
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin).replace(/\/+$/, '');

        // Same shape as the Moolre uniqueRef so the rest of the system (webhook
        // strip-suffix logic, /verify candidate list, etc.) treats both providers
        // uniformly.
        const uniqueRef = `${orderRef}-R${Date.now()}`;

        // Shopper-request payments redirect back into the shopper subdomain so
        // branding stays consistent for that customer.
        const successPath =
            target.kind === 'shopper_request'
                ? `/shopper/payment-complete?ref=${orderRef}&payment_success=true&provider=paystack`
                : `/order-success?order=${orderRef}&payment_success=true&provider=paystack`;

        const payload = {
            email: customerEmailFinal,
            amount: amountPesewas,
            currency: 'GHS',
            reference: uniqueRef,
            callback_url: `${baseUrl}${successPath}`,
            channels: ['card'],
            metadata: {
                order_number: orderRef,
                original_order_number: orderRef,
                kind: target.kind,
                customer_email: customerEmailFinal,
                custom_fields: [
                    {
                        display_name: target.kind === 'shopper_request' ? 'Request Number' : 'Order Number',
                        variable_name: 'order_number',
                        value: orderRef,
                    },
                ],
            },
        };

        console.log(
            '[Paystack] Initiating for',
            target.kind,
            orderRef,
            '| Amount (pesewas):',
            amountPesewas
        );

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
            try {
                await recordPaymentAttempt(target, { provider: 'paystack', uniqueRef });
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
