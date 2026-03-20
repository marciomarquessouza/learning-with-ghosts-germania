export function deltas(X: number[][], N = 2): number[][] {
  const T = X.length,
    D = X[0].length;
  const out = Array.from({ length: T }, () => new Array(D).fill(0));
  const denom = (2 * (N * (N + 1) * (2 * N + 1))) / 6;
  for (let t = 0; t < T; t++) {
    for (let d = 0; d < D; d++) {
      let num = 0;
      for (let n = 1; n <= N; n++) {
        const t1 = Math.min(T - 1, Math.max(0, t + n));
        const t2 = Math.min(T - 1, Math.max(0, t - n));
        num += n * (X[t1][d] - X[t2][d]);
      }
      out[t][d] = num / denom;
    }
  }
  return out;
}
