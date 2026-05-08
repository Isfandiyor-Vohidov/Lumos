import { Bot } from 'grammy';
import { Lead } from '@edusphere/shared';
import { ProfileRepo } from '@edusphere/supabase-client';

export async function notifyAdminsAboutLead(
  bot: Bot,
  lead: Lead,
  supabase: any,
  profileRepo: ProfileRepo
) {
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

<b>Статус:</b> ${lead.status}
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [
        { text: '📞 Позвонить', callback_data: `admin:call:${lead.id}` },
        { text: '✅ Зачислить', callback_data: `admin:enroll:${lead.id}` },
      ],
    ],
  };

  for (const admin of admins) {
    await bot.api.sendMessage(admin.telegram_id, messageText, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  }
}

export async function notifyStudentStatusChange(
  bot: Bot,
  studentTelegramId: number,
  status: string,
  courseTitle: string
) {
  let text = '';
  switch (status) {
    case 'enrolled':
      text = `✅ Вы зачислены на курс «${courseTitle}». Ожидайте дальнейших инструкций.`;
      break;
    case 'rejected':
      text = `❌ Ваша заявка на курс «${courseTitle}» отклонена.`;
      break;
    case 'contacted':
      text = `📞 Мы скоро свяжемся с вами по поводу курса «${courseTitle}».`;
      break;
    default:
      return;
  }
  await bot.api.sendMessage(studentTelegramId, text);
}

export async function notifyPaymentConfirmation(
  bot: Bot,
  studentTelegramId: number,
  amount: number,
  currency: string,
  courseTitle: string
) {
  await bot.api.sendMessage(
    studentTelegramId,
    `💳 Платёж на сумму ${amount} ${currency} получен. Вы записаны на курс «${courseTitle}».`
  );
}

export async function notifyAdminsAboutPayment(
  bot: Bot,
  admins: { telegram_id: number }[],
  studentName: string,
  amount: number,
  currency: string
) {
  const msg = `💰 Новый платёж:\nСтудент: ${studentName}\nСумма: ${amount} ${currency}`;
  for (const admin of admins) {
    await bot.api.sendMessage(admin.telegram_id, msg);
  }
}