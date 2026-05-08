import { SupabaseClient } from '@supabase/supabase-js';
import type { Lead, LeadStatus } from '@edusphere/shared';

export class LeadRepo {
  constructor(private supabase: SupabaseClient) {}

  async create(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead | null> {
    const { data } = await this.supabase.from('leads').insert(lead).select().single();
    return (data as Lead) ?? null;
  }

  async getByProfileId(profileId: string): Promise<Lead[]> {
    const { data } = await this.supabase
      .from('leads')
      .select('*, courses(title)')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });
    return (data ?? []) as Lead[];
  }

  async updateStatus(leadId: string, status: LeadStatus, extra: Partial<Lead> = {}): Promise<void> {
    await this.supabase.from('leads').update({ status, ...extra }).eq('id', leadId);
  }
}