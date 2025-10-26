import { mfccSeqFromSignal } from "./mfccSeqFromSignal";
import { toMonoNormalized } from "./toMonoNormalized";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ac = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate,
  });
  const buf = await ac.decodeAudioData(refArrayBuffer.slice(0));
  const mono = toMonoNormalized(buf);

  let start = 0,
    consec = 0,
    found = false;
  for (let i = 0; i + frameSize <= mono.length; i += hop) {
    const frame = mono.subarray(i, i + frameSize);
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

  // pega ~0.8s de fala
  const take = Math.min(mono.length - start, Math.floor(0.8 * sampleRate));
  const slice = mono.subarray(start, start + take);

  const sig = mfccSeqFromSignal(slice, sampleRate, frameSize, hop, 13, 26);
  try {
    await ac.close();
  } catch {}
  return sig;
}
