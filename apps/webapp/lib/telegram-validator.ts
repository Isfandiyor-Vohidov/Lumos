import { createHmac } from 'crypto';

export function validateTelegramInitData(initData: string, botToken: string): { valid: boolean; telegramId?: number } {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (calculatedHash !== hash) return { valid: false };

  const user = JSON.parse(urlParams.get('user') || '{}');
  return { valid: true, telegramId: user.id };
}