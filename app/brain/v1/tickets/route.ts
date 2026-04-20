import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  assertBrainApiVersion,
  brainOk,
  jsonError,
  logRequestContext,
  readJsonBody,
  verifyAdapterBearer,
} from '@/lib/brain-v1-adapter';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const verr = assertBrainApiVersion(request);
  if (verr) return verr;
  const authErr = verifyAdapterBearer(request);
  if (authErr) return authErr;
  logRequestContext(request);

  try {
    const parsed = await readJsonBody<Record<string, unknown>>(request);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    let subject = String(body?.subject ?? body?.title ?? '').trim();
    const description = String(
      body?.description ?? body?.message ?? body?.body ?? ''
    ).trim();
    const category = String(body?.category ?? 'general').trim();
    const email = String(body?.email ?? body?.customer_email ?? '').trim().toLowerCase();

    if (!subject && description) {
      subject = description.length > 140 ? `${description.slice(0, 137)}...` : description;
    }

    if (!subject || !email) {
      return jsonError('validation_error', 'subject (or message) and email are required', 422);
    }

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        user_id: null,
        email,
        subject,
        description: description || null,
        category,
        metadata: { source: 'whatsapp_brain' },
      })
      .select('id, ticket_number, subject, description, category, status, priority, email, created_at')
      .single();

    if (error || !data) {
      return jsonError('internal', error?.message || 'Failed to create ticket', 500);
    }

    return brainOk(
      {
        ticket: {
          id: String(data.id),
          ticket_number: String(data.ticket_number),
          subject: data.subject,
          description: data.description,
          category: data.category,
          status: data.status,
          priority: data.priority,
          email: data.email,
          created_at: data.created_at,
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error('[brain/v1/tickets]', e);
    return jsonError('internal', e?.message || 'Failed to create ticket', 500);
  }
}
