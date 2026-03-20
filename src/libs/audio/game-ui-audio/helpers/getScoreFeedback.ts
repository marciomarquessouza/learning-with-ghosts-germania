import { PRONUNCIATION_FEEDBACK_THRESHOLDS } from "@/constants/game";

export function getScoreFeedback(score: number): {
  status: "excellent" | "good" | "pass" | "fail";
  headline: string;
  label: string;
  textColor: string;
  barColor: string;
} {
  if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.EXCELLENT) {
    return {
      status: "excellent",
      headline: "That sounded natural and clear.",
      label: "NATURAL",
      textColor: "text-emerald-600",
      barColor: "bg-emerald-500",
    };
  } else if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.GOOD) {
    return {
      status: "good",
      headline: "Very close — just a few small details.",
      label: "ALMOST THERE",
      textColor: "text-lime-600",
      barColor: "bg-lime-500",
    };
  } else if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.PASS) {
    return {
      status: "pass",
      headline: "I can understand you. Let’s smooth it out a bit.",
      label: "UNDERSTANDABLE",
      textColor: "text-amber-600",
      barColor: "bg-amber-500",
    };
  } else {
    return {
      status: "fail",
      headline: "Not quite there yet. Listen once more and try again.",
      label: "TRY AGAIN",
      textColor: "text-red-700",
      barColor: "bg-red-600/80",
    };
  }
}