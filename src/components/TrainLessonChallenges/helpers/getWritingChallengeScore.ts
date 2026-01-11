import { WritingScore } from "@/components/LessonChallenges/StepWriting";
import { ChallengeScoreResult } from "./getChallengeScore";

export function getWritingChallengeScore(
  score: WritingScore
): ChallengeScoreResult {
  const { success, size, errors, tips } = score;

  if (!success || size === 0) {
    return {
      score: 0,
      isCorrect: false,
      coalEarned: 0,
      attackPower: 0,
      hate: 1,
    };
  }

  const accuracy = Math.max(0, (size - errors) / size);

  const tipPenalty = Math.min(0.5, tips * 0.1);

  const finalScore = Math.max(0, accuracy - tipPenalty);

  const isPerfect = errors === 0 && tips === 0;
  const isCorrect = finalScore >= 0.7;

  const coalEarned = isCorrect ? Math.ceil(finalScore) : 0;
  const attackPower = isCorrect ? Math.round(finalScore * 2) : 0;

  return {
    score: isPerfect ? 1 : Number(finalScore.toFixed(2)),
    isCorrect,
    coalEarned,
    attackPower,
    hate: isCorrect ? 0 : 1,
  };
}
