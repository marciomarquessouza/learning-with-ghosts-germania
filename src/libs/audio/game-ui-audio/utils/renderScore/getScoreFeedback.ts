import { PRONUNCIATION_FEEDBACK_THRESHOLDS } from "@/constants/game";

export function getScoreFeedback(score: number): {
  status: "excellent" | "good" | "pass" | "fail";
  message: string;
  color: string;
} {
  if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.EXCELLENT) {
    return {
      status: "excellent",
      message: "🎯 Pronúncia excelente! Parabéns!",
      color: "text-green-500",
    };
  } else if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.GOOD) {
    return {
      status: "good",
      message: "✅ Pronúncia muito boa! Continue assim!",
      color: "text-green-400",
    };
  } else if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.PASS) {
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
