import { NextResponse } from 'next/server';
import { BRAIN_V1_VERSION } from '@/lib/brain-v1-adapter';

export async function GET(request: Request) {
  const rid = request.headers.get('x-request-id') || request.headers.get('X-Request-Id');
  if (rid) console.log('[brain/v1]', rid, 'GET', '/brain/v1/health');

  return NextResponse.json(
    { status: 'ok', version: BRAIN_V1_VERSION },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
