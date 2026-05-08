import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { runAssessment } from '@edusphere/ai-pipeline';
import { LeadRepo } from '@edusphere/supabase-client';
import { notifyAdminsAboutLead } from '@/services/notify';

export async function POST(req: NextRequest) {
  const telegramId = req.headers.get('x-telegram-id');
  const { session_id, answers } = await req.json();
  const supabase = createSupabaseServerClient();

  const { data: session } = await supabase.from('test_sessions').select('*, questions(*)').eq('id', session_id).single();
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const questions = session.questions;
  const score = answers.filter((a: any, i: number) => a.selected_index === questions[i].correct_option_index).length / questions.length * 100;

  const assessment = await runAssessment({ questions, answers });

  const { data: profile } = await supabase.from('profiles').select('id, center_id').eq('telegram_id', telegramId).single();
  const leadRepo = new LeadRepo(supabase);
  const lead = await leadRepo.create({
    profile_id: profile.id,
    course_id: session.course_id,
    center_id: profile.center_id,
    status: 'new',
    score: Math.round(score),
    ai_assessment: assessment.verdict,
    contacted_at: null,
    enrolled_at: null,
  });

  await supabase.from('test_sessions').update({ status: 'finished', finished_at: new Date().toISOString() }).eq('id', session_id);

  const { Bot } = await import('grammy');
  const bot = new Bot(process.env.BOT_TOKEN!);
  notifyAdminsAboutLead(bot, lead, supabase, new LeadRepo(supabase).constructor.prototype);

  return NextResponse.json({ lead_id: lead?.id, score, assessment });
}