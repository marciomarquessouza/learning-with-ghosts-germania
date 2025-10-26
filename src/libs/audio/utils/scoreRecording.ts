import { cmvn } from "./cmvn";
import { costToScore } from "./costToScore";
import { frameRms } from "./frameRms";
import { mfccSeq } from "./mfccSeq";
import { subsequenceDtwMin } from "./subsequenceDtwMin";
import { toMonoNormalized } from "./toMonoNormalized";
import { trimSilence } from "./trimSilence";
import { withDynamics } from "./withDynamics";

export type ScoreResult = {
  score: number;
  distance: number;
  durRef: number;
  durUser: number;
  durRatio: number;
  meanRmsUser: number;
};

export async function scoreRecording(
  refArrayBuffer: ArrayBuffer,
  userBlob: Blob,
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
  const sampleRate = opts?.sampleRate ?? 16000;
  const frameSize = opts?.frameSize ?? 1024;
  const hop = opts?.hop ?? 256;
  const vadR = opts?.vadRms ?? 0.008;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ac = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate,
  });

  try {
    const [refBuf, userBuf] = await Promise.all([
      ac.decodeAudioData(refArrayBuffer.slice(0)),
      userBlob.arrayBuffer().then((ab) => ac.decodeAudioData(ab)),
    ]);

    const durRef = refBuf.duration;
    const durUser = userBuf.duration;
    const durRatio = durUser / Math.max(durRef, 1e-6);

    // mono + normalize
    let refMono = toMonoNormalized(refBuf);
    let usrMono = toMonoNormalized(userBuf);

    refMono = trimSilence(refMono, sampleRate, frameSize, hop, vadR, 2);
    usrMono = trimSilence(usrMono, sampleRate, frameSize, hop, vadR, 2);

    if (usrMono.length < frameSize * 2) {
      usrMono = toMonoNormalized(userBuf);
    }

    // MFCC
    let refM = mfccSeq(refMono, sampleRate, frameSize, hop, 13, 26);
    let usrM = mfccSeq(usrMono, sampleRate, frameSize, hop, 13, 26);

    // CMVN
    refM = cmvn(refM);
    usrM = cmvn(usrM);

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
    for (let i = 0; i + frameSize <= usrMono.length; i += hop) {
      sum += frameRms(usrMono.subarray(i, i + frameSize));
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
    try {
      await ac.close();
    } catch {}
  }
}
