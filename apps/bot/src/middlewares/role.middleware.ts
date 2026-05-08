import { Context, NextFunction } from 'grammy';
import { createSupabaseServerClient, setTelegramContext, ProfileRepo } from '@edusphere/supabase-client';

export async function adminOnly(ctx: Context, next: NextFunction) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;
  const supabase = createSupabaseServerClient();
  await setTelegramContext(supabase, telegramId);
  const repo = new ProfileRepo(supabase);
  const profile = await repo.getByTelegramId(telegramId);
  if (profile?.role === 'admin') return next();
  await ctx.reply('Недостаточно прав.');
}