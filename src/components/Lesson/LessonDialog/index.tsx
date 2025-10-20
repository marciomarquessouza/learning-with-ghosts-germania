import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeviceType } from "@/hooks/useDeviceType";
import Image from "next/image";
import { LessonEntryBox } from "./LessonEntryBox";
import { LessonCTA } from "./LessonCTA";
import { useUiStore } from "@/store/uiStore";
import { useDialogueKeyDown } from "@/hooks/useDialogueKeyDown";
import { CharacterDetails } from "@/hooks/useCharacterDetails";
import { LessonEntry, LessonEntryStep } from "@/types";
import { getDialogueDimension } from "@/components/Dialogues/helpers/getDialgueDimension";

export interface LessonDialogProps {
  show: boolean;
  characterDetails: CharacterDetails | null;
  stepDescription: string;
  lessonEntry: Omit<LessonEntry, "steps">;
  lessonStep: LessonEntryStep;
  nextStep: () => void;
}

export function LessonDialog({
  show,
  characterDetails,
  stepDescription,
  lessonEntry,
  lessonStep,
  nextStep,
}: LessonDialogProps) {
  const [visible, setVisible] = useState(false);
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
  }, [visible, show]);

  useEffect(() => {
    setInteractionDialogueOpen(visible);
    if (visible) {
      requestAnimationFrame(() => boxRef.current?.focus());
    }
  }, [visible, setInteractionDialogueOpen]);

  const advanceLine = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const handleClickOnText = useCallback(() => {}, []);

  const handleOnClick = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const handleKeyDown = useDialogueKeyDown({
    // keyAction: () => handleTextClick(() => advanceLine()),
  });

  const startTyping = () => {};

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
          onAnimationComplete={startTyping}
          transition={{ duration: 0.5, ease: "linear" }}
          onClick={handleClickOnText}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-live="polite"
        >
          <div
            className="absolute top-2 left-6
					   text-xl font-primary font-semibold tracking-wide"
          >
            {characterDetails.hasHonorific && (
              <span className="text-neutral-800">
                {`${characterDetails.honorific} `}
              </span>
            )}
            <span className="font-bold text-neutral-800">
              {characterDetails.characterName}
            </span>
            <span className="text-[#B20F00] font-bold"> asks: </span>
          </div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 ">
            <Image
              src={characterDetails.avatarURL}
              width={70}
              height={91}
              alt={`${characterDetails.characterName} picture`}
              priority
            />
          </div>
          <div className="flex-1 min-w-0 px-6 pt-6 pb-4 flex flex-col h-full">
            <div className="mt-2 bg-[rgba(245,245,245,0.5)] px-2 pt-2.5 pb-2 outline-1 outline-neutral-300 rounded-sm flex-1 overflow-auto">
              <p className="text-center min-h-13 text-neutral-900 font-mono text-lg leading-snug whitespace-pre-line mt-2">
                {stepDescription}
              </p>
              <div className="flex justify-center items-center">
                <LessonEntryBox
                  {...lessonEntry}
                  step={lessonStep}
                  isTypingComplete={false}
                />
              </div>
            </div>
            <LessonCTA step={lessonStep} onClick={handleOnClick} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
