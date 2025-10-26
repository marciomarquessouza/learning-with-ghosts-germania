import { useEffect, useMemo, useState } from "react";
import { scoreRecording, ScoreResult } from "./utils/scoreRecording";
import { RecorderState } from "./useAudioRecorder";

export interface AudioScoreProps {
  refAB: ArrayBuffer | null;
  recorderState: RecorderState;
  lastBlob: Blob | null;
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

export function useAudioScore({
  refAB,
  recorderState,
  lastBlob,
}: AudioScoreProps) {
  const [score, setScore] = useState<ScoreResult | null>(null);

  useEffect(() => {
    if (recorderState !== "stopped") return;
    if (!lastBlob || !refAB) return;

    let cancelled = false;
    (async () => {
      const s = await scoreRecording(refAB, lastBlob!, SCORING_SETTINGS);
      if (!cancelled) setScore(s);
    })();

    return () => {
      cancelled = true;
    };
  }, [recorderState, lastBlob, refAB]);

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
