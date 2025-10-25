import { distanceToScore } from "./distanceToScore";
import { dtwDistanceSeq } from "./dtwDistanceSeq";
import { extractRmsZcrSeq } from "./extractRmsZcrSeq";
import { mixToMono } from "./mixToMono";
import { normalizeInPlace } from "./normalizeInPlace";
import { rms } from "./rms";

export type ScoreResult = {
  score: number; // 0..100
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
    frameSize?: number;
    hop?: number;
    // regras simples extra (opcional)
    minDurationSec?: number; // ex: 0.35
    maxDurationSec?: number; // ex: 1.2
    minMeanRms?: number; // ex: 0.02 (após normalize)
  }
): Promise<ScoreResult> {
  const frameSize = opts?.frameSize ?? 1024;
  const hop = opts?.hop ?? 512;

  // Forçar sampleRate fixo ajuda; muitos browsers respeitam o sampleRate do AudioContext
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 16000,
  });

  try {
    const [refBuf, userBuf] = await Promise.all([
      ctx.decodeAudioData(refArrayBuffer.slice(0)),
      userBlob.arrayBuffer().then((ab) => ctx.decodeAudioData(ab)),
    ]);

    const durRef = refBuf.duration;
    const durUser = userBuf.duration;
    const durRatio = durUser / (durRef || 1);

    // features
    const refSeq = extractRmsZcrSeq(refBuf, frameSize, hop);
    const usrSeq = extractRmsZcrSeq(userBuf, frameSize, hop);

    // mean RMS do usuário (para feedback)
    const monoUser =
      userBuf.numberOfChannels > 1
        ? mixToMono(userBuf)
        : userBuf.getChannelData(0).slice();
    normalizeInPlace(monoUser);
    let sum = 0;
    for (let i = 0; i + frameSize <= monoUser.length; i += hop) {
      sum += rms(monoUser.subarray(i, i + frameSize));
    }
    const meanRmsUser = sum / Math.max(1, Math.floor(monoUser.length / hop));

    // DTW
    const distance = dtwDistanceSeq(refSeq, usrSeq);
    let score = distanceToScore(distance);

    // Regras simples opcionais para “endurecer”
    const minDur = opts?.minDurationSec ?? 0.35;
    const maxDur = opts?.maxDurationSec ?? 1.2;
    if (durUser < minDur) score = Math.min(score, 60); // penaliza fala muito curta
    if (durUser > maxDur) score = Math.min(score, 70); // penaliza fala muito longa
    const minRms = opts?.minMeanRms ?? 0.02;
    if (meanRmsUser < minRms) score = Math.min(score, 50); // “fale mais alto”

    return { score, distance, durRef, durUser, durRatio, meanRmsUser };
  } finally {
    try {
      await ctx.close();
    } catch {}
  }
}
