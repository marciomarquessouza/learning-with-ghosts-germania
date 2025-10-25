import Meyda from "meyda";
import { mixToMono } from "./mixToMono";
import { normalizeInPlace } from "./normalizeInPlace";

export function extractMFCCs(
  buf: AudioBuffer,
  opts?: { frameSize?: number; hopSize?: number }
) {
  const frameSize = opts?.frameSize ?? 1024;
  const hopSize = opts?.hopSize ?? 512;

  const data =
    buf.numberOfChannels > 1 ? mixToMono(buf) : buf.getChannelData(0).slice();

  normalizeInPlace(data);

  const mfccSeq: number[][] = [];
  const analyzer = Meyda.createMeydaAnalyzer({
    audioContext: new AudioContext({ sampleRate: 16000 }),
    source: null,
    bufferSize: frameSize,
    featureExtractors: ["mfcc"],
    melBands: 26,
    numberOfMFCCCoefficients: 13,
    sampleRate: 16000,
  });

  for (let i = 0; i + frameSize <= data.length; i += hopSize) {
    const frame = data.slice(i, i + frameSize);
    const feats = Meyda.extract("mfcc", frame, {
      // @ts-expect-error: feature utilitária em array raw
      sampleRate: 16000,
      bufferSize: frameSize,
      melBands: 26,
      numberOfMFCCCoefficients: 13,
    });
    if (feats?.mfcc) mfccSeq.push(feats.mfcc as number[]);
  }

  return mfccSeq;
}
