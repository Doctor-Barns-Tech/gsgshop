import {
  assertBrainApiVersion,
  brainOk,
  fetchProductOne,
  jsonError,
  logRequestContext,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  const { slug } = await context.params;
  if (!slug) return jsonError('validation_error', 'Missing slug', 400);

  try {
    const product = await fetchProductOne(decodeURIComponent(slug));
    if (!product) {
      return jsonError('not_found', 'Product not found', 404);
    }
    return brainOk({ product });
  } catch (e: any) {
    console.error('[brain/v1/products/:slug]', e);
    return jsonError('internal', e?.message || 'Failed to load product', 500);
  }
}
