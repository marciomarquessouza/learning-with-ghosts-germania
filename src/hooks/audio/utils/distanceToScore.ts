export function distanceToScore(d: number) {
  const min = 0.1,
    max = 0.6;
  const t = Math.max(0, Math.min(1, (d - min) / (max - min)));
  return Math.round(100 * (1 - t));
}
