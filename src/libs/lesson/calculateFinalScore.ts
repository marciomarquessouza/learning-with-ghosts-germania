import { EntryScore } from "./LessonScore";

export function calculateFinalScore(entryScore: EntryScore): number {
  const scores = Object.values(entryScore).filter(
    (score): score is number => score !== undefined,
  );

  if (scores.length === 0) return 0;

  const scoreWeight = 1 / scores.length;

  const finalScore = scores.reduce(
    (total, value) => total + value * scoreWeight,
    0,
  );

  return Number(Math.max(0, finalScore).toFixed(2));
}
