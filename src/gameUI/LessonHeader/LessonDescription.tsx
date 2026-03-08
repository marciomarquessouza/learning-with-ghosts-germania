import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type DescriptionPhases =
  | "hidden"
  | "entering"
  | "typing"
  | "ready"
  | "exiting";

export interface LessonDescriptionProps {
  isVisible: boolean;
  description: string;
  characterDetails: CharacterDetails;
  onPhaseChange: (phase: DescriptionPhases) => void;
}

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
  isVisible,
  description,
  characterDetails,
  onPhaseChange,
}: LessonDescriptionProps) {
  const [phase, setPhase] = useState<DescriptionPhases>("hidden");
  const { displayedText, setTextToType, startTyping, isComplete } =
    useTypewriter();
  const { characterName, honorific, hasHonorific } = characterDetails;
  const lastDescription = useRef("");

  const changePhase = useCallback(
    (nextPhase: DescriptionPhases) => {
      setPhase(nextPhase);
      onPhaseChange(nextPhase);
    },
    [onPhaseChange],
  );

  useEffect(() => {
    if (isVisible && phase === "hidden") {
      changePhase("entering");
      return;
    }

    if (!isVisible && phase !== "hidden" && phase !== "exiting") {
      changePhase("exiting");
    }
  }, [isVisible, phase, changePhase]);

  useEffect(() => {
    if (isComplete && phase === "typing") {
      changePhase("ready");
    }
  }, [isComplete, phase, changePhase]);

  useEffect(() => {
    if (
      description &&
      description !== lastDescription.current &&
      phase === "ready"
    ) {
      lastDescription.current = description;
      setTextToType(description);
      changePhase("typing");
      startTyping();
    }
  }, [description, phase, setTextToType, startTyping, changePhase]);

  const handleOnExit = () => {
    setPhase("hidden");
    onPhaseChange("hidden");
  };

  if (phase === "hidden") return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={handleOnExit}>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          onAnimationComplete={() => {
            if (phase === "entering") {
              lastDescription.current = description;
              setTextToType(description);
              changePhase("typing");
              startTyping();
            }
          }}
          className="pointer-events-none flex h-full w-full items-center px-12 text-white"
        >
          <div className="flex w-full flex-col items-center">
            <div className="mb-4 bg-[#FFF3E4] px-4 py-0">
              <p className="font-primary text-left text-lg font-semibold tracking-wide text-black">
                {`${hasHonorific ? `${honorific} ` : ""}${characterName}:`}
              </p>
            </div>

            <div className="w-3xl px-4">
              <p className="min-h-20 text-left font-mono text-xl leading-relaxed text-[#FFF3E4]">
                {displayedText}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
