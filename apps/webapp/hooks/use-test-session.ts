'use client';
import { useState, useCallback } from 'react';
import type { TestSession } from '@edusphere/shared';

export function useTestSession() {
  const [session, setSession] = useState<TestSession | null>(null);

  const startSession = useCallback(async (courseId: string) => {
    const res = await fetch('/api/test-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-telegram-init-data': window.Telegram.WebApp.initData },
      body: JSON.stringify({ course_id: courseId }),
    });
    const data = await res.json();
    setSession(data);
  }, []);

  const saveAnswers = useCallback(async (answers: any[]) => {
    if (!session) return;
    await fetch('/api/test-session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-telegram-init-data': window.Telegram.WebApp.initData },
      body: JSON.stringify({ session_id: session.id, answers }),
    });
  }, [session]);

  const submitAnswers = useCallback(async () => {
    if (!session) return null;
    const res = await fetch('/api/submit-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-telegram-init-data': window.Telegram.WebApp.initData },
      body: JSON.stringify({ session_id: session.id, answers: session.answers }),
    });
    return res.json();
  }, [session]);

  return { session, startSession, saveAnswers, submitAnswers };
}