'use client';
import { useEffect, useState } from 'react';
import { Course } from '@edusphere/shared';
import Link from 'next/link';
import { useTelegramContext } from '@/providers/telegram-provider';

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const webApp = useTelegramContext();

  useEffect(() => {
    fetch('/api/courses', {
      headers: { 'x-telegram-init-data': webApp?.initData ?? '' },
    })
      .then(res => res.json())
      .then(setCourses);
  }, [webApp]);

  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
      {courses.map((course) => (
        <Link key={course.id} href={`/course/${course.id}`} className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
          <h2 className="text-xl font-bold">{course.title}</h2>
          <p className="text-gray-600">{course.description}</p>
          <p className="font-bold mt-2">{course.price} ₽</p>
        </Link>
      ))}
    </div>
  );
}