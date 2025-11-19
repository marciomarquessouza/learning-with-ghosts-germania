import { useMemo } from "react";
import { createLetterGrid, LetterSlot } from "./utils/createLetterGrid";
import { AnswerHighlightCircle } from "./AnswerHighlightCircle";
import { motion } from "framer-motion";
import { PreparedTarget } from "./utils/prepareTarget";

export interface LetterGridProps {
  target: string;
  preparedTarget: PreparedTarget;
  answerIndexes: number[];
  clearIndexes: () => void;
  onClickSlot: (slot: LetterSlot) => void;
  removeIndex: (index: number) => void;
}

const CELL_SIZE = 96;
const GAP = 8;

const WORD_COLORS = [
  "#FFB300",
  "#1BA9F5",
  "#D726FF",
  "#9AF50F",
  "#E92E2E",
  "#FF8A00",
  "#FFA733",
  "#E69900",
  "#D68A00",
];

type Point = { x: number; y: number };

function getCenter(row: number, col: number): Point {
  const x = col * (CELL_SIZE + GAP) + CELL_SIZE / 2;
  const y = row * (CELL_SIZE + GAP) + CELL_SIZE / 2;
  return { x, y };
}

export function LetterGrid({
  target,
  answerIndexes,
  preparedTarget,
  onClickSlot,
  clearIndexes,
  removeIndex,
}: LetterGridProps) {
  const grid = useMemo(
    () =>
      createLetterGrid({
        target,
        preparedTarget,
        size: { h: 4, w: 4 },
      }),
    [target, preparedTarget]
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
    const indexToInfo: Record<
      number,
      { row: number; col: number; wordIndex: number }
    > = {};

    grid.forEach((rowSlots, row) => {
      rowSlots.forEach((slot, col) => {
        if (slot.index !== null && slot.isAnswer) {
          indexToInfo[slot.index] = {
            row,
            col,
            wordIndex: slot.wordIndex!,
          };
        }
      });
    });

    const points: { point: Point; wordIndex: number }[] = [];

    answerIndexes.forEach((answerIndex) => {
      const info = indexToInfo[answerIndex];
      if (!info) return;
      points.push({
        point: getCenter(info.row, info.col),
        wordIndex: info.wordIndex,
      });
    });

    if (points.length < 2) return [];

    const segments: {
      from: Point;
      to: Point;
      key: number;
      wordIndex: number;
    }[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];

      if (curr.wordIndex === next.wordIndex) {
        segments.push({
          from: curr.point,
          to: next.point,
          key: i,
          wordIndex: curr.wordIndex,
        });
      }
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
            {lineSegments.map(({ from, to, key, wordIndex }) => (
              <motion.line
                key={key}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={WORD_COLORS[wordIndex % WORD_COLORS.length]}
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
                  <AnswerHighlightCircle
                    color={WORD_COLORS[slot?.wordIndex || 0]}
                  />
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
