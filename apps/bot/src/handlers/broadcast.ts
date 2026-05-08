import { Context } from 'grammy';
import { ProfileRepo } from '@edusphere/supabase-client';
import { createSupabaseServerClient, setTelegramContext } from '@edusphere/supabase-client';
import { setWaitingForBroadcast, stopWaitingForBroadcast, isWaitingForBroadcast } from '../store/broadcast-sessions';

export async function broadcastHandler(ctx: Context, next: () => Promise<void>) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  if (ctx.message?.text && isWaitingForBroadcast(telegramId)) {
    const text = ctx.message.text;
    stopWaitingForBroadcast(telegramId);

    const supabase = createSupabaseServerClient();
    await setTelegramContext(supabase, telegramId);
    const profileRepo = new ProfileRepo(supabase);
    const adminProfile = await profileRepo.getByTelegramId(telegramId);
    const students = await profileRepo.getAllStudentsOfCenter(adminProfile?.center_id ?? null);

    let sent = 0;
    for (const student of students) {
      try {
        await ctx.api.sendMessage(student.telegram_id, text);
        sent++;
      } catch {}
    }

    await ctx.reply(`Рассылка отправлена ${sent} студентам.`);
    return;
  }

  if (ctx.message?.text === '/broadcast') {
    setWaitingForBroadcast(telegramId);
    await ctx.reply('Введите текст для рассылки студентам вашего центра.');
    return;
  }
  return next();
}