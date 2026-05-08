// Заглушка, если gemini не нужен сразу
import type { AssessmentOutput } from '../types';

export async function geminiAssessment(_prompt: string): Promise<AssessmentOutput> {
  throw new Error('Gemini provider not implemented');
}