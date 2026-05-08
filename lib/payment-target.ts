/**
 * Resolves a payment "merchant reference" to either an `orders` row or a
 * `shopper_requests` row. Used by every payment route (init, verify, callback)
 * so a single Paystack/Moolre integration can drive both flows.
 *
 * Conventions (kept intentionally simple):
 *   - orders.order_number     looks like `ORD-<ts>-<rand>`
 *   - shopper_requests.request_number looks like `SR-<ts>-<rand>`
 *   - The unique reference we send to a payment gateway is
 *       `<orderRef>-R<ts>`
 *     so the suffix can be stripped to recover the merchant ref.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';

export type PaymentKind = 'order' | 'shopper_request';

export type PaymentTarget = {
    kind: PaymentKind;
    id: string; // primary key (uuid)
    ref: string; // merchant reference (ORD-... or SR-...)
    amount: number; // canonical amount in GHS — null/0 means unbillable
    email: string | null;
    payment_status: string | null;
    payment_method: string | null;
    metadata: Record<string, any>;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function refKind(ref: string | null | undefined): PaymentKind | null {
    if (!ref || typeof ref !== 'string') return null;
    if (ref.startsWith('SR-')) return 'shopper_request';
    if (ref.startsWith('ORD-')) return 'order';
    return null;
}

/** Strip a `-R<ts>` retry suffix off a payment-gateway reference. */
export function stripRetrySuffix(ref: string): string {
    return ref.replace(/-R\d+$/, '');
}

/**
 * Look up a payment target by client-supplied ID (UUID or merchant ref).
 * Returns null if nothing matches.
 */
export async function loadPaymentTarget(idOrRef: string): Promise<PaymentTarget | null> {
    if (!idOrRef) return null;

    const isUuid = UUID_RE.test(idOrRef);
    const kindHint = refKind(idOrRef);

    // SR-… reference  -> shopper_requests by request_number
    // ORD-… reference -> orders by order_number
    // raw uuid        -> try orders.id first, then shopper_requests.id
    if (kindHint === 'shopper_request') {
        return loadShopperByRef(idOrRef);
    }
    if (kindHint === 'order') {
        return loadOrderByRef(idOrRef);
    }
    if (isUuid) {
        const order = await loadOrderById(idOrRef);
        if (order) return order;
        return loadShopperById(idOrRef);
    }
    return null;
}

async function loadOrderById(id: string): Promise<PaymentTarget | null> {
    const { data } = await supabaseAdmin
        .from('orders')
        .select('id, order_number, total, email, payment_status, metadata')
        .eq('id', id)
        .maybeSingle();
    if (!data) return null;
    return {
        kind: 'order',
        id: data.id,
        ref: data.order_number,
        amount: Number(data.total),
        email: data.email,
        payment_status: data.payment_status,
        payment_method: (data.metadata as any)?.payment_method ?? null,
        metadata: (data.metadata as any) ?? {},
    };
}

async function loadOrderByRef(ref: string): Promise<PaymentTarget | null> {
    const { data } = await supabaseAdmin
        .from('orders')
        .select('id, order_number, total, email, payment_status, metadata')
        .eq('order_number', ref)
        .maybeSingle();
    if (!data) return null;
    return {
        kind: 'order',
        id: data.id,
        ref: data.order_number,
        amount: Number(data.total),
        email: data.email,
        payment_status: data.payment_status,
        payment_method: (data.metadata as any)?.payment_method ?? null,
        metadata: (data.metadata as any) ?? {},
    };
}

async function loadShopperById(id: string): Promise<PaymentTarget | null> {
    const { data } = await supabaseAdmin
        .from('shopper_requests')
        .select('id, request_number, total_final, total_est, contact_email, payment_status, payment_method, metadata')
        .eq('id', id)
        .maybeSingle();
    if (!data) return null;
    return shopperToTarget(data);
}

async function loadShopperByRef(ref: string): Promise<PaymentTarget | null> {
    const { data } = await supabaseAdmin
        .from('shopper_requests')
        .select('id, request_number, total_final, total_est, contact_email, payment_status, payment_method, metadata')
        .eq('request_number', ref)
        .maybeSingle();
    if (!data) return null;
    return shopperToTarget(data);
}

function shopperToTarget(row: any): PaymentTarget {
    const totalFinal = row.total_final !== null && row.total_final !== undefined ? Number(row.total_final) : null;
    return {
        kind: 'shopper_request',
        id: row.id,
        ref: row.request_number,
        // total_final is the canonical billable amount once admin has confirmed
        // market prices. Falling back to total_est would let a customer pay
        // before the admin signs off, so we deliberately leave it 0/NaN.
        amount: totalFinal ?? 0,
        email: row.contact_email ?? null,
        payment_status: row.payment_status,
        payment_method: row.payment_method,
        metadata: (row.metadata as any) ?? {},
    };
}

/**
 * Persist init-time payment metadata back onto whichever table this target
 * lives in. Called from the Paystack/Moolre init routes so /verify and the
 * webhook can correlate the gateway transaction back to our merchant ref.
 */
export async function recordPaymentAttempt(target: PaymentTarget, opts: {
    provider: 'moolre' | 'paystack';
    uniqueRef: string;
}): Promise<void> {
    const { provider, uniqueRef } = opts;
    const now = new Date().toISOString();

    if (target.kind === 'order') {
        await supabaseAdmin
            .from('orders')
            .update({
                metadata: {
                    ...target.metadata,
                    payment_method: provider,
                    last_payment_ref: uniqueRef,
                    last_payment_attempt_at: now,
                },
                payment_provider: provider,
            })
            .eq('id', target.id);
        return;
    }

    await supabaseAdmin
        .from('shopper_requests')
        .update({
            payment_method: provider,
            payment_provider: provider,
            last_payment_ref: uniqueRef,
            last_payment_attempt_at: now,
            metadata: {
                ...target.metadata,
                payment_method: provider,
                last_payment_ref: uniqueRef,
            },
        })
        .eq('id', target.id);
}
