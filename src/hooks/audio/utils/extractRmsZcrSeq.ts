import { mixToMono } from "./mixToMono";
import { normalizeInPlace } from "./normalizeInPlace";
import { rms } from "./rms";
import { zcr } from "./zcr";

export function extractRmsZcrSeq(
  buf: AudioBuffer,
  frameSize: number,
  hop: number
) {
  const mono =
    buf.numberOfChannels > 1 ? mixToMono(buf) : buf.getChannelData(0).slice();
  normalizeInPlace(mono);

  const seq: number[][] = [];
  for (let i = 0; i + frameSize <= mono.length; i += hop) {
    const frame = mono.subarray(i, i + frameSize);
    seq.push([rms(frame), zcr(frame)]);
  }
  return seq;
}
