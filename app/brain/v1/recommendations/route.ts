import { NextResponse } from 'next/server';
import {
  assertBrainApiVersion,
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
  const limit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit')!, 10)
    : 8;

  try {
    const products = await fetchRecommendedProducts(Number.isFinite(limit) ? limit : 8);
    return NextResponse.json({ products }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[brain/v1/recommendations]', e);
    return jsonError('internal', e?.message || 'Failed to load recommendations', 500);
  }
}
