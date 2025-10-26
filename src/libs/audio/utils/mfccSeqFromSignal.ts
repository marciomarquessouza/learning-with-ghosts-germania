import Meyda from "meyda";

export function mfccSeqFromSignal(
  signal: Float32Array,
  sampleRate: number,
  frameSize = 1024,
  hop = 512,
  nMfcc = 13,
  melBands = 26
): number[][] {
  const seq: number[][] = [];
  for (let i = 0; i + frameSize <= signal.length; i += hop) {
    const frame = signal.subarray(i, i + frameSize);

    const mfcc = Meyda.extract("mfcc", frame, {
      // @ts-expect-error: feature utilitária em array raw
      sampleRate,
      bufferSize: frameSize,
      melBands,
      numberOfMFCCCoefficients: nMfcc,
    }) as number[] | null;

    if (mfcc && mfcc.length) seq.push(mfcc);
  }
  return seq;
}
