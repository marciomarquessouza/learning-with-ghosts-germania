import { useTypewriter } from "@/gameUI/hooks/useTypewriter";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PressContinue } from "./PressContinue";
import { createDialogueKeyDownHandler } from "@/libs/inputs/createDialogueKeyDownHandler";

export type DescriptionPhases =
  | "hidden"
  | "entering"
  | "typing"
  | "ready"
  | "exiting";

export interface StepDescriptionProps {
  isVisible: boolean;
  description: string;
  descriptionUpdate?: string;
  hidePressContinue?: boolean;
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

export function StepDescription({
  isVisible,
  description,
  hidePressContinue = false,
  descriptionUpdate,
  onPhaseChange,
}: StepDescriptionProps) {
  const [phase, setPhase] = useState<DescriptionPhases>("hidden");
  const {
    displayedText,
    setTextToType,
    startTyping,
    updateDisplayedText,
    resumeText,
    isComplete,
  } = useTypewriter();
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

  useEffect(() => {
    if (descriptionUpdate && descriptionUpdate !== displayedText) {
      updateDisplayedText(descriptionUpdate);
    }
  }, [descriptionUpdate, updateDisplayedText, displayedText]);

  const handleOnExit = () => {
    setTextToType("");
    changePhase("hidden");
  };

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [isVisible]);

  const handleKeyAction = useCallback(() => {
    if (phase === "typing") {
      resumeText();
    }
  }, [phase, resumeText]);

  const handleKeyDown = useMemo(
    () =>
      createDialogueKeyDownHandler(
        { keyAction: handleKeyAction },
        { enabled: phase === "typing" },
      ),
    [handleKeyAction, phase],
  );

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
          className="pointer-events-none absolute left-0 top-12 flex w-full items-center px-12 text-white outline-none"
          role="dialog"
          aria-live="polite"
        >
          <div className="flex w-full flex-col items-center">
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
                <PressContinue
                  isVisible={phase === "ready" && !hidePressContinue}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
