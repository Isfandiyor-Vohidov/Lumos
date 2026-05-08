export interface TestState {
  sessionId: string;
  courseId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: { question_id: string; selected_index: number }[];
  finished: boolean;
}