import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  assertBrainApiVersion,
  jsonError,
  logRequestContext,
  siteBaseUrl,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

async function loadSettings(): Promise<Record<string, string>> {
  const { data } = await supabaseAdmin.from('site_settings').select('key, value');
  const out: Record<string, string> = {};
  for (const row of data || []) {
    const v = row.value;
    if (typeof v === 'string') out[row.key] = v;
    else if (v && typeof v === 'object' && 'value' in v) out[row.key] = String((v as any).value ?? '');
    else out[row.key] = JSON.stringify(v ?? '');
  }
  return out;
}

export async function GET(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  try {
    const base = siteBaseUrl();
    const s = await loadSettings();

    const brand_name = s.site_name || 'GSG Convenience Goods & More';
    const tagline = s.site_tagline || 'Premium convenience shopping in Ghana';
    const contact_email = s.contact_email || 'info@gsgbrands.com.gh';
    const contact_phone = s.contact_phone || '+233 (0) 246 033 792';

    const { data: pageRows } = await supabaseAdmin
      .from('pages')
      .select('title, slug, status')
      .neq('status', 'draft')
      .limit(30);

    const pages = (pageRows || []).map((p) => ({
      title: p.title,
      path: `/${p.slug}`,
    }));

    const store_info = {
      brand_name,
      tagline,
      currency: 'GHS',
      contact: {
        email: contact_email,
        phone: contact_phone,
        whatsapp: 'https://wa.me/233246033792',
        address: s.contact_address || 'Accra, Ghana',
      },
      policies: {
        shipping: `${base}/shipping`,
        returns: `${base}/help`,
        payment: `${base}/terms`,
        business_hours: 'See Contact & Shipping pages for hours.',
      },
      site_url: base,
      pages,
    };

    return NextResponse.json({ store_info }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[brain/v1/store-info]', e);
    return jsonError('internal', e?.message || 'Failed to load store info', 500);
  }
}
