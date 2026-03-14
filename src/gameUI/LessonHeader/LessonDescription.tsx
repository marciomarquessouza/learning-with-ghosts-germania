import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PressContinue } from "./PressContinue";
import { useDialogueKeyDown } from "@/hooks/useDialogueKeyDown";

export type DescriptionPhases =
  | "hidden"
  | "entering"
  | "typing"
  | "waiting"
  | "ready"
  | "exiting";

export interface LessonDescriptionProps {
  isVisible: boolean;
  description: string;
  characterDetails: CharacterDetails;
  onPhaseChange: (phase: DescriptionPhases) => void;
}

const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

const MAXIMUM_SIZE_FOR_CENTERED_TEXT = 48;

export function LessonDescription({
  isVisible,
  description,
  characterDetails,
  onPhaseChange,
}: LessonDescriptionProps) {
  const [phase, setPhase] = useState<DescriptionPhases>("hidden");
  const { displayedText, setTextToType, startTyping, resumeText, isComplete } =
    useTypewriter();
  const { characterName, honorific, hasHonorific } = characterDetails;
  const lastDescription = useRef("");
  const boxRef = useRef<HTMLDivElement>(null);

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
      changePhase("waiting");
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

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [isVisible]);

  const handleKeyDown = useDialogueKeyDown({
    keyAction: () => {
      if (phase === "typing") {
        return resumeText();
      }
      if (phase === "waiting") {
        return changePhase("ready");
      }
    },
  });

  if (phase === "hidden") return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={handleOnExit}>
      {isVisible && (
        <motion.div
          ref={boxRef}
          tabIndex={0}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          onKeyDown={handleKeyDown}
          onAnimationComplete={() => {
            if (phase === "entering") {
              lastDescription.current = description;
              setTextToType(description);
              changePhase("typing");
              startTyping();
            }
          }}
          className="pointer-events-none flex h-full w-full items-center px-12 text-white outline-none"
          role="dialog"
          aria-live="polite"
        >
          <div className="flex w-full flex-col items-center">
            <div className="my-2 bg-[#FFF3E4] px-4 py-0">
              <p className="font-primary text-left text-lg font-semibold tracking-wide text-black">
                {`${hasHonorific ? `${honorific} ` : ""}${characterName}:`}
              </p>
            </div>

            <div className="w-3xl px-4 items-center">
              <p
                style={{
                  textAlign:
                    description.length < MAXIMUM_SIZE_FOR_CENTERED_TEXT
                      ? "center"
                      : "left",
                }}
                className="min-h-20 font-mono text-xl leading-relaxed text-[#FFF3E4]"
              >
                {displayedText}
              </p>
              <div className="flex w-full h-8 justify-end items-end -my-2">
                <PressContinue isVisible={phase === "waiting"} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
