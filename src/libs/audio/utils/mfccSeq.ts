import Meyda from "meyda";

export function mfccSeq(
  signal: Float32Array,
  sampleRate: number,
  frameSize = 512,
  hop = 160,
  nMfcc = 13,
  melBands = 26
): number[][] {
  const seq: number[][] = [];
  for (let i = 0; i + frameSize <= signal.length; i += hop) {
    const frame = signal.subarray(i, i + frameSize);
    const v = Meyda.extract("mfcc", frame, {
      // @ts-expect-error: ""
      sampleRate,
      bufferSize: frameSize,
      melBands,
      numberOfMFCCCoefficients: nMfcc,
    }) as number[] | null;
    if (v && v.length) seq.push(v);
  }
  return seq;
}
