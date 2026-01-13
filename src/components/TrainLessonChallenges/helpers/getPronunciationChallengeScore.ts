import { AudioScoreSummary } from "@/libs/audio/useAudioScoreV2";
import { ChallengeScoreResult } from "./getChallengeScore";
import {
  HATE_PENALTY,
  MAX_ATTACK_REWARD,
  MAX_COAL_REWARD,
  MIN_ATTACK_REWARD,
  MIN_COAL_REWARD,
} from "@/constants/game";
import { ChallengeCommand } from "@/types";

const STATUS_MULTIPLIER: Record<AudioScoreSummary["status"], number> = {
  excellent: 1,
  good: 0.8,
  pass: 0.6,
  fail: 0,
};

const lerp = (min: number, max: number, t: number) => min + (max - min) * t;

const roundReward = (n: number) => Math.round(n); // ou Math.floor/ceil, depende do feeling

const getRewardRange = (command: ChallengeCommand) => {
  return command === "attack"
    ? { min: MIN_ATTACK_REWARD, max: MAX_ATTACK_REWARD }
    : { min: MIN_COAL_REWARD, max: MAX_COAL_REWARD };
};

export function getPronunciationChallengeScore(
  command: ChallengeCommand,
  audioScoreSummary: AudioScoreSummary
): ChallengeScoreResult {
  const { status } = audioScoreSummary;

  if (status === "fail") {
    return { isCorrect: false, type: "hate", value: HATE_PENALTY };
  }

  const t = STATUS_MULTIPLIER[status]; // 0.6 | 0.8 | 1
  const { min, max } = getRewardRange(command);

  return {
    isCorrect: true,
    type: command,
    value: roundReward(lerp(min, max, t)),
  };
}
