import { openaiAssessment } from './providers/openai';
import { buildPrompt } from './prompts/analyze-errors';
import { fallbackAssessment } from './fallback';
import type { AssessmentInput, AssessmentOutput } from './types';

export async function runAssessment(input: AssessmentInput): Promise<AssessmentOutput> {
  const prompt = buildPrompt(input);
  try {
    const timeout = new Promise<AssessmentOutput>((_, reject) =>
      setTimeout(() => reject(new Error('AI timeout')), 15000)
    );
    const result = await Promise.race([openaiAssessment(prompt), timeout]);
    return result;
  } catch {
    const score = input.answers.filter((a, i) => a.selected_index === input.questions[i]?.correct_option_index).length / input.questions.length * 100;
    return fallbackAssessment(score);
  }
}