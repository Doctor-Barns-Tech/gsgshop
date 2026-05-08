import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { loadPaymentTarget, refKind } from '@/lib/payment-target';
import { finalizePayment } from '@/lib/payment-finalize';

/**
 * Paystack — verify a transaction after the customer is redirected back from
 * the hosted card page. Called from /order-success and /shopper/payment-complete.
 *
 * SECURITY:
 *   - The redirect itself is never proof of payment. We always re-verify with
 *     the Paystack API using PAYSTACK_SECRET_KEY.
 *   - Amount comparison: Paystack returns `data.amount` in pesewas — we
 *     convert target.amount (cedis) to pesewas before comparing.
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

        const kind = refKind(orderNumber);
        if (!kind) {
            return NextResponse.json({ success: false, message: 'Invalid order number format' }, { status: 400 });
        }

        console.log('[Paystack/Verify] Checking', kind, 'payment for:', orderNumber, '| ref hint:', reference);

        const target = await loadPaymentTarget(orderNumber);
        if (!target) {
            console.error('[Paystack/Verify] Target not found:', orderNumber);
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        if (target.payment_status === 'paid') {
            console.log('[Paystack/Verify] Already paid:', orderNumber);
            return NextResponse.json({
                success: true,
                payment_status: 'paid',
                message: 'Order already paid',
            });
        }

        // Reject targets initiated against another provider so we don't
        // accidentally credit a Moolre order off a stale Paystack reference.
        if (target.payment_method && target.payment_method !== 'paystack') {
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
                    payment_status: target.payment_status,
                    message: 'Payment verification unavailable',
                },
                { status: 503 }
            );
        }

        // Try multiple references in priority order:
        //  1. Whatever the redirect URL gave us (Paystack echoes ?reference=)
        //  2. The unique ref we persisted at init time
        //  3. The bare merchant ref, in case init never wrote metadata
        const candidates: string[] = [];
        if (typeof reference === 'string' && reference) candidates.push(reference);
        const lastRef = (target.metadata as any)?.last_payment_ref;
        if (lastRef) candidates.push(lastRef);
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
                    const expectedPesewas = Math.round(Number(target.amount) * 100);
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
                payment_status: target.payment_status,
                message: 'Payment not yet confirmed by payment provider',
            });
        }

        console.log('[Paystack/Verify] Marking paid:', orderNumber, '| Paystack tx:', paystackTransactionId);

        const result = await finalizePayment({
            target,
            provider: 'paystack',
            transactionId: paystackTransactionId,
        });
        if (!result.ok) {
            return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            status: target.kind === 'order' ? 'processing' : 'PAID',
            payment_status: 'paid',
            message: 'Payment verified and order updated',
        });
    } catch (error: any) {
        console.error('[Paystack/Verify] Error:', error?.message || error);
        return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
    }
}
