import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const BRAIN_V1_VERSION = '1.0.0';

export type BrainErrorCode =
  | 'unauthorized'
  | 'not_found'
  | 'validation_error'
  | 'rate_limited'
  | 'conflict'
  | 'internal'
  | 'not_implemented';

/** CORS on JSON bodies — middleware may not merge onto all route-handler responses. */
export function brainCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': process.env.BRAIN_V1_CORS_ORIGIN?.trim() || '*',
    'Access-Control-Allow-Headers':
      'Authorization, Content-Type, X-Request-Id, X-Brain-Api-Version',
  };
}

export function brainOk(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('Cache-Control', 'no-store');
  headers.set('Content-Type', 'application/json; charset=utf-8');
  Object.entries(brainCorsHeaders()).forEach(([k, v]) => headers.set(k, v));
  return NextResponse.json(body, { ...init, headers });
}

export function jsonError(
  code: BrainErrorCode,
  message: string,
  status: number,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    { error: { code, message, ...extra } },
    {
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...brainCorsHeaders(),
      },
    }
  );
}

export function notImplemented(message: string) {
  return NextResponse.json(
    { error: { code: 'not_implemented', message } },
    { status: 501, headers: { 'Content-Type': 'application/json; charset=utf-8', ...brainCorsHeaders() } }
  );
}

function adapterKeys(): string[] {
  const primary = process.env.SHOP_ADAPTER_API_KEY?.trim();
  const previous = process.env.SHOP_ADAPTER_API_KEY_PREVIOUS?.trim();
  const legacy = process.env.BRAIN_API_KEY?.trim();
  const keys = [primary, previous, legacy].filter(Boolean) as string[];
  return keys;
}

/** Case-insensitive `Bearer` (some HTTP clients send `bearer`). Spec §2. */
export function parseBearerToken(request: Request): string | null {
  const auth = request.headers.get('authorization') ?? '';
  const m = /^\s*Bearer\s+(.+?)\s*$/i.exec(auth);
  return m ? m[1].trim() : null;
}

export function verifyAdapterBearer(request: Request): NextResponse | null {
  const keys = adapterKeys();
  if (keys.length === 0) {
    return jsonError('internal', 'Server misconfigured: set SHOP_ADAPTER_API_KEY (or BRAIN_API_KEY)', 500);
  }

  const token = parseBearerToken(request);
  if (!token || !keys.includes(token)) {
    return jsonError('unauthorized', 'Invalid API key', 401);
  }

  return null;
}

/** Spec §11: accept 1, v1, 1.0 — absent = v1. */
export function assertBrainApiVersion(request: Request): NextResponse | null {
  const v = request.headers.get('x-brain-api-version')?.trim();
  if (!v) return null;
  const ok = v === '1' || /^v?1(\.0)?$/i.test(v);
  if (ok) return null;
  return jsonError('validation_error', 'Unsupported X-Brain-Api-Version', 400);
}

/** TENANT_SHOP_TEAM.md: log X-Request-Id on every request for cross-system tracing. */
export function logRequestContext(request: Request) {
  const rid = request.headers.get('x-request-id') ?? request.headers.get('X-Request-Id') ?? '-';
  const path = new URL(request.url).pathname;
  console.log('[brain/v1]', request.method, path, 'rid=', rid);
}

export async function readJsonBody<T = Record<string, unknown>>(
  request: Request
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  try {
    const text = await request.text();
    if (!text || !text.trim()) return { ok: true, data: {} as T };
    const data = JSON.parse(text) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, response: jsonError('validation_error', 'Invalid JSON body', 400) };
  }
}

export function siteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, '');
  if (vercel) return vercel.startsWith('http') ? vercel : `https://${vercel}`;
  return 'http://localhost:3000';
}

function mapDbOrderStatusToSpec(db: string): string {
  const m: Record<string, string> = {
    pending: 'pending',
    awaiting_payment: 'pending',
    processing: 'processing',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
    refunded: 'returned',
  };
  return m[db] || 'pending';
}

function mapPaymentStatus(db: string): string {
  return db || 'pending';
}

export function mapProductRow(p: any) {
  const images = (Array.isArray(p?.product_images) ? p.product_images : [])
    .slice()
    .sort((a: any, b: any) => (a?.position ?? 0) - (b?.position ?? 0))
    .map((img: any, i: number) => ({
      url: img.url,
      position: img.position ?? i,
    }));

  const cat = p?.categories;
  const categoryName =
    (Array.isArray(cat) ? cat[0]?.name : cat?.name) ?? null;
  const categorySlug =
    (Array.isArray(cat) ? cat[0]?.slug : cat?.slug) ?? null;
  const categoryStr =
    categoryName ||
    categorySlug ||
    (typeof p?.category === 'string' ? p.category : null);

  const first = images[0]?.url ?? null;

  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    description: p.description ?? null,
    price: Number(p.price ?? 0),
    currency: (p.currency as string) || 'GHS',
    image: first,
    images,
    in_stock: Number(p.quantity ?? 0) > 0 || p.continue_selling === true,
    stock_quantity: Number(p.quantity ?? 0),
    moq: Number(p.moq ?? 1),
    category: categoryStr,
    tags: Array.isArray(p.tags) ? p.tags : [],
    metadata: (p.metadata && typeof p.metadata === 'object' ? p.metadata : {}) as Record<string, unknown>,
  };
}

export async function fetchActiveProducts(params: {
  q: string;
  category?: string | null;
  limit?: number;
}) {
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 50);
  let query = supabaseAdmin
    .from('products')
    .select(
      `
      id, name, slug, description, price, quantity, moq, tags, status, metadata, continue_selling,
      categories(name, slug),
      product_images(url, position)
    `
    )
    .eq('status', 'active')
    .ilike('name', `%${params.q.trim()}%`)
    .order('name', { ascending: true })
    .limit(80);

  const { data, error } = await query;
  if (error) throw error;
  let rows = data ?? [];

  if (params.category) {
    const c = params.category.toLowerCase();
    rows = rows.filter((p: any) => {
      const cat = p?.categories;
      const n = (Array.isArray(cat) ? cat[0]?.name : cat?.name) ?? '';
      const s = (Array.isArray(cat) ? cat[0]?.slug : cat?.slug) ?? '';
      return n.toLowerCase().includes(c) || s.toLowerCase().includes(c);
    });
  }

  return rows.slice(0, limit).map(mapProductRow);
}

export async function fetchProductOne(slugOrId: string) {
  const safe = slugOrId.replace(/"/g, '');
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(
      `
      id, name, slug, description, price, quantity, moq, tags, status, metadata, continue_selling,
      categories(name, slug),
      product_images(url, position)
    `
    )
    .eq('status', 'active')
    .or(`id.eq.${safe},slug.eq.${safe}`)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapProductRow(data);
}

export async function mapOrderRow(order: any, items: any[]) {
  const base = siteBaseUrl();
  const shipping = (order.shipping_address && typeof order.shipping_address === 'object'
    ? order.shipping_address
    : {}) as Record<string, unknown>;

  const lineItems = (items || []).map((it: any) => {
    const pim = it.products?.product_images;
    const imgs = Array.isArray(pim)
      ? [...pim].sort((a: any, b: any) => (a?.position ?? 0) - (b?.position ?? 0))
      : [];
    return {
      product_id: it.product_id ? String(it.product_id) : '',
      product_name: it.product_name,
      slug: it.products?.slug ?? null,
      image: imgs[0]?.url ?? null,
      quantity: it.quantity,
      unit_price: Number(it.unit_price ?? 0),
      total_price: Number(it.total_price ?? 0),
    };
  });

  const customerName =
    (order.metadata && (order.metadata as any).customer_name) ||
    shipping.full_name ||
    '';

  return {
    id: String(order.id),
    order_number: order.order_number,
    status: mapDbOrderStatusToSpec(order.status),
    payment_status: mapPaymentStatus(order.payment_status),
    total: Number(order.total ?? 0),
    subtotal: Number(order.subtotal ?? 0),
    shipping_fee: Number(order.shipping_total ?? 0),
    currency: order.currency || 'GHS',
    customer_email: order.email,
    customer_name: customerName,
    shipping_address: shipping,
    items: lineItems,
    tracking_url: `${base}/order-tracking?order=${encodeURIComponent(order.order_number)}`,
    created_at: order.created_at,
    updated_at: order.updated_at,
  };
}

export async function loadOrderWithItems(orderNumber: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber.trim())
    .maybeSingle();

  if (error || !order) return null;
  if (String(order.email).toLowerCase() !== normalizedEmail) return null;

  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select(
      `
      id, product_id, product_name, quantity, unit_price, total_price,
      products(slug, product_images(url, position))
    `
    )
    .eq('order_id', order.id);

  return { order, items: items || [] };
}

export async function fetchRecommendedProducts(limit: number) {
  const lim = Math.min(Math.max(limit, 1), 30);
  let { data, error } = await supabaseAdmin
    .from('products')
    .select(
      `
      id, name, slug, description, price, quantity, moq, tags, status, metadata, continue_selling,
      categories(name, slug),
      product_images(url, position)
    `
    )
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(lim);

  if (error) throw error;
  if (!data?.length) {
    const r2 = await supabaseAdmin
      .from('products')
      .select(
        `
        id, name, slug, description, price, quantity, moq, tags, status, metadata, continue_selling,
        categories(name, slug),
        product_images(url, position)
      `
      )
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(lim);
    if (r2.error) throw r2.error;
    data = r2.data ?? [];
  }

  return (data ?? []).map(mapProductRow);
}
