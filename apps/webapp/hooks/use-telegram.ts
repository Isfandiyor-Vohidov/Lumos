'use client';
import { useEffect, useState } from 'react';

export function useTelegram() {
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram) {
      setWebApp((window as any).Telegram.WebApp);
    }
  }, []);

  return webApp;
}