import { PronunciationResult } from "@/libs/lesson/PronunciationAPI";
import { calculatePronunciationScore } from "@/libs/pronunciation/calculatePronunciationScore";

export function createMockPronunciationResult(
  target: string,
): PronunciationResult {
  const transcript = target;
  const words = target.trim().split(/\s+/).filter(Boolean);

  return {
    pronunciationScore: calculatePronunciationScore(target, transcript),
    confidence: 0.99,
    transcript,
    words,
  };
}
