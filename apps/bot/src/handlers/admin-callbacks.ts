import { Context } from 'grammy';
import { createSupabaseServerClient, LeadRepo, ProfileRepo } from '@edusphere/supabase-client';
import { setTelegramContext } from '@edusphere/supabase-client';

export async function adminCallbacks(ctx: Context) {
  const callbackData = ctx.callbackQuery?.data;
  if (!callbackData) return;

  if (callbackData.startsWith('leads_page:')) {
    const page = parseInt(callbackData.split(':')[1]!);
    const telegramId = ctx.from?.id;
    if (!telegramId) return;
    const supabase = createSupabaseServerClient();
    await setTelegramContext(supabase, telegramId);
    const leadRepo = new LeadRepo(supabase);
    const profileRepo = new ProfileRepo(supabase);
    const adminProfile = await profileRepo.getByTelegramId(telegramId);
    const leads = await leadRepo.getPageByCenter(adminProfile?.center_id ?? null, page, 5);

    const text = leads.map((lead, idx) => {
      return `${(page-1)*5 + idx + 1}. ${lead.course_id} — ${lead.status} (${lead.score}%)`;
    }).join('\n');

    const keyboard = {
      inline_keyboard: [
        page > 1 ? [{ text: '⬅️ Назад', callback_data: `leads_page:${page-1}` }] : [],
        leads.length === 5 ? [{ text: 'Вперёд ➡️', callback_data: `leads_page:${page+1}` }] : [],
      ].filter(row => row.length),
    };

    await ctx.editMessageText(`📋 Заявки (стр. ${page}):\n${text}`, { reply_markup: keyboard });
    return;
  }

  const [action, leadId] = callbackData.split(':');
  const supabase = createSupabaseServerClient();
  const leadRepo = new LeadRepo(supabase);

  switch (action) {
    case 'admin:call': {
      const phone = await getLeadPhone(leadId!, supabase);
      if (phone) {
        await ctx.answerCallbackQuery({ url: `tel:${phone}` });
      } else {
        await ctx.answerCallbackQuery({ text: 'Номер телефона не найден', show_alert: true });
      }
      break;
    }
    case 'admin:enroll': {
      await leadRepo.updateStatus(leadId!, 'enrolled', { enrolled_at: new Date().toISOString() });
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.answerCallbackQuery({ text: 'Студент зачислен ✅' });
      break;
    }
    default:
      break;
  }
}

async function getLeadPhone(leadId: string, supabase: any): Promise<string | null> {
  const { data } = await supabase
    .from('leads')
    .select('profiles(phone)')
    .eq('id', leadId)
    .single();
  return data?.profiles?.phone ?? null;
}