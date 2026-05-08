import type { AssessmentOutput } from './types';

export function fallbackAssessment(score: number): AssessmentOutput {
  let level = 'Intermediate';
  if (score >= 90) level = 'Advanced';
  else if (score >= 70) level = 'Upper-Intermediate';
  else if (score >= 40) level = 'Intermediate';
  else level = 'Elementary';

  return {
    verdict: `AI unavailable. Auto-assessment based on score: ${score}% — ${level}`,
    weakAreas: [],
    strongAreas: [],
    recommendedCourse: level,
  };
}