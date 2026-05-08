import './globals.css';
import { TelegramProvider } from '@/providers/telegram-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}