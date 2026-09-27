import { PronunciationScore } from "@/libs/lesson/PronunciationAPI";
import { getMatchedTargetIndexes } from "./helpers/getMatchedTargetIndexes";
import { normalizeWithOriginalIndex } from "./helpers/normalizeWithOriginalIndex";

export function calculatePronunciationScore(
  target: string,
  transcript: string,
): PronunciationScore {
  const targetChars = Array.from(target);

  const normalizedTarget = normalizeWithOriginalIndex(target);
  const normalizedTranscript = normalizeWithOriginalIndex(transcript);

  const targetSequence = normalizedTarget.map((item) => item.character);
  const transcriptSequence = normalizedTranscript.map((item) => item.character);

  const matchedTargetIndexes = getMatchedTargetIndexes(
    targetSequence,
    transcriptSequence,
  );

  const matchedOriginalIndexes = new Set<number>();

  matchedTargetIndexes.forEach((isMatched, index) => {
    if (isMatched) {
      matchedOriginalIndexes.add(normalizedTarget[index].originalIndex);
    }
  });

  const comparableTargetLength = normalizedTarget.length;
  const totalMatched = matchedTargetIndexes.filter(Boolean).length;

  const accuracyPercentage =
    comparableTargetLength === 0
      ? 0
      : Math.round((totalMatched / comparableTargetLength) * 100);

  return {
    accuracyPercentage,
    characters: targetChars.map((character, index) => {
      const isComparableCharacter = normalizedTarget.some(
        (item) => item.originalIndex === index,
      );
      return {
        id: `${index}-${character}`,
        character,
        found: isComparableCharacter ? matchedOriginalIndexes.has(index) : true,
      };
    }),
  };
}
