export const SCORE_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 75,
  PASS: 65,
  FAIL: 64,
} as const;

export function getScoreFeedback(score: number): {
  status: "excellent" | "good" | "pass" | "fail";
  message: string;
  color: string;
} {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) {
    return {
      status: "excellent",
      message: "🎯 Pronúncia excelente! Parabéns!",
      color: "text-green-500",
    };
  } else if (score >= SCORE_THRESHOLDS.GOOD) {
    return {
      status: "good",
      message: "✅ Pronúncia muito boa! Continue assim!",
      color: "text-green-400",
    };
  } else if (score >= SCORE_THRESHOLDS.PASS) {
    return {
      status: "pass",
      message: "⚠️ Pronúncia aceitável. Pode melhorar!",
      color: "text-yellow-500",
    };
  } else {
    return {
      status: "fail",
      message: "❌ Precisa praticar mais. Tente novamente!",
      color: "text-red-500",
    };
  }
}
