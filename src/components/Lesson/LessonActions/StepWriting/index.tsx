import { LessonEntry, LessonEntryStep } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioPlayback } from "./AudioPlayback";
import { AnswerContainer } from "./AnswerContainer";
import { LetterGrid } from "./LetterGrid";
import { LetterSlot } from "./utils/createLetterGrid";
import { BoardControls } from "./BoardControls";
import { prepareTarget } from "./utils/prepareTarget";

export interface StepWritingProps {
  show?: boolean;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  onClickNext: () => void;
}

export type Phases = "writing" | "result";

export function StepWriting({
  show = true,
  lessonEntry,
  onClickNext,
}: StepWritingProps) {
  const [answerIndexes, setAnswerIndexes] = useState<number[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const { audio, target } = lessonEntry;
  const [phase, setPhase] = useState<Phases>("writing");
  const preparedTarget = useMemo(() => prepareTarget(target), [target]);

  const handleBackspace = () => {
    const items = [...answerIndexes];
    items.pop();
    setAnswerIndexes(items);
  };

  const handleOnClickSlot = (slot: LetterSlot) => {
    const { index, isAnswer } = slot;
    if (!isAnswer) return;
    const sortedIndexes = [...answerIndexes, index!].sort();
    setAnswerIndexes(sortedIndexes);
  };

  const handleClearIndexes = () => {
    setAnswerIndexes([]);
  };

  const handleRemoveIndex = (indexToRemove: number) => {
    const newIndexes = answerIndexes.filter((index) => index !== indexToRemove);
    setAnswerIndexes(newIndexes);
  };

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [show]);

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
          <div className="relative justify-center items-center px-6 py-4">
            <AudioPlayback audio={audio} />
            <AnswerContainer
              answerIndexes={answerIndexes}
              preparedTarget={preparedTarget}
              onBackspace={handleBackspace}
            />
            <LetterGrid
              target={target}
              preparedTarget={preparedTarget}
              answerIndexes={answerIndexes}
              clearIndexes={handleClearIndexes}
              removeIndex={handleRemoveIndex}
              onClickSlot={handleOnClickSlot}
            />
            <BoardControls
              phase={phase}
              onClickNext={onClickNext}
              onClickPrevious={() => {}}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
