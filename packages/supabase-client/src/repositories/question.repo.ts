import { SupabaseClient } from '@supabase/supabase-js';
import type { Question } from '@edusphere/shared';

export class QuestionRepo {
  constructor(private supabase: SupabaseClient) {}

  async getByCourseId(courseId: string): Promise<Question[]> {
    const { data } = await this.supabase
      .from('questions')
      .select('*')
      .eq('course_id', courseId)
      .order('order');
    return (data ?? []) as Question[];
  }
}