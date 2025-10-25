export function zcr(frame: Float32Array) {
  let c = 0;
  for (let i = 1; i < frame.length; i++) {
    if (frame[i - 1] >= 0 !== frame[i] >= 0) c++;
  }
  return c / frame.length;
}
