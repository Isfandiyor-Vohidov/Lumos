import type { Question } from '@edusphere/shared';

export interface AssessmentInput {
  questions: Pick<Question, 'question_text' | 'options' | 'correct_option_index'>[];
  answers: { question_id: string; selected_index: number }[];
}

export interface AssessmentOutput {
  verdict: string;
  recommendedCourse?: string;
  weakAreas: string[];
  strongAreas: string[];
}