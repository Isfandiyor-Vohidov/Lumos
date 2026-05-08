import { SupabaseClient } from '@supabase/supabase-js';
import type { Course } from '@edusphere/shared';

export class CourseRepo {
  constructor(private supabase: SupabaseClient) {}

  async getActiveCourses(): Promise<Course[]> {
    const { data } = await this.supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('title');
    return (data ?? []) as Course[];
  }

  async getById(courseId: string): Promise<Course | null> {
    const { data } = await this.supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    return (data as Course) ?? null;
  }

  async create(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course | null> {
    const { data } = await this.supabase.from('courses').insert(course).select().single();
    return (data as Course) ?? null;
  }
}