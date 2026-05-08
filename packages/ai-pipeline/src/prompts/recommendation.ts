export function recommendationPrompt(score: number): string {
  return `Student scored ${score}%. Based on this, what course level would you recommend?`;
}