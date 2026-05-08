import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const telegramId = req.headers.get('x-telegram-id');
  const { course_id } = await req.json();
  const supabase = createSupabaseServerClient();

  const { data: profile } = await supabase.from('profiles').select('id').eq('telegram_id', telegramId).single();
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { data: session } = await supabase
    .from('test_sessions')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('course_id', course_id)
    .eq('status', 'in_progress')
    .single();

  if (session) return NextResponse.json(session);

  const { data: newSession } = await supabase
    .from('test_sessions')
    .insert({ profile_id: profile.id, course_id })
    .select()
    .single();

  return NextResponse.json(newSession);
}