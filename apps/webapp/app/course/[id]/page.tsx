'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Course } from '@edusphere/shared';
import { useTelegramContext } from '@/providers/telegram-provider';
import { useRouter } from 'next/navigation';

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const webApp = useTelegramContext();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/courses/${id}`, { headers: { 'x-telegram-init-data': webApp?.initData ?? '' } })
      .then(res => res.json())
      .then(setCourse);
  }, [id, webApp]);

  if (!course) return <div>Загрузка...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-lg mb-4">{course.description}</p>
      <p className="text-2xl font-bold mb-4">{course.price} ₽</p>
      <button
        onClick={() => router.push(`/test/${course.id}`)}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        Пройти тест
      </button>
    </div>
  );
}