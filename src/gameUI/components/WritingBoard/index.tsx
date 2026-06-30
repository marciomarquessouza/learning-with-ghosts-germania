import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioPlayback } from "./AudioPlayback";
import { AnswerContainer } from "./AnswerContainer";
import { LetterGrid } from "./LetterGrid";
import { LetterSlot } from "./utils/createLetterGrid";
import { StepControls } from "./StepControls";
import { prepareTarget } from "./utils/prepareTarget";
import { balanceGrind } from "./utils/balanceGrid";
import { CornerLeft } from "./CornerLeft";
import { CornerRight } from "./CornerRight";
import { StepPhases } from "@/libs/lesson/types";
import { events } from "@/events/events";
import { ShowWritingBoardEvent, WritingResult } from "@/events/lesson/types";

export const DEFAULT_SLOT_QNT_W = 4;
export const DEFAULT_TOTAL_ERRORS = 5;
export const DEFAULT_TOTAL_TIPS = 3;
export const DEFAULT_SLOT_QNT_H = 4;

export function WritingBoard() {
  const [isVisible, setIsVisible] = useState(false);
  const [target, setTarget] = useState("");
  const onClickNextRef = useRef<(result: WritingResult) => void>(() => {});
  const onClickCancelRef = useRef<
    ((result: WritingResult) => void) | undefined
  >(undefined);
  const boxRef = useRef<HTMLDivElement>(null);
  const preparedTarget = useMemo(() => prepareTarget(target), [target]);
  const [phase, setPhase] = useState<StepPhases>("writing");
  const [answerIndexes, setAnswerIndexes] = useState<number[]>([0]);
  const [errors, setErrors] = useState(0);
  const [tips, setTips] = useState(0);
  const nextIndex = useRef<number>(1);
  const { slotQntH, slotQntW } = useMemo(
    () => balanceGrind(preparedTarget),
    [preparedTarget],
  );
  const handleOnClickSlot = (slot: LetterSlot) => {
    if (phase !== "writing") return;
    const { index, isAnswer } = slot;
    if (!isAnswer) return;
    const sortedIndexes = [...answerIndexes, index!].sort((a, b) => a - b);
    setNextIndex(index! + 1);
    setAnswerIndexes(sortedIndexes);
  };

  const setNextIndex = (newNextIndex: number) => {
    nextIndex.current = newNextIndex;
  };

  const handleRetry = () => {
    setPhase("writing");
    setNextIndex(1);
    setErrors(0);
    setTips(0);
    setAnswerIndexes([0]);
  };

  const handleOnError = useCallback(() => {
    if (phase !== "writing") return;
    setErrors((state) => state + 1);
  }, [phase]);

  const handleOnClickTip = useCallback(() => {
    if (phase !== "writing") return;
    if (tips < DEFAULT_TOTAL_TIPS) {
      const lastIndex =
        answerIndexes.length - 1 > 0
          ? answerIndexes[answerIndexes.length - 1]
          : 0;
      const newIndex = lastIndex + 1;
      setAnswerIndexes((state) => [...state, newIndex]);
      setNextIndex(newIndex + 1);
      setTips((state) => state + 1);
    }
  }, [phase, tips, answerIndexes]);

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [isVisible]);

  useEffect(() => {
    const handle = ({
      target,
      onClickNext,
      onClickCancel,
    }: ShowWritingBoardEvent) => {
      setTarget(target);
      setIsVisible(true);
      onClickNextRef.current = onClickNext;
      onClickCancelRef.current = onClickCancel;
    };
    events.lesson.sync.on("show-writing-board", handle);
    return () => events.lesson.sync.off("show-writing-board", handle);
  }, []);

  useEffect(() => {
    const targetLen = preparedTarget.sanitizedTarget.length;

    const isLengthMatch = answerIndexes.length === targetLen;
    const isSequential = answerIndexes.every((idx, i) => idx === i);

    if (isLengthMatch && isSequential) {
      setPhase("result:correct");
    }
  }, [answerIndexes, preparedTarget.sanitizedTarget.length, errors, tips]);

  useEffect(() => {
    if (errors >= DEFAULT_TOTAL_ERRORS) {
      setPhase("result:fail");
    }
  }, [errors, preparedTarget.sanitizedTarget.length, tips]);

  const onClickNext = () => {
    const result: WritingResult = {
      success: phase === "result:correct",
      size: preparedTarget.sanitizedTarget.length,
      errors,
      tips,
    };
    onClickNextRef.current(result);
    setIsVisible(false);
  };

  if (!isVisible && !(preparedTarget.wordCount > 0)) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
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
            <AudioPlayback target={target} />
            <AnswerContainer
              answerIndexes={answerIndexes}
              preparedTarget={preparedTarget}
              phase={phase}
            />
            <LetterGrid
              target={target}
              preparedTarget={preparedTarget}
              answerIndexes={answerIndexes}
              nextIndex={nextIndex.current}
              slotQntH={slotQntH}
              slotQntW={slotQntW}
              onError={handleOnError}
              onClickSlot={handleOnClickSlot}
            />
            <StepControls
              isLast={false}
              phase={phase}
              tipsDisabled={tips === DEFAULT_TOTAL_TIPS}
              onClickRetry={handleRetry}
              onClickTip={handleOnClickTip}
              onClickNext={onClickNext}
            />
            <CornerLeft totalTips={DEFAULT_TOTAL_TIPS} currentTips={tips} />
            <CornerRight
              totalErrors={DEFAULT_TOTAL_ERRORS}
              currentErrors={errors}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
