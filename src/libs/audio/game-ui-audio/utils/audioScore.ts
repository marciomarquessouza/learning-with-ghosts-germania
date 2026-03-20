import { buildSignature } from "./buildSignature";
import { cmvn } from "./cmvn";
import { costToScore } from "./costToScore";
import { frameRms } from "./frameRms";
import { subsequenceDtwMin } from "./subsequenceDtwMin";
import { withDynamics } from "./withDynamics";

export type ScoreResult = {
  score: number;
  distance: number;
  durRef: number;
  durUser: number;
  durRatio: number;
  meanRmsUser: number;
};

export async function audioScore(
  audioBufferReference: AudioBuffer,
  audioBufferUserRecord: AudioBuffer,
  opts?: {
    sampleRate?: number;
    frameSize?: number;
    hop?: number;
    vadRms?: number;
    minDurationSec?: number;
    maxDurationSec?: number;
    minMeanRms?: number;
    windowRatioMin?: number;
    windowRatioMax?: number;
    maxCostForPerfect?: number;
  }
): Promise<ScoreResult> {
  const frameSize = opts?.frameSize ?? 1024;
  const hop = opts?.hop ?? 256;

  try {
    const durRef = audioBufferReference.duration;
    const durUser = audioBufferUserRecord.duration;
    const durRatio = durUser / Math.max(durRef, 1e-6);

    const { signature: referenceSignature } = await buildSignature(
      audioBufferReference,
      {
        source: "reference",
      }
    );
    const { signature: userRecordSignature, mono: userRecordMono } =
      await buildSignature(audioBufferUserRecord, {
        source: "user",
      });

    // CMVN
    let refM = cmvn(referenceSignature);
    let usrM = cmvn(userRecordSignature);

    // deltas
    refM = withDynamics(refM);
    usrM = withDynamics(usrM);

    const cost = subsequenceDtwMin(
      refM,
      usrM,
      opts?.windowRatioMin ?? 0.6,
      opts?.windowRatioMax ?? 2.0
    );

    let score = costToScore(cost, opts?.maxCostForPerfect ?? 0.4);

    const minDur = opts?.minDurationSec ?? 0.3;
    const maxDur = opts?.maxDurationSec ?? 4.0;
    const minRms = opts?.minMeanRms ?? 0.01;

    // RMS
    let sum = 0,
      count = 0;
    for (let i = 0; i + frameSize <= userRecordMono.length; i += hop) {
      sum += frameRms(userRecordMono.subarray(i, i + frameSize));
      count++;
    }
    const meanRmsUser = count ? sum / count : 0;

    if (durUser < minDur) {
      const penalty = (1 - durUser / minDur) * 20;
      score = Math.max(30, score - penalty);
    }

    if (durUser > maxDur) {
      const penalty = Math.min(20, ((durUser - maxDur) / maxDur) * 30);
      score = Math.max(30, score - penalty);
    }

    if (meanRmsUser < minRms) {
      const penalty = (1 - meanRmsUser / minRms) * 15;
      score = Math.max(30, score - penalty);
    }

    return {
      score: Math.round(score),
      distance: cost,
      durRef,
      durUser,
      durRatio,
      meanRmsUser,
    };
  } finally {
  }
}
