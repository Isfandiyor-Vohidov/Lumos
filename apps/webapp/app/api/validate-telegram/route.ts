import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramInitData } from '@/lib/telegram-validator';

export async function POST(req: NextRequest) {
  const { initData } = await req.json();
  const botToken = process.env.BOT_TOKEN!;
  const result = validateTelegramInitData(initData, botToken);
  return NextResponse.json(result);
}