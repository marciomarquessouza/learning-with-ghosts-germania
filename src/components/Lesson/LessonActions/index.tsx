import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeviceType } from "@/hooks/useDeviceType";
import { LessonEntryBox } from "./LessonEntryBox";
import { LessonCTA } from "./LessonCTA";
import { useUiStore } from "@/store/uiStore";
import { useDialogueKeyDown } from "@/hooks/useDialogueKeyDown";
import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { LessonEntry, LessonEntryStep } from "@/types";
import { getDialogueDimension } from "@/components/Dialogues/helpers/getDialgueDimension";
import { getActionTitleByType } from "../helpers/getActionTitleByType";

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
          <div
            className="absolute flex w-full items-center justify-center
					   text-xl font-primary font-semibold tracking-wide"
          >
            <span className="font-bold text-neutral-800 mt-1">
              {getActionTitleByType(lessonStep.type)}
            </span>
          </div>
          <div className="flex-1 min-w-0 px-6 pt-6 pb-4 flex flex-col h-full">
            <LessonEntryBox
              {...lessonEntry}
              step={lessonStep}
              isTypingComplete={showEntry}
            />
          </div>
          <LessonCTA step={lessonStep} onClick={handleOnClick} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
