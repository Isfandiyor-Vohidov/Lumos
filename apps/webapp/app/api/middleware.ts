import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramInitData } from '@/lib/telegram-validator';

export async function middleware(request: NextRequest) {
  const initData = request.headers.get('x-telegram-init-data');
  if (!initData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const botToken = process.env.BOT_TOKEN!;
  const validation = validateTelegramInitData(initData, botToken);
  if (!validation.valid || !validation.telegramId) {
    return NextResponse.json({ error: 'Invalid init data' }, { status: 403 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-telegram-id', validation.telegramId.toString());
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/api/courses/:path*', '/api/test-session/:path*', '/api/questions/:path*', '/api/submit-answers/:path*', '/api/payments/:path*'],
};