import { CELL_SIZE, GAP, Point } from "../LetterGrid";

export function getCenter(row: number, col: number): Point {
  return {
    x: col * (CELL_SIZE + GAP) + CELL_SIZE / 2,
    y: row * (CELL_SIZE + GAP) + CELL_SIZE / 2,
  };
}
