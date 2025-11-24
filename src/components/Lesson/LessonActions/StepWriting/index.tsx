import { LessonEntry, LessonEntryStep } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioPlayback } from "./AudioPlayback";
import { AnswerContainer } from "./AnswerContainer";
import { LetterGrid } from "./LetterGrid";
import { LetterSlot } from "./utils/createLetterGrid";
import { BoardControls } from "./BoardControls";
import { prepareTarget } from "./utils/prepareTarget";
import { balanceGrind } from "./utils/balanceGrid";

export interface StepWritingProps {
  show?: boolean;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  onClickNext: () => void;
}

export type Phases = "writing" | "result:correct" | "result:fail";
export const DEFAULT_SLOT_QNT_W = 4;
export const DEFAULT_SLOT_QNT_H = 4;

export function StepWriting({
  show = true,
  lessonEntry,
  onClickNext,
}: StepWritingProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const { audio, target } = lessonEntry;
  const [phase, setPhase] = useState<Phases>("writing");
  const preparedTarget = useMemo(() => prepareTarget(target), [target]);
  const [answerIndexes, setAnswerIndexes] = useState<number[]>([0]);
  const nextIndex = useRef<number>(1);
  const { slotQntH, slotQntW } = useMemo(
    () => balanceGrind(preparedTarget),
    [preparedTarget]
  );

  const handleOnClickSlot = (slot: LetterSlot) => {
    if (phase !== "writing") return;
    const { index, isAnswer } = slot;
    if (!isAnswer) return;
    const sortedIndexes = [...answerIndexes, index!].sort();
    setNextIndex(index! + 1);
    setAnswerIndexes(sortedIndexes);
  };

  const setNextIndex = (newNextIndex: number) => {
    nextIndex.current = newNextIndex;
  };

  const handleClearIndexes = () => {
    if (phase !== "writing") {
      setPhase("writing");
    }
    setNextIndex(1);
    setAnswerIndexes([0]);
  };

  const handleRemoveIndex = (indexToRemove: number) => {
    if (phase !== "writing") return;
    const newIndexes = answerIndexes.filter((index) => index !== indexToRemove);
    const newNextIndex = nextIndex.current <= 1 ? 1 : nextIndex.current - 1;
    setNextIndex(newNextIndex);
    setAnswerIndexes(newIndexes);
  };

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [show]);

  useEffect(() => {
    const targetLen = preparedTarget.sanitizedTarget.length;

    const isLengthMatch = answerIndexes.length === targetLen;
    const isSequential = answerIndexes.every((idx, i) => idx === i);

    if (isLengthMatch && isSequential) {
      setPhase("result:correct");
    }
  }, [answerIndexes, preparedTarget.sanitizedTarget.length]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={boxRef}
          tabIndex={0}
          className={[
            "fixed left-1/2 top-1/2",
            "-translate-x-1/2 -translate-y-1/2",
            "shadow-xl outline-none",
          ].join(" ")}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-[#D9D9D9]/60 pointer-events-none" />
          <div className="relative flex flex-col justify-center items-center px-6 py-4">
            <AudioPlayback audio={audio} />
            <AnswerContainer
              answerIndexes={answerIndexes}
              preparedTarget={preparedTarget}
              showBackspace={false}
              phase={phase}
            />
            <LetterGrid
              target={target}
              preparedTarget={preparedTarget}
              answerIndexes={answerIndexes}
              nextIndex={nextIndex.current}
              clearIndexes={handleClearIndexes}
              removeIndex={handleRemoveIndex}
              onClickSlot={handleOnClickSlot}
              slotQntH={slotQntH}
              slotQntW={slotQntW}
            />
            <BoardControls
              phase={phase}
              onClickNext={onClickNext}
              onClickClear={handleClearIndexes}
              onClickPrevious={() => {}}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
