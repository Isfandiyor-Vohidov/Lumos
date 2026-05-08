'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const TelegramContext = createContext<any>(null);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    if (window.Telegram) {
      setWebApp(window.Telegram.WebApp);
    }
  }, []);

  return <TelegramContext.Provider value={webApp}>{children}</TelegramContext.Provider>;
}

export const useTelegramContext = () => useContext(TelegramContext);