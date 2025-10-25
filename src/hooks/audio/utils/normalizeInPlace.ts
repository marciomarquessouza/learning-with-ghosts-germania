export function normalizeInPlace(arr: Float32Array) {
  let m = 0;
  for (let i = 0; i < arr.length; i++) m = Math.max(m, Math.abs(arr[i]));
  if (m > 0) {
    for (let i = 0; i < arr.length; i++) arr[i] /= m;
  }
}
