import { z } from 'zod';

export const InitDataSchema = z.object({
  initData: z.string(),
});

export const CourseListSchema = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    price: z.number(),
    mentor_name: z.string().nullable(),
    is_active: z.boolean(),
  })
);

export const TestStartRequestSchema = z.object({
  course_id: z.string().uuid(),
});

export const SubmitAnswerSchema = z.object({
  question_id: z.string().uuid(),
  selected_index: z.number().int().min(0),
});