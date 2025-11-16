import { Coordinate, GridSize } from "./createLetterGrid";

export function generateFallbackPath(
  answerLength: number,
  gridSize: GridSize
): Coordinate[] {
  const { h: height, w: width } = gridSize;
  const path: Coordinate[] = [];

  for (let index = 0; index < answerLength; index += 1) {
    const row = Math.floor(index / width);
    const col = index % width;
    if (row >= height) {
      break;
    }
    path.push({ row, col });
  }

  return path;
}
