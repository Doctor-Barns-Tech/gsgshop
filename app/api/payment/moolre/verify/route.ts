import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { loadPaymentTarget, refKind } from '@/lib/payment-target';
import { finalizePayment } from '@/lib/payment-finalize';

/**
 * Payment verification endpoint.
 * Called from /order-success and /shopper/payment-complete after the user
 * completes payment on Moolre.
 *
 * SECURITY: We ONLY trust Moolre's API response for payment verification.
 * The redirect itself is never proof of payment.
 *
 * Moolre status API:
 *   POST https://api.moolre.com/open/transact/status
 *   Body: { type: 1, idtype: 1, id: <externalref>, accountnumber: <wallet> }
 *   Response: { status: 1, data: { txstatus, externalref, transactionid, amount, ... } }
 *   - data.txstatus === 1  -> SUCCESS
 *   - data.txstatus === 2  -> FAILED
 *   - other                -> PENDING
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

        const { orderNumber, reference } = await req.json();

        if (!orderNumber || typeof orderNumber !== 'string') {
            return NextResponse.json({ success: false, message: 'Missing or invalid orderNumber' }, { status: 400 });
        }

        const kind = refKind(orderNumber);
        if (!kind) {
            return NextResponse.json({ success: false, message: 'Invalid order number format' }, { status: 400 });
        }

        console.log('[Verify] Checking', kind, 'payment for:', orderNumber, '| ref hint:', reference);

        const target = await loadPaymentTarget(orderNumber);
        if (!target) {
            console.error('[Verify] Target not found:', orderNumber);
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        if (target.payment_status === 'paid') {
            console.log('[Verify] Already paid:', orderNumber);
            return NextResponse.json({
                success: true,
                payment_status: 'paid',
                message: 'Order already paid'
            });
        }

        if (target.payment_method && target.payment_method !== 'moolre') {
            return NextResponse.json({
                success: false,
                message: 'This order does not use Moolre payment'
            }, { status: 400 });
        }

        const apiUser = process.env.MOOLRE_API_USER;
        const apiPubkey = process.env.MOOLRE_API_PUBKEY;
        const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER;

        if (!apiUser || !apiPubkey || !accountNumber) {
            console.error('[Verify] Missing Moolre API credentials');
            return NextResponse.json({
                success: false,
                payment_status: target.payment_status,
                message: 'Payment verification unavailable'
            }, { status: 503 });
        }

        // The id we send to Moolre must be the externalref Moolre actually has
        // on file. Init route stores that in metadata.last_payment_ref. The
        // redirect URL also includes it as `reference`. Fall back to bare
        // merchant ref as a last resort.
        const candidates: string[] = [];
        if (typeof reference === 'string' && reference) candidates.push(reference);
        const lastRef = (target.metadata as any)?.last_payment_ref;
        if (lastRef) candidates.push(lastRef);
        candidates.push(orderNumber);
        const uniqueCandidates = Array.from(new Set(candidates));

        let moolreApiVerified = false;
        let moolreTransactionId: string | null = null;
        let lastResponse: any = null;

        for (const candidate of uniqueCandidates) {
            try {
                const checkResponse = await fetch('https://api.moolre.com/open/transact/status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-USER': apiUser,
                        'X-API-PUBKEY': apiPubkey,
                    },
                    body: JSON.stringify({
                        type: 1,
                        idtype: 1,
                        id: candidate,
                        accountnumber: accountNumber,
                    }),
                });

                const checkResult = await checkResponse.json();
                lastResponse = checkResult;
                console.log('[Verify] Moolre status for', candidate, ':', JSON.stringify(checkResult).slice(0, 400));

                const data = checkResult?.data || {};
                const txStatus = data.txstatus ?? data.txtstatus;
                const isSuccess =
                    checkResult?.status === 1 &&
                    (txStatus === 1 || txStatus === '1');

                if (!isSuccess) {
                    continue;
                }

                if (data.amount !== undefined && data.amount !== null) {
                    const paidAmount = parseFloat(String(data.amount));
                    const expectedAmount = Number(target.amount);
                    if (Number.isFinite(paidAmount) && Math.abs(paidAmount - expectedAmount) > 0.01) {
                        console.error('[Verify] AMOUNT MISMATCH! Expected:', expectedAmount, 'Got:', paidAmount, 'for ref', candidate);
                        continue;
                    }
                }

                moolreApiVerified = true;
                moolreTransactionId = String(data.transactionid || data.thirdpartyref || candidate);
                break;
            } catch (moolreError: any) {
                console.warn('[Verify] Moolre API check failed for', candidate, ':', moolreError?.message);
            }
        }

        if (!moolreApiVerified) {
            console.log('[Verify] Cannot verify payment for:', orderNumber, '| last response:', JSON.stringify(lastResponse).slice(0, 200));
            return NextResponse.json({
                success: false,
                payment_status: target.payment_status,
                message: 'Payment not yet confirmed by payment provider'
            });
        }

        console.log('[Verify] Marking paid:', orderNumber, '| Moolre tx:', moolreTransactionId);

        const result = await finalizePayment({
            target,
            provider: 'moolre',
            transactionId: moolreTransactionId,
        });
        if (!result.ok) {
            return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            status: target.kind === 'order' ? 'processing' : 'PAID',
            payment_status: 'paid',
            message: 'Payment verified and order updated'
        });

    } catch (error: any) {
        console.error('[Verify] Error:', error.message);
        return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
    }
}
