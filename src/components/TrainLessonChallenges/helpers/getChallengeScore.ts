import { ChallengeResult } from "@/types";

export interface ChallengeScoreResult {
  score: number;
  isCorrect: boolean;
  coalEarned: number;
  attackPower: number;
  hate: number
}

export function getChallengeScore(challengeResult: ChallengeResult): ChallengeScoreResult | null {
    const { totalTime, result } = challengeResult;

    if (result.type === "pronunciation") {
        // TODO: calculate score based on pronunciation result
    } else if (result.type === "writing") {
        // TODO: calculate score based on writing result
    }

    return null
}