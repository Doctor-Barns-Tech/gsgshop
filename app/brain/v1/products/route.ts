import { NextResponse } from 'next/server';
import {
  assertBrainApiVersion,
  fetchActiveProducts,
  fetchRecommendedProducts,
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
  const limit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit')!, 10)
    : 20;
  const lim = Number.isFinite(limit) ? limit : 20;
  const category = searchParams.get('category');

  try {
    // Spec says `q` is required; many clients omit it — return featured/recent products instead of 422.
    if (!q) {
      const products = await fetchRecommendedProducts(lim);
      return NextResponse.json(
        { products },
        {
          headers: {
            'Cache-Control': 'no-store',
            'X-Brain-Compat': 'empty-q-used-recommendations',
          },
        }
      );
    }

    const products = await fetchActiveProducts({
      q,
      category: category || null,
      limit: lim,
    });
    return NextResponse.json({ products }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[brain/v1/products]', e);
    return jsonError('internal', e?.message || 'Failed to load products', 500);
  }
}
