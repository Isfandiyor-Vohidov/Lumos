import { Context } from 'grammy';
import { createSupabaseServerClient, setTelegramContext, LeadRepo, ProfileRepo } from '@edusphere/supabase-client';

export async function leadsHandler(ctx: Context) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const supabase = createSupabaseServerClient();
  await setTelegramContext(supabase, telegramId);
  const leadRepo = new LeadRepo(supabase);
  const profileRepo = new ProfileRepo(supabase);
  const adminProfile = await profileRepo.getByTelegramId(telegramId);

  const page = Number((ctx.message?.text ?? '').split(' ')[1]) || 1;
  const pageSize = 5;

  const leads = await leadRepo.getPageByCenter(adminProfile?.center_id ?? null, page, pageSize);

  if (!leads.length) {
    await ctx.reply('Заявок нет.');
    return;
  }

  const text = leads.map((lead, idx) => {
    return `${(page-1)*pageSize + idx + 1}. ${lead.course_id} — ${lead.status} (${lead.score}%)`;
  }).join('\n');

  const keyboard = {
    inline_keyboard: [
      page > 1 ? [{ text: '⬅️ Назад', callback_data: `leads_page:${page-1}` }] : [],
      leads.length === pageSize ? [{ text: 'Вперёд ➡️', callback_data: `leads_page:${page+1}` }] : [],
    ].filter(row => row.length),
  };

  await ctx.reply(`📋 Заявки (стр. ${page}):\n${text}`, { reply_markup: keyboard });
}
