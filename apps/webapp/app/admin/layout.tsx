'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/validate-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: window.Telegram.WebApp.initData }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.valid) setAuthorized(true);
        else router.push('/');
      });
  }, [router]);

  if (!authorized) return <div>Проверка доступа...</div>;
  return <>{children}</>;
}