import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PressContinue } from "../../PressContinue";
import { renderFormattedText } from "@/libs/dialogues/renderFormattedText";
import { IconAudio } from "../../LessonChallenges/icons/IconAudio";
import { events } from "@/events/events";

export type DescriptionPhases =
  | "hidden"
  | "entering"
  | "typing"
  | "ready"
  | "exiting";

export interface StepDescriptionProps {
  isVisible: boolean;
  description: string;
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

const MAXIMUM_SIZE_FOR_CENTERED_TEXT = 80;

export function StepDescription({
  isVisible,
  description,
  hidePressContinue = true,
  onPhaseChange,
}: StepDescriptionProps) {
  const [phase, setPhase] = useState<DescriptionPhases>("hidden");
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
    if (phase === "ready" && lastDescription.current !== description) {
      lastDescription.current = description;
      changePhase("ready");
    }
  }, [changePhase, description, phase]);

  const handleOnExit = () => {
    changePhase("hidden");
  };

  if (phase === "hidden") return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={handleOnExit}>
      {isVisible && (
        <motion.div
          tabIndex={0}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          onAnimationComplete={() => {
            if (phase === "entering") {
              lastDescription.current = description;
              changePhase("ready");
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
                {renderFormattedText(description, {
                  audioIcon: <IconAudio fill="#FFF3E4" stroke="#FFF3E4" />,
                  playAudio: (audio) =>
                    events.audio.sync.emit("audio:play-sample", {
                      audioKey: audio,
                    }),
                })}
              </p>
              <div className="flex w-full h-8 justify-end items-end -my-2">
                <PressContinue
                  isVisible={!hidePressContinue && phase === "ready"}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
