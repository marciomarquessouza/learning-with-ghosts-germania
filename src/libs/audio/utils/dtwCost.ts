import { cosineCost } from "./cosineCost";

export function dtwCost(A: number[][], B: number[][]): number {
  const n = A.length,
    m = B.length;
  if (!n || !m) return Infinity;
  const dp = Array.from({ length: n + 1 }, () =>
    new Float32Array(m + 1).fill(Infinity)
  );
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const c = cosineCost(A[i - 1], B[j - 1]);
      dp[i][j] = c + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[n][m] / (n + m);
}
