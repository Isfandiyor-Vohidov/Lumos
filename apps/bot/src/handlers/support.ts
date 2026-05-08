import { Context } from 'grammy';
import { ProfileRepo } from '@edusphere/supabase-client';
import { createSupabaseServerClient, setTelegramContext } from '@edusphere/supabase-client';

const supportState = new Map<number, boolean>();

export async function supportHandler(ctx: Context) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  if (supportState.get(telegramId)) {
    const supabase = createSupabaseServerClient();
    await setTelegramContext(supabase, telegramId);
    const profileRepo = new ProfileRepo(supabase);
    const admins = await profileRepo.getAdminsOfCenter(null);

    const text = ctx.message?.text ?? '';
    for (const admin of admins) {
      await ctx.api.sendMessage(admin.telegram_id, `🆘 Вопрос от студента:\n\n${text}\n\nОт: ${ctx.from?.first_name} (tg://user?id=${telegramId})`);
    }

    supportState.delete(telegramId);
    await ctx.reply('Ваш вопрос отправлен. Мы свяжемся с вами.');
    return;
  }

  if (ctx.message?.text === '/support') {
    supportState.set(telegramId, true);
    await ctx.reply('Опишите ваш вопрос одним сообщением.');
    return;
  }
}