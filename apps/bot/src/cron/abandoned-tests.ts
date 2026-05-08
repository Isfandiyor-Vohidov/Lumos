import { Bot } from 'grammy';
import { createSupabaseServerClient } from '@edusphere/supabase-client';

export function startAbandonedTestCron(bot: Bot) {
  setInterval(async () => {
    const supabase = createSupabaseServerClient();
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: sessions } = await supabase
      .from('test_sessions')
      .select('id, profile_id, course_id')
      .eq('status', 'in_progress')
      .lt('started_at', hourAgo);

    if (!sessions) return;

    for (const session of sessions) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('id', session.profile_id)
        .single();

      if (profile?.telegram_id) {
        await bot.api.sendMessage(
          profile.telegram_id,
          '⏳ Вы не завершили тест. Пожалуйста, вернитесь в каталог и завершите его.'
        );
      }
    }
  }, 10 * 60 * 1000);
}