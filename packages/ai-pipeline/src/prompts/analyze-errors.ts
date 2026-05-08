import type { AssessmentInput } from '../types';

export function buildPrompt(input: AssessmentInput): string {
  const qa = input.questions.map((q, i) => {
    const answer = input.answers[i];
    const userChoice = q.options[answer?.selected_index ?? -1] ?? 'нет ответа';
    return `Q: ${q.question_text}\nOptions: ${q.options.join(', ')}\nUser picked: ${userChoice}\nCorrect: ${q.options[q.correct_option_index]}`;
  }).join('\n\n');

  return `Analyze the following placement test results. Identify weak areas, strong areas, and provide a concise verdict. Also recommend a suitable course level from: English Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced.\n\n${qa}\n\nOutput JSON with keys: verdict, weakAreas, strongAreas, recommendedCourse (optional).`;
}