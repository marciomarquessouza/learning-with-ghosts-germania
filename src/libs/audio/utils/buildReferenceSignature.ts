import { downmix } from "./downmix";
import { normalizePeak } from "./normalizePeak";
import { mfccSeqFromSignal } from "./mfccSeqFromSignal";

export async function buildReferenceSignature(
  refArrayBuffer: ArrayBuffer,
  opts?: {
    sampleRate?: number;
    frameSize?: number;
    hop?: number;
    vadRms?: number;
    minSpeechFrames?: number;
  }
): Promise<number[][]> {
  const sampleRate = opts?.sampleRate ?? 16000;
  const frameSize = opts?.frameSize ?? 1024;
  const hop = opts?.hop ?? 512;
  const vadRms = opts?.vadRms ?? 0.015;
  const minSpeechFrames = opts?.minSpeechFrames ?? 6;

  const audioContext = new AudioContext();
  // The slice(0) is used to create a copy of the ArrayBuffer
  // and avoid the decodeAudioData change the original one.
  const audioBuffer = await audioContext.decodeAudioData(
    refArrayBuffer.slice(0)
  );

  const mono = downmix(audioBuffer);
  const monoPeakNormalized = normalizePeak(mono);

  let start = 0,
    consec = 0,
    found = false;
  for (let i = 0; i + frameSize <= monoPeakNormalized.length; i += hop) {
    const frame = monoPeakNormalized.subarray(i, i + frameSize);
    let s = 0;
    for (let k = 0; k < frame.length; k++) s += frame[k] * frame[k];
    const rms = Math.sqrt(s / frame.length);
    if (rms >= vadRms) {
      consec++;
      if (consec >= minSpeechFrames) {
        start = Math.max(0, i - 2 * hop);
        found = true;
        break;
      }
    } else consec = 0;
  }
  if (!found) start = 0;

  const take = Math.min(
    monoPeakNormalized.length - start,
    Math.floor(0.8 * sampleRate)
  );
  const slice = monoPeakNormalized.subarray(start, start + take);

  const sig = mfccSeqFromSignal(slice, sampleRate, frameSize, hop, 13, 26);
  try {
    await audioContext.close();
  } catch {}
  return sig;
}
