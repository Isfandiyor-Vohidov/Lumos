import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get('course_id');
  if (!courseId) return NextResponse.json({ error: 'course_id required' }, { status: 400 });

  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('questions').select('*').eq('course_id', courseId).order('order');
  return NextResponse.json(data ?? []);
}