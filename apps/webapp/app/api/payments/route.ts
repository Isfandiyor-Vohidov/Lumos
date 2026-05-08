import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const payload = await req.json();
  // Предполагается проверка webhook-подписи (stripe)
  const { data, error } = await supabase.from('payments').insert({
    lead_id: payload.metadata.lead_id,
    provider: 'stripe',
    external_id: payload.id,
    amount: payload.amount_total / 100,
    currency: payload.currency,
    status: 'completed',
    metadata: payload,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}