import { Coordinate, directions, GridSize } from "./createLetterGrid";
import { createKey } from "./createKey";
import { shuffleArray } from "@/utils/shuffleArray";

export function generateAnswerPath(
  answerLength: number,
  gridSize: GridSize
): Coordinate[] | null {
  const { h: height, w: width } = gridSize;

  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const startRow = Math.floor(Math.random() * height);
    const startCol = Math.floor(Math.random() * width);

    const path: Coordinate[] = [{ row: startRow, col: startCol }];
    const usedCells = new Set<string>([createKey(startRow, startCol)]);

    function backtrack(stepIndex: number): boolean {
      if (stepIndex === answerLength) {
        return true;
      }

      const previous = path[stepIndex - 1];
      const shuffledDirections = shuffleArray(directions);

      for (const direction of shuffledDirections) {
        const nextRow = previous.row + direction.row;
        const nextCol = previous.col + direction.col;

        if (
          nextRow < 0 ||
          nextRow >= height ||
          nextCol < 0 ||
          nextCol >= width
        ) {
          continue;
        }

        const nextKey = createKey(nextRow, nextCol);
        if (usedCells.has(nextKey)) {
          continue;
        }

        path.push({ row: nextRow, col: nextCol });
        usedCells.add(nextKey);

        if (backtrack(stepIndex + 1)) {
          return true;
        }

        path.pop();
        usedCells.delete(nextKey);
      }

      return false;
    }

    const didFindPath = backtrack(1);
    if (didFindPath) {
      return path;
    }
  }

  return null;
}
