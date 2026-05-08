import { SupabaseClient } from '@supabase/supabase-js';

export async function setTelegramContext(
  supabase: SupabaseClient,
  telegramId: number
) {
  await supabase.rpc('set_config', {
    parameter: 'app.current_telegram_id',
    value: telegramId.toString(),
  });
}