import { NextResponse } from 'next/server';

/**
 * Proxies Barns inbox embed token minting (TENANT_SHOP_ADAPTER_SPEC §12.2).
 * Never expose BARNS_TENANT_ADMIN_KEY to the browser — call this route from your admin server only.
 */
export async function POST(request: Request) {
  const key = process.env.BARNS_TENANT_ADMIN_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { error: 'BARNS_TENANT_ADMIN_KEY is not configured' },
      { status: 501 }
    );
  }

  const base =
    process.env.BARNS_API_BASE_URL?.replace(/\/$/, '') || 'https://barns.sasulabs.me';

  try {
    const body = await request.json();
    const res = await fetch(`${base}/api/tenant-admin/inbox-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    }
    return new NextResponse(text, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Proxy failed' }, { status: 500 });
  }
}
