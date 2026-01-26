import { WritingScore } from "@/gameUI/LessonChallenges/StepWriting";
import { ChallengeScoreResult } from "./getChallengeScore";
import {
  HATE_PENALTY,
  MIN_COAL_REWARD,
  MAX_COAL_REWARD,
  MIN_ATTACK_REWARD,
  MAX_ATTACK_REWARD,
} from "@/constants/game";

type Command = "attack" | "coal";

const lerp = (min: number, max: number, t: number) => min + (max - min) * t;

const getRewardRange = (command: Command) => {
  return command === "attack"
    ? { min: MIN_ATTACK_REWARD, max: MAX_ATTACK_REWARD }
    : { min: MIN_COAL_REWARD, max: MAX_COAL_REWARD };
};

export function getWritingChallengeScore(
  command: Command,
  score: WritingScore
): ChallengeScoreResult {
  const { success, size, errors, tips } = score;

  if (!success || size === 0) {
    return {
      isCorrect: false,
      type: "hate",
      value: HATE_PENALTY,
    };
  }

  const accuracy = Math.max(0, (size - errors) / size);
  const tipPenalty = Math.min(0.5, tips * 0.1);
  const finalScore = Math.max(0, accuracy - tipPenalty);
  const isCorrect = finalScore >= 0.7;

  if (!isCorrect) {
    return {
      isCorrect: false,
      type: "hate",
      value: HATE_PENALTY,
    };
  }

  const { min, max } = getRewardRange(command);
  const reward = Math.round(lerp(min, max, finalScore));

  return {
    isCorrect: true,
    type: command,
    value: reward,
  };
}
