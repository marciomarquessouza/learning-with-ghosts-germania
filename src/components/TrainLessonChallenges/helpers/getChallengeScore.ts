import { ChallengeResult } from "@/types";
import { getPronunciationChallengeScore } from "./getPronunciationChallengeScore";
import { getWritingChallengeScore } from "./getWritingChallengeScore";

export interface ChallengeScoreResult {
  isCorrect: boolean;
  type: "coal" | "attack" | "hate";
  value: number;
}

export function getChallengeScore(
  command: "attack" | "coal",
  challengeResult: ChallengeResult
): ChallengeScoreResult | null {
  const { result } = challengeResult;

  if (result.type === "pronunciation") {
    return getPronunciationChallengeScore(command, result.scoreResult);
  } else if (result.type === "writing") {
    return getWritingChallengeScore(command, result.scoreResult);
  }

  return null;
}
