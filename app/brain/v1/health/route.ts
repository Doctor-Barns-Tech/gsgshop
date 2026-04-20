import { BRAIN_V1_VERSION, brainOk, logRequestContext } from '@/lib/brain-v1-adapter';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  logRequestContext(request);

  return brainOk({ status: 'ok', version: BRAIN_V1_VERSION });
}
