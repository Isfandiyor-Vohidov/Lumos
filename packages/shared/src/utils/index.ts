export function calculateScore(answers: { selected_index: number; correct_index: number }[]): number {
  if (answers.length === 0) return 0;
  const correct = answers.filter((a) => a.selected_index === a.correct_index).length;
  return Math.round((correct / answers.length) * 100);
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}