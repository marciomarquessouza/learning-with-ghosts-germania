import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { useTypewriter } from "@/hooks/useTypewriter";
import { LessonEntryStep } from "@/types";
import { useEffect, useRef, useState } from "react";
import { StepFlags } from "../hooks/reducers/lessonReducer";
import { AnimatePresence, motion } from "framer-motion";

export interface LessonDescriptionProps {
  visible: boolean;
  lessonStep: LessonEntryStep;
  stepFlags: StepFlags;
  characterDetails: CharacterDetails;
  onCompleteDescription?: () => void;
}

type Phases = "hide" | "entering" | "typing" | "ready";

const variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.5 },
  },
};

export function LessonDescription({
  visible,
  lessonStep,
  stepFlags,
  characterDetails,
  onCompleteDescription,
}: LessonDescriptionProps) {
  const [phase, setPhase] = useState<Phases>("hide");
  const { displayedText, setTextToType, startTyping, isComplete } =
    useTypewriter();
  const { characterName, honorific, hasHonorific } = characterDetails;
  const currentStep = useRef<number | null>(null);

  useEffect(() => {
    if (visible && currentStep.current !== stepFlags.stepIndex) {
      setTextToType(lessonStep.text);
      startTyping();
      setPhase("typing");
      currentStep.current = stepFlags.stepIndex;
    }
  }, [
    visible,
    lessonStep.text,
    stepFlags.stepIndex,
    setTextToType,
    startTyping,
  ]);

  useEffect(() => {
    if (phase === "typing" && isComplete) {
      onCompleteDescription?.();
      setPhase("ready");
    }
  }, [phase, isComplete, onCompleteDescription]);

  useEffect(() => {
    if (!visible) return;
    if (phase === "ready" && stepFlags.stepIndex !== currentStep.current) {
      setTextToType(lessonStep.text);
      setPhase("typing");
      startTyping();
      currentStep.current = stepFlags.stepIndex;
    }
  }, [
    visible,
    phase,
    stepFlags.stepIndex,
    lessonStep.text,
    setTextToType,
    startTyping,
  ]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setPhase("hide")}>
      {visible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          onAnimationComplete={() => {
            if (phase === "entering") {
              setPhase("typing");
              startTyping();
            }
          }}
          className="pointer-events-none flex h-full w-full items-center px-12 text-white"
        >
          <div className="flex flex-col items-center w-full">
            <div className="bg-[#FFF3E4] px-4 py-0 mb-4">
              <p className="text-lg font-primary font-semibold tracking-wide text-black text-left">
                {`${hasHonorific ? honorific + " " : ""}${characterName}`}:
              </p>
            </div>

            <div className="w-3xl px-4">
              <p className="font-mono text-xl text-[#FFF3E4] min-h-20 text-left leading-relaxed">
                {displayedText}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
