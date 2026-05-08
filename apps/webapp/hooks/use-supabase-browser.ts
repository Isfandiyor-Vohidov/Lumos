'use client';
import { supabaseClient } from '@/lib/supabase-client';
export function useSupabaseBrowser() {
  return supabaseClient;
}