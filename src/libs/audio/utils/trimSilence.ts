import { frameRms } from "./frameRms";

export function trimSilence(
  signal: Float32Array,
  sampleRate: number,
  frameSize = 1024,
  hop = 256,
  vadRms = 0.008,
  minVoiceFrames = 2
) {
  if (signal.length === 0) return signal;

  let start = 0,
    consec = 0,
    foundStart = false;

  for (let i = 0; i + frameSize <= signal.length; i += hop) {
    const f = signal.subarray(i, i + frameSize);
    if (frameRms(f) >= vadRms) {
      consec++;
      if (consec >= minVoiceFrames) {
        start = Math.max(0, i - hop);
        foundStart = true;
        break;
      }
    } else {
      consec = Math.max(0, consec - 0.5);
    }
  }
  if (!foundStart) start = 0;

  let end = signal.length,
    consecEnd = 0,
    foundEnd = false;

  for (let i = signal.length - frameSize; i >= 0; i -= hop) {
    const f = signal.subarray(i, i + frameSize);
    if (frameRms(f) >= vadRms) {
      consecEnd++;
      if (consecEnd >= minVoiceFrames) {
        end = Math.min(signal.length, i + frameSize + hop);
        foundEnd = true;
        break;
      }
    } else {
      consecEnd = Math.max(0, consecEnd - 0.5);
    }
  }
  if (!foundEnd) end = signal.length;

  const minDuration = frameSize * 3;
  if (end <= start + minDuration) {
    return signal.slice();
  }

  const result = signal.subarray(start, end);
  return result;
}
