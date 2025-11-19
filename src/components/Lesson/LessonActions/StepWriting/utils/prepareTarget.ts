export type PreparedTarget = {
  sanitizedTarget: string;
  wordIndexes: number[];
  wordCount: number;
};

export function prepareTarget(target: string): PreparedTarget {
  let sanitizedTarget = "";
  const wordIndexes: number[] = [];

  let currentWordIndex = -1;
  let inWord = false;

  for (let i = 0; i < target.length; i++) {
    const ch = target[i];

    if (/\s/.test(ch)) {
      inWord = false;
      continue;
    }

    if (/\p{L}/u.test(ch)) {
      if (!inWord) {
        currentWordIndex += 1;
        inWord = true;
      }

      sanitizedTarget += ch.toUpperCase();
      wordIndexes.push(currentWordIndex);
    }
  }

  const wordCount = Math.max(currentWordIndex + 1, 0);

  return { sanitizedTarget, wordIndexes, wordCount };
}
