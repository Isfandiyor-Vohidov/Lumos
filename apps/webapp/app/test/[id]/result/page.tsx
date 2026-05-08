'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const assessment = searchParams.get('assessment');

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Ваш результат</h1>
      <p className="text-lg">Баллы: {score}%</p>
      <p className="mt-2">{assessment}</p>
      <Link href="/" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl">
        Вернуться в каталог
      </Link>
    </div>
  );
}