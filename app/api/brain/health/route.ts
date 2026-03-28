import { NextResponse } from 'next/server';
import { verifyBrainBearer } from '../_lib';

export async function GET(request: Request) {
  const authError = verifyBrainBearer(request);
  if (authError) return authError;

  return NextResponse.json({
    status: 'ok',
    shop: 'GSG Convenience Goods & More',
  });
}
