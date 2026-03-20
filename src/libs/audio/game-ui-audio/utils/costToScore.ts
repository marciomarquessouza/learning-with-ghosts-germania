export function costToScore(
  cost: number,
  maxCostForPerfect: number = 0.22
): number {
  // Calibrated based on your results
  const min = maxCostForPerfect;
  const max = 0.65; // Reduced from 0.8 to spread scores more

  if (cost <= min) return 100;
  if (cost >= max) return 0;

  const t = (cost - min) / (max - min);
  const score = 100 * (1 - t);

  return Math.round(score);
}
