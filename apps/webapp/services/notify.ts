import { Bot } from 'grammy';
import { Lead } from '@edusphere/shared';
import { ProfileRepo } from '@edusphere/supabase-client';

export async function notifyAdminsAboutLead(bot: Bot, lead: Lead, supabase: any, profileRepo: ProfileRepo) {
  const admins = await profileRepo.getAdminsOfCenter(lead.center_id);
  if (!admins?.length) return;

  const studentProfile = await profileRepo.getById(lead.profile_id);
  const phone = studentProfile?.phone ?? 'нет';

  const messageText = `
<b>📥 Новая заявка</b>
<b>Студент:</b> ${studentProfile?.full_name ?? '—'}
<b>Телефон:</b> ${phone}
<b>Курс:</b> ${lead.course_id}
<b>Баллы:</b> ${lead.score}%
<b>Вердикт ИИ:</b> ${lead.ai_assessment}
`.trim();

  await bot.api.sendMessage(admins[0].telegram_id, messageText, { parse_mode: 'HTML' });
}