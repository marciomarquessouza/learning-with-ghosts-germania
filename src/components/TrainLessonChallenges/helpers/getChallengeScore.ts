import { ChallengeResult } from "@/types";
import { getPronunciationChallengeScore } from "./getPronunciationChallengeScore";
import { getWritingChallengeScore } from "./getWritingChallengeScore";

export interface ChallengeScoreResult {
  score: number;
  isCorrect: boolean;
  coalEarned: number;
  attackPower: number;
  hate: number;
}

export function getChallengeScore(
  challengeResult: ChallengeResult
): ChallengeScoreResult | null {
  const { result } = challengeResult;

  if (result.type === "pronunciation") {
    return getPronunciationChallengeScore(result.scoreResult);
  } else if (result.type === "writing") {
    return getWritingChallengeScore(result.scoreResult);
  }

  return null;
}
