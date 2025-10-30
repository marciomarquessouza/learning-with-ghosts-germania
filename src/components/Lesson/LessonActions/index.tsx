import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useUiStore } from "@/store/uiStore";
import { useDialogueKeyDown } from "@/hooks/useDialogueKeyDown";
import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { LessonEntry, LessonEntryStep } from "@/types";
import { getDialogueDimension } from "@/components/Dialogues/helpers/getDialgueDimension";
import { StepIntroduction } from "./StepIntrodution";
import { StepPronunciation } from "./StepPronunciation";
import { StepWriting } from "./StepWriting";

export interface LessonActionsProps {
  show: boolean;
  characterDetails: CharacterDetails | null;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  nextStep: () => void;
}

export function LessonActions({
  show,
  characterDetails,
  lessonEntry,
  lessonStep,
  nextStep,
}: LessonActionsProps) {
  const [visible, setVisible] = useState(false);
  const [showEntry, setShowEntry] = useState(false);
  const device = useDeviceType();
  const boxRef = useRef<HTMLDivElement>(null);
  const { heightClass, widthClass } = useMemo(
    () => getDialogueDimension(device),
    [device]
  );
  const { setInteractionDialogueOpen } = useUiStore();

  useEffect(() => {
    if (show && !visible) {
      setVisible(show);
    }
  }, [visible, show, lessonStep?.instruction]);

  useEffect(() => {
    setInteractionDialogueOpen(visible);
    if (visible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [visible, setInteractionDialogueOpen]);

  const handleClickOnText = useCallback(() => {}, []);

  const handleOnClick = useCallback(() => {
    nextStep();
    setVisible(false);
  }, [nextStep]);

  const handleKeyDown = useDialogueKeyDown({
    // keyAction: () => resumeText(() => advanceLine()),
  });

  if (!visible || !characterDetails) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={boxRef}
          tabIndex={0}
          className={`fixed left-1/2 -translate-x-1/2 ${heightClass} ${widthClass}
                      bg-[url('/dialogue/dialogue_background.png')] bg-cover bg-center
                      shadow-xl outline-none`}
          initial={{ opacity: 0, bottom: -40 }}
          animate={{ opacity: 1, bottom: 46 }}
          exit={{ opacity: 0, bottom: -40 }}
          onAnimationComplete={() => setShowEntry(true)}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleClickOnText}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-live="polite"
        >
          {lessonStep.type === "introduction" && (
            <StepIntroduction
              lessonEntry={lessonEntry}
              lessonStep={lessonStep}
              onClick={handleOnClick}
              show={showEntry}
            />
          )}
          {lessonStep.type === "pronunciation" && (
            <StepPronunciation
              lessonEntry={lessonEntry}
              lessonStep={lessonStep}
              onClick={handleOnClick}
              show={showEntry}
            />
          )}
          {lessonStep.type === "writing" && (
            <StepWriting
              lessonEntry={lessonEntry}
              lessonStep={lessonStep}
              onClick={handleOnClick}
              show={showEntry}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
