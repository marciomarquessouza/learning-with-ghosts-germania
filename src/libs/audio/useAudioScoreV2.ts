import { useEffect, useMemo, useState } from "react";
import { scoreRecording, ScoreResult } from "./utils/scoreRecording";
import { RecorderState } from "./useAudioRecorder";
import { audioScore } from "./utils/audioScore";

export interface AudioScoreProps {
  audioBufferReference: AudioBuffer | null;
  audioBufferUserRecord: AudioBuffer | null;
  recorderState: RecorderState;
}

export const MAX_DURATION_SEC = 4.0;

const SCORING_SETTINGS = {
  frameSize: 1024,
  hop: 256,
  minDurationSec: 0.3,
  maxDurationSec: MAX_DURATION_SEC,
  minMeanRms: 0.02,
  vadRms: 0.012,
  windowRatioMin: 0.75,
  windowRatioMax: 1.7,
  maxCostForPerfect: 0.21, // <== Adjust here to calibrate the score
} as const;

export function useAudioScoreV2({
  audioBufferReference,
  audioBufferUserRecord,
  recorderState,
}: AudioScoreProps) {
  const [score, setScore] = useState<ScoreResult | null>(null);

  useEffect(() => {
    if (recorderState !== "stopped") return;
    if (!audioBufferReference || !audioBufferUserRecord) return;

    let cancelled = false;
    (async () => {
      const scoreResult = await audioScore(
        audioBufferReference,
        audioBufferUserRecord,
        SCORING_SETTINGS
      );
      if (!cancelled) setScore(scoreResult);
    })();

    return () => {
      cancelled = true;
    };
  }, [recorderState, audioBufferReference, audioBufferUserRecord]);

  const clearScore = () => {
    setScore(null);
  };

  return useMemo(
    () => ({
      score,
      clearScore,
    }),
    [score]
  );
}
