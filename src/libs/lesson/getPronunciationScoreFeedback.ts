import { PRONUNCIATION_FEEDBACK_THRESHOLDS } from "@/constants/game";

export function getPronunciationScoreFeedback(score: number): {
  status: "excellent" | "good" | "pass" | "fail";
  headline: string;
  label: string;
  barColor: string;
} {
  if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.EXCELLENT) {
    return {
      status: "excellent",
      headline: "That sounded natural and clear.",
      label: "NATURAL",
      barColor: "bg-emerald-500",
    };
  } else if (score >= PRONUNCIATION_FEEDBACK_THRESHOLDS.PASS) {
    return {
      status: "good",
      headline: "Very close — just a few small details.",
      label: "ALMOST THERE",
      barColor: "bg-amber-500",
    };
  } else {
    return {
      status: "fail",
      headline: "Not quite there yet. Listen once more and try again.",
      label: "TRY AGAIN",
      barColor: "bg-red-600/80",
    };
  }
}
