'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Question } from '@edusphere/shared';
import { useTestSession } from '@/hooks/use-test-session';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const { startSession, session } = useTestSession();
  const router = useRouter();

  useEffect(() => {
    if (courseId) startSession(courseId);
    fetch(`/api/questions?course_id=${courseId}`, {
      headers: { 'x-telegram-init-data': window.Telegram.WebApp.initData },
    })
      .then(res => res.json())
      .then(setQuestions);
  }, [courseId]);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // завершить тест
      fetch('/api/submit-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-telegram-init-data': window.Telegram.WebApp.initData },
        body: JSON.stringify({ session_id: session?.id, answers: questions.map((q, i) => ({ question_id: q.id, selected_index: newAnswers[i] ?? 0 })) }),
      })
        .then(res => res.json())
        .then((result) => {
          router.push(`/test/${courseId}/result?score=${result.score}&assessment=${encodeURIComponent(result.assessment.verdict)}`);
        });
    }
  };

  if (!questions.length) return <div>Загрузка...</div>;

  const currentQuestion = questions[currentIdx];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl mb-4">{currentQuestion.question_text}</h2>
      <div className="grid gap-3">
        {currentQuestion.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="bg-white border rounded-xl p-3 text-left hover:bg-gray-100"
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="mt-4 text-gray-500">{currentIdx + 1} / {questions.length}</p>
    </div>
  );
}