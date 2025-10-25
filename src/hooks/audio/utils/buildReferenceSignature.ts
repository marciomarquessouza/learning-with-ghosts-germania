import { mixToMono } from "./mixToMono";
import { normalizeInPlace } from "./normalizeInPlace";
import { rms } from "./rms";
import { zcr } from "./zcr";

export async function buildReferenceSignature(
  refArrayBuffer: ArrayBuffer,
  frameSize = 1024,
  hop = 512,
  vadRms = 0.015,
  minSpeechFrames = 6
) {
  const ctx = new AudioContext({ sampleRate: 16000 });
  const buf = await ctx.decodeAudioData(refArrayBuffer.slice(0));

  const mono =
    buf.numberOfChannels > 1 ? mixToMono(buf) : buf.getChannelData(0).slice();
  normalizeInPlace(mono);

  let start = 0,
    consec = 0,
    found = false;
  for (let i = 0; i + frameSize <= mono.length; i += hop) {
    const frame = mono.subarray(i, i + frameSize);
    if (rms(frame) >= vadRms) {
      consec++;
      if (consec >= minSpeechFrames) {
        start = Math.max(0, i - 2 * hop);
        found = true;
        break;
      }
    } else {
      consec = 0;
    }
  }
  if (!found) start = 0;

  const takeSamples = Math.min(
    mono.length - start,
    Math.floor(0.8 * ctx.sampleRate)
  );
  const end = start + takeSamples;

  const sig: number[][] = [];
  for (let i = start; i + frameSize <= end; i += hop) {
    const frame = mono.subarray(i, i + frameSize);
    sig.push([rms(frame), zcr(frame)]);
  }

  await ctx.close();
  return sig;
}
