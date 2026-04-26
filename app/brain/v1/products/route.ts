import { NextResponse } from 'next/server';
import {
  assertBrainApiVersion,
  fetchActiveProducts,
  jsonError,
  logRequestContext,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

export async function GET(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();
  if (!q) {
    return jsonError('validation_error', 'Query parameter q is required', 422, {
      fields: { q: 'required' },
    });
  }

  const limit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit')!, 10)
    : 20;
  const category = searchParams.get('category');

  try {
    const products = await fetchActiveProducts({
      q,
      category: category || null,
      limit: Number.isFinite(limit) ? limit : 20,
    });
    return NextResponse.json({ products }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[brain/v1/products]', e);
    return jsonError('internal', e?.message || 'Failed to load products', 500);
  }
}
