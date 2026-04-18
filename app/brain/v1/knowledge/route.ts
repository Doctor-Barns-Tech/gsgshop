import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  assertBrainApiVersion,
  jsonError,
  logRequestContext,
  siteBaseUrl,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

const STATIC_SNIPPETS = [
  {
    id: 'static-shipping',
    title: 'Shipping & delivery',
    path: '/shipping',
    category: 'policies',
    content:
      'We offer pickup, free delivery on selected days, Sole Express, and Joint Express. See the Shipping page for cut-off times and zones.',
    keywords: ['shipping', 'delivery', 'express', 'pickup'],
  },
  {
    id: 'static-returns',
    title: 'Returns',
    path: '/help',
    category: 'policies',
    content: 'Contact support for returns and refunds. See Help Center for policies.',
    keywords: ['returns', 'refund'],
  },
  {
    id: 'static-payment',
    title: 'Payments',
    path: '/terms',
    category: 'policies',
    content: 'We accept Mobile Money and cards via Moolre where enabled.',
    keywords: ['payment', 'momo', 'card', 'moolre'],
  },
];

export async function GET(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim().toLowerCase();
  const limit = Math.min(
    Math.max(parseInt(searchParams.get('limit') ?? '10', 10) || 10, 1),
    30
  );

  if (!q) {
    return jsonError('validation_error', 'q query parameter is required', 422);
  }

  try {
    const base = siteBaseUrl();
    const entries: any[] = [];

    for (const s of STATIC_SNIPPETS) {
      const hay = `${s.title} ${s.content} ${s.keywords.join(' ')}`.toLowerCase();
      if (hay.includes(q)) {
        entries.push({
          id: s.id,
          title: s.title,
          path: s.path,
          category: s.category,
          content: s.content,
          keywords: s.keywords,
          url: `${base}${s.path}`,
        });
      }
    }

    const { data: pages } = await supabaseAdmin
      .from('pages')
      .select('id, title, slug, content, status')
      .neq('status', 'draft')
      .limit(50);

    for (const p of pages || []) {
      const text = `${p.title} ${p.content ?? ''}`.toLowerCase();
      if (text.includes(q)) {
        entries.push({
          id: String(p.id),
          title: p.title,
          path: `/${p.slug}`,
          category: 'page',
          content: (p.content || '').slice(0, 2000),
          keywords: [],
          url: `${base}/${p.slug}`,
        });
      }
    }

    return NextResponse.json(
      { entries: entries.slice(0, limit) },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e: any) {
    console.error('[brain/v1/knowledge]', e);
    return jsonError('internal', e?.message || 'Knowledge search failed', 500);
  }
}
