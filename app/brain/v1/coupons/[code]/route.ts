import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  assertBrainApiVersion,
  brainOk,
  logRequestContext,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  const { code: raw } = await context.params;
  const code = decodeURIComponent(raw || '').trim();
  if (!code) {
    return brainOk({
      coupon: {
        code: '',
        valid: false,
        reason: 'not_found',
        type: 'percent',
        value: 0,
        minimum_purchase: 0,
        currency: 'GHS',
        expires_at: null,
      },
    });
  }

  const cartTotal = new URL(request.url).searchParams.get('cart_total');
  const cartNum = cartTotal ? parseFloat(cartTotal) : null;

  const { data: row, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .ilike('code', code)
    .maybeSingle();

  if (error || !row) {
    return brainOk({
      coupon: {
        code,
        valid: false,
        reason: 'not_found',
        type: 'percent',
        value: 0,
        minimum_purchase: 0,
        currency: 'GHS',
        expires_at: null,
      },
    });
  }

  const now = new Date();
  if (row.is_active === false) {
    return brainOk({
      coupon: {
        code: row.code,
        valid: false,
        reason: 'inactive',
        type: row.type === 'percentage' ? 'percent' : 'fixed',
        value: Number(row.value),
        minimum_purchase: Number(row.minimum_purchase ?? 0),
        currency: 'GHS',
        expires_at: row.end_date,
      },
    });
  }
  if (row.start_date && new Date(row.start_date) > now) {
    return brainOk({
      coupon: {
        code: row.code,
        valid: false,
        reason: 'inactive',
        type: row.type === 'percentage' ? 'percent' : 'fixed',
        value: Number(row.value),
        minimum_purchase: Number(row.minimum_purchase ?? 0),
        currency: 'GHS',
        expires_at: row.end_date,
      },
    });
  }
  if (row.end_date && new Date(row.end_date) < now) {
    return brainOk({
      coupon: {
        code: row.code,
        valid: false,
        reason: 'expired',
        type: row.type === 'percentage' ? 'percent' : 'fixed',
        value: Number(row.value),
        minimum_purchase: Number(row.minimum_purchase ?? 0),
        currency: 'GHS',
        expires_at: row.end_date,
      },
    });
  }
  if (row.usage_limit != null && row.usage_count != null && row.usage_count >= row.usage_limit) {
    return brainOk({
      coupon: {
        code: row.code,
        valid: false,
        reason: 'usage_limit_reached',
        type: row.type === 'percentage' ? 'percent' : 'fixed',
        value: Number(row.value),
        minimum_purchase: Number(row.minimum_purchase ?? 0),
        currency: 'GHS',
        expires_at: row.end_date,
      },
    });
  }
  const minPurchase = Number(row.minimum_purchase ?? 0);
  if (cartNum !== null && !Number.isNaN(cartNum) && cartNum < minPurchase) {
    return brainOk({
      coupon: {
        code: row.code,
        valid: false,
        reason: 'minimum_not_met',
        type: row.type === 'percentage' ? 'percent' : 'fixed',
        value: Number(row.value),
        minimum_purchase: minPurchase,
        currency: 'GHS',
        expires_at: row.end_date,
      },
    });
  }

  return brainOk({
    coupon: {
      code: row.code,
      valid: true,
      reason: null,
      type: row.type === 'percentage' ? 'percent' : row.type === 'fixed_amount' ? 'fixed' : 'percent',
      value: Number(row.value),
      minimum_purchase: minPurchase,
      currency: 'GHS',
      expires_at: row.end_date,
    },
  });
}
