import { generateAnswerPath } from "./generateAnswerPath";
import { generateFallbackPath } from "./generateFallbackPath";
import { PreparedTarget } from "./prepareTarget";

export type GridSize = {
  h: number;
  w: number;
};

export type LetterSlot = {
  letter: string;
  index: number | null; // position in the target word (ignoring spaces)
  isAnswer: boolean;
  wordIndex?: number | null;
};

type LetterGridArgs = {
  target: string;
  size: GridSize;
  preparedTarget: PreparedTarget;
};

export type Coordinate = { row: number; col: number };

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const directions: Coordinate[] = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
];

export function createLetterGrid({
  target,
  size,
  preparedTarget,
}: LetterGridArgs): LetterSlot[][] {
  const { sanitizedTarget, wordIndexes } = preparedTarget;

  const answerLength = sanitizedTarget.length;

  const totalCells = size.h * size.w;
  if (answerLength > totalCells) {
    throw new Error(
      `Target word "${target}" is too long for a ${size.h}x${size.w} grid.`
    );
  }

  let answerPath = generateAnswerPath(answerLength, size);
  if (!answerPath) {
    answerPath = generateFallbackPath(answerLength, size);
  }

  const emptyGrid: LetterSlot[][] = Array.from({ length: size.h }, () =>
    Array.from({ length: size.w }, () => ({
      letter: "",
      index: null,
      isAnswer: false,
    }))
  );

  // positions the word in the sequence of the path
  answerPath.forEach((position, answerIndex) => {
    const character = sanitizedTarget[answerIndex];
    emptyGrid[position.row][position.col] = {
      letter: character,
      index: answerIndex,
      isAnswer: true,
      wordIndex: wordIndexes[answerIndex],
    };
  });

  // Alphabet without target letters
  const targetLettersSet = new Set(sanitizedTarget.split(""));
  const distractorAlphabet = ALPHABET.split("").filter(
    (letter) => !targetLettersSet.has(letter)
  );

  // Fallback: if the word use all alphabet letters, use the default alphabet
  const alphabetForRandom =
    distractorAlphabet.length > 0 ? distractorAlphabet : ALPHABET.split("");

  // fill in the rest with random letters (removing target letters before)
  for (let row = 0; row < size.h; row += 1) {
    for (let col = 0; col < size.w; col += 1) {
      const cell = emptyGrid[row][col];
      if (!cell.letter) {
        const randomIndex = Math.floor(
          Math.random() * alphabetForRandom.length
        );
        emptyGrid[row][col] = {
          letter: alphabetForRandom[randomIndex],
          index: null,
          isAnswer: false,
        };
      }
    }
  }

  return emptyGrid;
}
