import { AudioScoreSummary } from "@/libs/audio/useAudioScoreV2";
import { ChallengeScoreResult } from "./getChallengeScore";

export function getPronunciationChallengeScore(
  audioScoreSummary: AudioScoreSummary
): ChallengeScoreResult {
  const { status } = audioScoreSummary;
  switch (status) {
    case "excellent":
      return {
        score: 1,
        isCorrect: true,
        coalEarned: 1,
        attackPower: 1,
        hate: 0,
      };
    case "good":
      return {
        score: 0.8,
        isCorrect: true,
        coalEarned: 0.8,
        attackPower: 0.8,
        hate: 0,
      };
    case "pass":
      return {
        score: 0.6,
        isCorrect: true,
        coalEarned: 0.6,
        attackPower: 0.6,
        hate: 0,
      };
    case "fail":
    default:
      return {
        score: 0,
        isCorrect: false,
        coalEarned: 0,
        attackPower: 0,
        hate: 1,
      };
  }
}
