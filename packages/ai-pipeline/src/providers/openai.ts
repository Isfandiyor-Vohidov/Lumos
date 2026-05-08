import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type { AssessmentOutput } from '../types';

export async function openaiAssessment(prompt: string): Promise<AssessmentOutput> {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: z.object({
      verdict: z.string(),
      weakAreas: z.array(z.string()),
      strongAreas: z.array(z.string()),
      recommendedCourse: z.string().optional(),
    }),
    prompt,
  });
  return object;
}