import { SupabaseClient } from '@supabase/supabase-js';
import type { TestSession } from '@edusphere/shared';

export class TestSessionRepo {
  constructor(private supabase: SupabaseClient) {}

  async create(session: Omit<TestSession, 'id' | 'created_at'>): Promise<TestSession | null> {
    const { data } = await this.supabase.from('test_sessions').insert(session).select().single();
    return (data as TestSession) ?? null;
  }

  async updateAnswers(sessionId: string, answers: TestSession['answers']): Promise<void> {
    await this.supabase.from('test_sessions').update({ answers }).eq('id', sessionId);
  }

  async finishSession(sessionId: string): Promise<void> {
    await this.supabase
      .from('test_sessions')
      .update({ status: 'finished', finished_at: new Date().toISOString() })
      .eq('id', sessionId);
  }
}