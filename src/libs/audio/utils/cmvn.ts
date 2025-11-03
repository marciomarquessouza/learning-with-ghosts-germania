export function cmvn(signatureFrames: number[][]): number[][] {
  if (!signatureFrames.length) return signatureFrames;
  const dimensions = signatureFrames[0].length;
  const mu = new Array(dimensions).fill(0);
  const sig = new Array(dimensions).fill(0);
  for (let t = 0; t < signatureFrames.length; t++) {
    for (let d = 0; d < dimensions; d++) mu[d] += signatureFrames[t][d];
  }
  for (let d = 0; d < dimensions; d++) mu[d] /= signatureFrames.length;
  for (let t = 0; t < signatureFrames.length; t++) {
    for (let d = 0; d < dimensions; d++) {
      const z = signatureFrames[t][d] - mu[d];
      sig[d] += z * z;
    }
  }
  for (let d = 0; d < dimensions; d++)
    sig[d] = Math.sqrt(sig[d] / signatureFrames.length) || 1;
  const Y = signatureFrames.map((row) =>
    row.map((v, d) => (v - mu[d]) / sig[d])
  );
  return Y;
}
