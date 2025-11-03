/* eslint-disable @typescript-eslint/no-explicit-any */
import Meyda from "meyda";

export function mfccSeqFromSignal(
  signal: Float32Array,
  sampleRate: number,
  frameSize = 1024,
  hop = 512,
  nMfcc = 13,
  melBands = 26
): number[][] {
  const prev = {
    sampleRate: (Meyda as any).sampleRate,
    bufferSize: (Meyda as any).bufferSize,
    melBands: (Meyda as any).melBands,
    numberOfMFCCCoefficients: (Meyda as any).numberOfMFCCCoefficients,
    windowingFunction: (Meyda as any).windowingFunction,
  };

  (Meyda as any).sampleRate = sampleRate;
  (Meyda as any).bufferSize = frameSize;
  (Meyda as any).melBands = melBands;
  (Meyda as any).numberOfMFCCCoefficients = nMfcc;
  (Meyda as any).windowingFunction = "hanning"; // opcional

  const seq: number[][] = [];
  for (let i = 0; i + frameSize <= signal.length; i += hop) {
    const frame = signal.subarray(i, i + frameSize); // length === bufferSize
    const mfcc = Meyda.extract("mfcc", frame) as number[] | null;
    if (mfcc && mfcc.length) seq.push(mfcc);
  }

  (Meyda as any).sampleRate = prev.sampleRate;
  (Meyda as any).bufferSize = prev.bufferSize;
  (Meyda as any).melBands = prev.melBands;
  (Meyda as any).numberOfMFCCCoefficients = prev.numberOfMFCCCoefficients;
  (Meyda as any).windowingFunction = prev.windowingFunction;

  return seq;
}
