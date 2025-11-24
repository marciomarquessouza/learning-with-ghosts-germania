export const isSpace = (index: number, wordIndexes: number[]): boolean =>
  index + 1 < wordIndexes.length &&
  wordIndexes[index] !== wordIndexes[index + 1];
