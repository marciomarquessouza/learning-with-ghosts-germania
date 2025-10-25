import { cosine } from "./cosine";

export function dtwDistanceSeq(a: number[][], b: number[][]) {
  const n = a.length,
    m = b.length;
  if (!n || !m) return Infinity;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(Infinity)
  );
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const sim = cosine(a[i - 1], b[j - 1]);
      const cost = 1 - sim;
      dp[i][j] = cost + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  const pathCost = dp[n][m];

  return pathCost / (n + m);
}
