import { Context } from 'grammy';
import { createSupabaseServerClient, CourseRepo } from '@edusphere/supabase-client';

export async function inlineQueryHandler(ctx: Context) {
  const query = ctx.inlineQuery?.query?.trim().toLowerCase() ?? '';
  const supabase = createSupabaseServerClient();
  const courseRepo = new CourseRepo(supabase);
  const courses = await courseRepo.searchActive(query);

  const results = courses.slice(0, 10).map((course) => ({
    type: 'article' as const,
    id: course.id,
    title: course.title,
    description: course.description.slice(0, 100),
    input_message_content: {
      message_text: `📚 ${course.title}\n${course.description}\nСтоимость: ${course.price} руб.`,
    },
  }));

  await ctx.answerInlineQuery(results);
}