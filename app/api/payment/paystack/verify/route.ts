import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendOrderConfirmation } from '@/lib/notifications';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Paystack — verify a transaction after the customer is redirected back from
 * the hosted card page. Called from /order-success.
 *
 * SECURITY:
 *   - The redirect itself is never proof of payment. We always re-verify with
 *     the Paystack API using PAYSTACK_SECRET_KEY.
 *   - Amount comparison: Paystack returns `data.amount` in pesewas — we
 *     convert order.total (cedis) to pesewas before comparing.
 *   - Currency must be GHS.
 *
 * Verify endpoint:
 *   GET https://api.paystack.co/transaction/verify/:reference
 *   Auth: Authorization: Bearer <secret>
 *   Success when: response.status === true && data.status === 'success'
 */
export async function POST(req: Request) {
    try {
        const clientId = getClientIdentifier(req);
        const rateLimitResult = checkRateLimit(`verify:${clientId}`, RATE_LIMITS.payment);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { success: false, message: 'Too many requests' },
                { status: 429 }
            );
        }

        const { orderNumber, reference } = await req.json().catch(() => ({}));

        if (!orderNumber || typeof orderNumber !== 'string') {
            return NextResponse.json({ success: false, message: 'Missing or invalid orderNumber' }, { status: 400 });
        }

        if (!/^ORD-\d+-\d+$/.test(orderNumber)) {
            return NextResponse.json({ success: false, message: 'Invalid order number format' }, { status: 400 });
        }

        console.log('[Paystack/Verify] Checking payment for:', orderNumber, '| ref hint:', reference);

        const { data: order, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('id, order_number, payment_status, status, total, email, phone, shipping_address, metadata')
            .eq('order_number', orderNumber)
            .single();

        if (fetchError || !order) {
            console.error('[Paystack/Verify] Order not found:', orderNumber);
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        if (order.payment_status === 'paid') {
            console.log('[Paystack/Verify] Order already paid:', orderNumber);
            return NextResponse.json({
                success: true,
                status: order.status,
                payment_status: order.payment_status,
                message: 'Order already paid',
            });
        }

        // Reject orders that were initiated against another provider so we don't
        // accidentally credit a Moolre order off a stale Paystack reference.
        if (order.metadata?.payment_method && order.metadata.payment_method !== 'paystack') {
            return NextResponse.json(
                { success: false, message: 'This order does not use Paystack payment' },
                { status: 400 }
            );
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            console.error('[Paystack/Verify] Missing PAYSTACK_SECRET_KEY');
            return NextResponse.json(
                {
                    success: false,
                    status: order.status,
                    payment_status: order.payment_status,
                    message: 'Payment verification unavailable',
                },
                { status: 503 }
            );
        }

        // Try multiple references in priority order:
        //  1. Whatever the redirect URL gave us (Paystack echoes ?reference=)
        //  2. The unique ref we persisted at init time
        //  3. The bare order number, in case init never wrote metadata
        const candidates: string[] = [];
        if (typeof reference === 'string' && reference) candidates.push(reference);
        if (order.metadata?.last_payment_ref) candidates.push(order.metadata.last_payment_ref);
        candidates.push(orderNumber);
        const uniqueCandidates = Array.from(new Set(candidates));

        let paystackVerified = false;
        let paystackTransactionId: string | null = null;
        let lastResponse: any = null;

        for (const candidate of uniqueCandidates) {
            try {
                const checkResponse = await fetch(
                    `https://api.paystack.co/transaction/verify/${encodeURIComponent(candidate)}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${secretKey}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const checkResult = await checkResponse.json().catch(() => ({}));
                lastResponse = checkResult;
                console.log(
                    '[Paystack/Verify] Status for',
                    candidate,
                    ':',
                    JSON.stringify(checkResult).slice(0, 400)
                );

                const data = checkResult?.data || {};
                const isSuccess = checkResult?.status === true && data?.status === 'success';
                if (!isSuccess) continue;

                if (data.currency && String(data.currency).toUpperCase() !== 'GHS') {
                    console.error('[Paystack/Verify] CURRENCY MISMATCH:', data.currency, 'for', candidate);
                    continue;
                }

                if (data.amount !== undefined && data.amount !== null) {
                    const paidPesewas = Number(data.amount);
                    const expectedPesewas = Math.round(Number(order.total) * 100);
                    if (Number.isFinite(paidPesewas) && Math.abs(paidPesewas - expectedPesewas) > 1) {
                        console.error(
                            '[Paystack/Verify] AMOUNT MISMATCH! Expected pesewas:',
                            expectedPesewas,
                            'Got:',
                            paidPesewas,
                            'for ref',
                            candidate
                        );
                        continue;
                    }
                }

                paystackVerified = true;
                paystackTransactionId = String(data.id || data.reference || candidate);
                break;
            } catch (paystackError: any) {
                console.warn('[Paystack/Verify] API check failed for', candidate, ':', paystackError?.message);
            }
        }

        if (!paystackVerified) {
            console.log(
                '[Paystack/Verify] Cannot verify payment for:',
                orderNumber,
                '| last response:',
                JSON.stringify(lastResponse).slice(0, 200)
            );
            return NextResponse.json({
                success: false,
                status: order.status,
                payment_status: order.payment_status,
                message: 'Payment not yet confirmed by payment provider',
            });
        }

        console.log('[Paystack/Verify] Marking order paid:', orderNumber, '| Paystack tx:', paystackTransactionId);

        // Reuse the existing mark_order_paid RPC. Its second parameter is named
        // `moolre_ref` for legacy reasons but it accepts any string and stores
        // it on metadata.moolre_reference. We additionally set the dedicated
        // payment_transaction_id column below for accurate per-provider tracking.
        const { data: orderJson, error: updateError } = await supabaseAdmin.rpc('mark_order_paid', {
            order_ref: orderNumber,
            moolre_ref: paystackTransactionId || 'paystack-api-verify',
        });

        if (updateError) {
            console.error('[Paystack/Verify] RPC Error:', updateError.message);
            return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
        }

        // Tag the dedicated provider columns so admin reporting sees the right gateway.
        try {
            await supabaseAdmin
                .from('orders')
                .update({
                    payment_provider: 'paystack',
                    payment_transaction_id: paystackTransactionId,
                })
                .eq('order_number', orderNumber);
        } catch (tagErr: any) {
            console.warn('[Paystack/Verify] Failed to tag provider columns:', tagErr?.message);
        }

        if (orderJson?.email) {
            try {
                await supabaseAdmin.rpc('update_customer_stats', {
                    p_customer_email: orderJson.email,
                    p_order_total: orderJson.total,
                });
            } catch (statsError: any) {
                console.error('[Paystack/Verify] Customer stats failed:', statsError.message);
            }
        }

        if (orderJson) {
            try {
                await sendOrderConfirmation(orderJson);
                console.log('[Paystack/Verify] Notifications sent for:', orderNumber);
            } catch (notifyError: any) {
                console.error('[Paystack/Verify] Notification failed:', notifyError.message);
            }
        }

        return NextResponse.json({
            success: true,
            status: 'processing',
            payment_status: 'paid',
            message: 'Payment verified and order updated',
        });
    } catch (error: any) {
        console.error('[Paystack/Verify] Error:', error?.message || error);
        return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
    }
}
