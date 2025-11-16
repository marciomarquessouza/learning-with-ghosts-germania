import { useMemo } from "react";
import { createLetterGrid, LetterSlot } from "./utils/createLetterGrid";
import { AnswerHighlightCircle } from "./AnswerHighlightCircle";
import { motion } from "framer-motion";

export interface LetterGridProps {
  target: string;
  answerIndexes: number[];
  clearIndexes: () => void;
  onClickSlot: (slot: LetterSlot) => void;
  removeIndex: (index: number) => void;
}

const CELL_SIZE = 96;
const GAP = 8;

type Point = { x: number; y: number };

function getCenter(row: number, col: number): Point {
  const x = col * (CELL_SIZE + GAP) + CELL_SIZE / 2;
  const y = row * (CELL_SIZE + GAP) + CELL_SIZE / 2;
  return { x, y };
}

export function LetterGrid({
  target,
  answerIndexes,
  onClickSlot,
  clearIndexes,
  removeIndex,
}: LetterGridProps) {
  const grid = useMemo(
    () => createLetterGrid({ target, size: { h: 4, w: 4 } }),
    [target]
  );

  const handleOnClickSlot = (slot: LetterSlot) => {
    const { isAnswer, index } = slot;

    if (!isAnswer || index == null) {
      clearIndexes();
      return;
    }

    const isAlreadySelected = answerIndexes.includes(index);

    if (isAlreadySelected) {
      removeIndex(index);
      return;
    }

    onClickSlot(slot);
  };

  const lineSegments = useMemo(() => {
    const indexToPosition: Record<number, { row: number; col: number }> = {};

    grid.forEach((rowSlots, row) => {
      rowSlots.forEach((slot, col) => {
        if (slot.index !== null && slot.isAnswer) {
          indexToPosition[slot.index] = { row, col };
        }
      });
    });

    const points: Point[] = [];

    answerIndexes.forEach((answerIndex) => {
      const position = indexToPosition[answerIndex];
      if (!position) return;
      points.push(getCenter(position.row, position.col));
    });

    if (points.length < 2) return [];

    const segments: { from: Point; to: Point; key: number }[] = [];
    for (let i = 0; i < points.length - 1; i += 1) {
      segments.push({ from: points[i], to: points[i + 1], key: i });
    }

    return segments;
  }, [grid, answerIndexes]);

  const svgWidth = CELL_SIZE * 4 + GAP * 3;
  const svgHeight = CELL_SIZE * 4 + GAP * 3;

  return (
    <div className="bg-black w-full p-4 flex flex-col justify-center items-center">
      <div className="relative" style={{ width: svgWidth, height: svgHeight }}>
        {lineSegments.length > 0 && (
          <svg
            className="pointer-events-none absolute top-0 left-0 z-10"
            width={svgWidth}
            height={svgHeight}
          >
            {lineSegments.map(({ from, to, key }) => (
              <motion.line
                key={key}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#FFB300"
                strokeWidth={40}
                strokeLinecap="round"
                opacity={0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              />
            ))}
          </svg>
        )}

        {grid.map((slots, indexRow) => (
          <div className="flex flex-row my-1" key={indexRow}>
            {slots.map((slot, indexSlot) => (
              <button
                key={indexSlot}
                className={[
                  "relative",
                  "bg-[#B40F00]",
                  "flex justify-center items-center",
                  "h-24 w-24 mx-1 cursor-pointer",
                ].join(" ")}
                onClick={() => handleOnClickSlot(slot)}
              >
                {slot.isAnswer && answerIndexes.includes(slot.index!) && (
                  <AnswerHighlightCircle />
                )}
                <p className="font-primary text-4xl text-[#FFF3E4] relative z-30">
                  {slot.letter.toUpperCase()}
                </p>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
