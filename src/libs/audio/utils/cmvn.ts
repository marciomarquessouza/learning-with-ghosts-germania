export function cmvn(X: number[][]): number[][] {
  if (!X.length) return X;
  const D = X[0].length;
  const mu = new Array(D).fill(0);
  const sig = new Array(D).fill(0);
  for (let t = 0; t < X.length; t++) {
    for (let d = 0; d < D; d++) mu[d] += X[t][d];
  }
  for (let d = 0; d < D; d++) mu[d] /= X.length;
  for (let t = 0; t < X.length; t++) {
    for (let d = 0; d < D; d++) {
      const z = X[t][d] - mu[d];
      sig[d] += z * z;
    }
  }
  for (let d = 0; d < D; d++) sig[d] = Math.sqrt(sig[d] / X.length) || 1;
  const Y = X.map((row) => row.map((v, d) => (v - mu[d]) / sig[d]));
  return Y;
}
