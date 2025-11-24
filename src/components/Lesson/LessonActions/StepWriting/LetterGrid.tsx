import { useMemo } from "react";
import { createLetterGrid, LetterSlot } from "./utils/createLetterGrid";
import { AnswerHighlightCircle } from "./AnswerHighlightCircle";
import { motion } from "framer-motion";
import { PreparedTarget } from "./utils/prepareTarget";
import { getWordColor } from "./utils/getWordColor";
import { getCenter } from "./utils/getCenter";
import { DEFAULT_SLOT_QNT_H, DEFAULT_SLOT_QNT_W } from ".";

export type Point = { x: number; y: number };
export interface LetterGridProps {
  target: string;
  preparedTarget: PreparedTarget;
  answerIndexes: number[];
  slotQntW?: number;
  slotQntH?: number;
  nextIndex: number;
  clearIndexes: () => void;
  onClickSlot: (slot: LetterSlot) => void;
  removeIndex: (index: number) => void;
}

export const CELL_SIZE = 96;
export const GAP = 8;

export function LetterGrid({
  target,
  answerIndexes,
  preparedTarget,
  nextIndex,
  slotQntW = DEFAULT_SLOT_QNT_W,
  slotQntH = DEFAULT_SLOT_QNT_H,
  onClickSlot,
  clearIndexes,
  removeIndex,
}: LetterGridProps) {
  const grid = useMemo(
    () =>
      createLetterGrid({
        target,
        preparedTarget,
        size: { h: slotQntH, w: slotQntW },
      }),
    [target, preparedTarget, slotQntH, slotQntW]
  );

  const handleOnClickSlot = (slot: LetterSlot) => {
    const { isAnswer, index } = slot;

    if (index === 0) {
      return;
    }

    if (!isAnswer || index == null) {
      clearIndexes();
      return;
    }

    const isAlreadySelected = answerIndexes.includes(index);

    if (isAlreadySelected) {
      removeIndex(index);
      return;
    }

    const isFirst = nextIndex === 0;

    if (isFirst && index === 0) {
      onClickSlot(slot);
      return;
    }

    if (!isFirst && index === nextIndex) {
      onClickSlot(slot);
      return;
    }

    clearIndexes();
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

    const points: {
      point: Point;
      wordIndex: number;
      answerIndex: number;
    }[] = [];

    answerIndexes.forEach((answerIndex) => {
      const info = indexToInfo[answerIndex];
      if (!info) return;

      points.push({
        point: getCenter(info.row, info.col),
        wordIndex: info.wordIndex,
        answerIndex,
      });
    });

    if (points.length < 2) return [];

    points.sort((a, b) => a.answerIndex - b.answerIndex);

    const segments = [];

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

  const svgWidth = useMemo(
    () => slotQntW * CELL_SIZE + (slotQntW - 1) * GAP,
    [slotQntW]
  );
  const svgHeight = useMemo(
    () => slotQntH * CELL_SIZE + (slotQntH - 1) * GAP,
    [slotQntH]
  );

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
                stroke={getWordColor(wordIndex)}
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
                  "shrink-0",
                ].join(" ")}
                onClick={() => handleOnClickSlot(slot)}
              >
                {slot.isAnswer && answerIndexes.includes(slot.index!) && (
                  <AnswerHighlightCircle
                    color={getWordColor(slot?.wordIndex || 0)}
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
