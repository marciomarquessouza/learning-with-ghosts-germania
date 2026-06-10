import { DeepgramTranscriptionResponse } from "@/server/types";

interface PronunciationCharacterResult {
  character: string;
  found: boolean;
}

interface PronunciationAnalysisResult {
  transcript: string;
  accuracyPercentage: number;
  characters: PronunciationCharacterResult[];
}

export function analyzePronunciationTarget(
  target: string,
  response: DeepgramTranscriptionResponse,
): PronunciationAnalysisResult {
  const transcript =
    response.results.channels[0]?.alternatives[0]?.transcript ?? "";

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
    transcript,
    accuracyPercentage,
    characters: targetChars.map((character, index) => {
      const isComparableCharacter = normalizedTarget.some(
        (item) => item.originalIndex === index,
      );

      return {
        character,
        found: isComparableCharacter ? matchedOriginalIndexes.has(index) : true,
      };
    }),
  };
}

function normalizeWithOriginalIndex(text: string) {
  return Array.from(text).flatMap((character, originalIndex) => {
    const normalized = character
      .toLowerCase()
      .replace(/ß/g, "ss")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

    return Array.from(normalized)
      .filter((char) => /[\p{L}\p{N}]/u.test(char))
      .map((char) => ({
        character: char,
        originalIndex,
      }));
  });
}

function getMatchedTargetIndexes(
  target: string[],
  transcript: string[],
): boolean[] {
  const targetLength = target.length;
  const transcriptLength = transcript.length;

  if (targetLength === 0) return [];

  const dp: number[][] = Array.from({ length: targetLength + 1 }, () =>
    Array(transcriptLength + 1).fill(0),
  );

  const operations: string[][] = Array.from({ length: targetLength + 1 }, () =>
    Array(transcriptLength + 1).fill(""),
  );

  for (let i = 1; i <= targetLength; i++) {
    dp[i][0] = i;
    operations[i][0] = "delete";
  }

  for (let j = 0; j <= transcriptLength; j++) {
    dp[0][j] = 0;
  }

  for (let i = 1; i <= targetLength; i++) {
    for (let j = 1; j <= transcriptLength; j++) {
      const isMatch = target[i - 1] === transcript[j - 1];

      const replaceCost = dp[i - 1][j - 1] + (isMatch ? 0 : 1);
      const deleteCost = dp[i - 1][j] + 1;
      const insertCost = dp[i][j - 1] + 1;

      const minCost = Math.min(replaceCost, deleteCost, insertCost);

      dp[i][j] = minCost;

      if (minCost === replaceCost) {
        operations[i][j] = isMatch ? "match" : "replace";
      } else if (minCost === deleteCost) {
        operations[i][j] = "delete";
      } else {
        operations[i][j] = "insert";
      }
    }
  }

  let bestEndIndex = 0;
  let bestCost = Infinity;

  for (let j = 0; j <= transcriptLength; j++) {
    if (dp[targetLength][j] < bestCost) {
      bestCost = dp[targetLength][j];
      bestEndIndex = j;
    }
  }

  const matched = Array(targetLength).fill(false);

  let i = targetLength;
  let j = bestEndIndex;

  while (i > 0) {
    const operation = operations[i][j];

    if (operation === "match") {
      matched[i - 1] = true;
      i--;
      j--;
    } else if (operation === "replace") {
      i--;
      j--;
    } else if (operation === "delete") {
      i--;
    } else if (operation === "insert") {
      j--;
    } else {
      i--;
    }
  }

  return matched;
}
