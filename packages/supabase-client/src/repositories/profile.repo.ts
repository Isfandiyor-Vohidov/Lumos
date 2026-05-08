import { SupabaseClient } from '@supabase/supabase-js';
import type { Profile } from '@edusphere/shared';

export class ProfileRepo {
  constructor(private supabase: SupabaseClient) {}

  async getByTelegramId(telegramId: number): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();
    if (error) return null;
    return data as Profile;
  }

  async create(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    if (error) return null;
    return data as Profile;
  }

  async updateRole(profileId: string, role: string): Promise<void> {
    await this.supabase.from('profiles').update({ role }).eq('id', profileId);
  }
}